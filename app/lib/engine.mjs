/**
 * Blind Spot Engine — the detection core.
 *
 * Deliberately a plain ESM module with no DOM and no dependencies, so the
 * same code runs in the browser, on the server, and under `node --test`.
 * Every threshold in here is a starting guess; `labels` in the database is
 * what turns them into calibrated values, by measuring agreement with a
 * human rather than accuracy against nothing.
 *
 * @typedef {Object} Take
 * @property {"what"|"who"|"proof"|"fail"} slot
 * @property {string} text
 * @property {number} onsetMs      time to the first word
 * @property {number} durationMs   total time on the question
 * @property {number} pauses       silences over 1.3s
 * @property {number} longestMs    longest single silence
 * @property {number} corrections  backspace runs, or spoken self-corrections
 */

export const SLOTS = /** @type {const} */ (["what", "who", "proof", "fail"]);

export const QUESTIONS = [
  { slot: "what",  q: "What do you sell?",
    hint: "However you'd say it to someone at a bar. Don't pitch." },
  { slot: "who",   q: "And who buys it?",
    hint: "Not a market. A person." },
  { slot: "proof", q: "Tell me about the last person who paid you.",
    hint: "Or the closest you've come. Either answer is useful." },
  { slot: "fail",  q: "What would have to be true for this to fail?",
    hint: "There's no rehearsed answer to this one. That's the point." },
];

const HEDGE    = /\b(i guess|i think|kind of|kinda|sort of|sorta|maybe|probably|hopefully|i mean|you know|somewhat|pretty much|more or less|or something)\b/gi;
const FILLER   = /\b(um|uh|erm|ah)\b/gi;
const PLURAL   = /\b(people|families|businesses|companies|users|customers|clients|everyone|anyone|folks|professionals|creators|founders|entrepreneurs|moms|parents|students|women|men|brands)\b/gi;
const HYPO     = /\b(would|could|if someone|hoping|hope to|planning to|going to|will be|once i|when i|should be|about to)\b/gi;
const EXTERNAL = /\b(market|economy|recession|competitor|competition|algorithm|funding|investor|investors|timing|luck|regulation|platform|google|apple|amazon|tiktok|instagram)\b/gi;
const RIVAL    = /\b(like|similar to|cheaper than|faster than|better than|instead of|alternative to|but for|version of)\b/gi;

export const count = (s, re) => (String(s || "").match(re) || []).length;
export const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;

/** Particulars: numbers, money and capitalised names carry evidence; adjectives don't. */
export function specificity(s) {
  const t = String(s || "");
  const nums   = count(t, /\b\d[\d,.:]*\b/g);
  const money  = count(t, /[$£€]\s?\d/g);
  // skip the first token so a sentence-initial capital isn't mistaken for a name
  const proper = (t.replace(/^\s*\S+/, "").match(/\b[A-Z][a-z]{2,}\b/g) || []).length;
  return nums + money * 2 + proper * 2;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const over = (v, thresh, ceiling) => clamp01((v - thresh) / (ceiling - thresh));

/**
 * Six detectors, ranked by CONSEQUENCE rather than confidence: when two fire,
 * the one with more downstream dependency wins, because being wrong about it
 * costs more. Rank 0 is reserved for a repeated deflection — the only signal
 * a founder produces twice, unprompted — and it outranks everything.
 *
 * @param {Take[]} takes exactly four, one per slot
 */
export function runEngine(takes) {
  const by = Object.fromEntries(takes.map((t) => [t.slot, t]));
  for (const s of SLOTS) if (!by[s]) throw new Error(`missing slot: ${s}`);

  const signals = [];
  const push = (label, value, hit, frac = 0) =>
    signals.push({ label, value, hit, frac: clamp01(frac) });

  const dLat = by.who.onsetMs - by.what.onsetMs;
  push("onset · what", (by.what.onsetMs / 1000).toFixed(1) + "s", false, by.what.onsetMs / 12000);
  push("onset · who", (by.who.onsetMs / 1000).toFixed(1) + "s", dLat > 5000, by.who.onsetMs / 12000);
  push("delta", (dLat / 1000).toFixed(1) + "s", dLat > 5000, Math.abs(dLat) / 12000);

  const whoSpec = specificity(by.who.text);
  const whoPlural = count(by.who.text, PLURAL);
  push("specificity · who", String(whoSpec), whoSpec === 0, whoSpec ? 1 : 0);
  push("category words · who", String(whoPlural), whoPlural > 0, whoPlural / 2);

  const totalPauses = takes.reduce((n, t) => n + (t.pauses || 0), 0);
  const longest = takes.reduce((m, t) => Math.max(m, t.longestMs || 0), 0);
  push("silences over 1.3s", String(totalPauses), totalPauses >= 3, totalPauses / 6);
  push("longest silence", (longest / 1000).toFixed(1) + "s", longest > 3000, longest / 6000);

  const hedges = takes.reduce((n, t) => n + count(t.text, HEDGE), 0);
  const fillers = takes.reduce((n, t) => n + count(t.text, FILLER), 0);
  push("hedges", String(hedges), hedges >= 3, hedges / 5);

  const proofSpec = specificity(by.proof.text);
  const hypo = count(by.proof.text, HYPO);
  push("specificity · proof", String(proofSpec), proofSpec === 0, proofSpec ? 1 : 0);

  const ext = count(by.fail.text, EXTERNAL);
  push("locus · failure", ext > 0 ? "external" : "internal", ext > 0, ext ? 1 : 0);

  const thin = takes.filter((t) => words(t.text) < 6);
  push("answers under 6 words", String(thin.length), thin.length >= 1, thin.length / 3);

  const fired = [];

  if ((dLat > 5000 && whoSpec === 0) || (whoPlural > 0 && whoSpec === 0)) {
    fired.push({
      key: "OFFER_NO_CUSTOMER", rank: 1, slot: "who",
      confidence: 0.5 + 0.5 * Math.max(over(dLat, 5000, 20000), whoPlural ? 0.6 : 0),
      title: "You have an offer, not a customer.",
      why: `You named what you sell in ${(by.what.onsetMs / 1000).toFixed(1)} seconds. You took ${(by.who.onsetMs / 1000).toFixed(1)} to say who buys it — and when you got there:`,
      quote: by.who.text,
      caption: `${(dLat / 1000).toFixed(1)}s longer to reach the customer than the product.`,
      close: "Name one real person who has already paid you. If you can't, that's your next move — and it's the whole move.",
    });
  }

  if (proofSpec === 0 || hypo >= 2) {
    fired.push({
      key: "NO_PROOF", rank: 2, slot: "proof",
      confidence: 0.55 + 0.45 * over(hypo, 1, 4),
      title: "Nobody has paid you yet.",
      why: "Asked for the last person who paid, you answered with no name, no number, no date — and reached for the conditional:",
      quote: by.proof.text,
      caption: `${hypo} hypothetical marker${hypo === 1 ? "" : "s"}, zero particulars.`,
      close: "Stop refining the offer. Get one paid yes at any price, including a bad one. Everything else is downstream of that.",
    });
  }

  const allFast = takes.every((t) => t.onsetMs < 3200);
  const totalSpec = takes.reduce((n, t) => n + specificity(t.text), 0);
  if (allFast && hedges === 0 && totalSpec < 3) {
    fired.push({
      key: "REHEARSED", rank: 3, slot: "what",
      confidence: 0.5 + 0.5 * (1 - totalSpec / 3),
      title: "This has been said more than it's been checked.",
      why: "Every answer arrived fast, with no hesitation anywhere and almost no particulars. That's fluency, not evidence:",
      quote: by.what.text,
      caption: "No stall on any of the four — including the one designed to cause one.",
      close: "Find the last person who pushed back on this and go ask them again. If nobody has, that's the finding.",
    });
  }

  const rival = count(by.what.text, RIVAL) + count(by.who.text, RIVAL);
  if (rival >= 1 && specificity(by.what.text) > 0) {
    fired.push({
      key: "BORROWED_FRAME", rank: 4, slot: "what",
      confidence: 0.45 + 0.4 * over(rival, 1, 3),
      title: "You're positioned inside someone else's category.",
      why: "You described yourself by comparison — as a version of something that already exists:",
      quote: by.what.text,
      caption: "Self-description anchored to an incumbent.",
      close: "Say what you do without naming them. If the sentence collapses, the category is theirs and you're renting it.",
    });
  }

  const failSlow = by.fail.onsetMs > 12000;
  if (ext > 0 || failSlow) {
    fired.push({
      key: "INVULNERABLE", rank: 5, slot: "fail",
      confidence: 0.5 + 0.4 * (ext ? over(ext, 1, 3) : over(by.fail.onsetMs, 12000, 30000)),
      title: "Every way this fails is someone else's fault.",
      why: failSlow && ext === 0
        ? `You took ${(by.fail.onsetMs / 1000).toFixed(1)} seconds to name a single failure mode. That isn't caution — it's the first time you've been asked.`
        : "Asked how this fails, you put the cause outside yourself:",
      quote: by.fail.text,
      caption: ext ? "Failure located externally." : `${(by.fail.onsetMs / 1000).toFixed(1)}s before the first word.`,
      close: "Write the post-mortem now, dated a year out. The first line you can't write is the actual risk.",
    });
  }

  if (thin.length >= 2) {
    fired.push({
      key: "AVOIDED", rank: 0, slot: thin[0].slot,
      confidence: 0.6 + 0.4 * over(thin.length, 2, 4),
      title: "You moved off the same ground twice.",
      why: "Two of your four answers came in under six words. Whatever you moved toward is comfortable — what you left is the work:",
      quote: thin[0].text,
      caption: `${thin.length} of 4 answers were barely answers.`,
      close: "Go back to the shortest one and answer it properly, out loud, to someone who will push.",
    });
  }

  fired.sort((a, b) => a.rank - b.rank || b.confidence - a.confidence);

  return { finding: fired[0] || null, signals, fired, fillers };
}

/** Shape the telemetry for the ingest endpoint. Free text only with consent. */
export function toPayload(takes, result, { mode = "text", consent = false, version = "site-1.0" } = {}) {
  return {
    mode,
    finding_key: result.finding ? result.finding.key : null,
    finding_rank: result.finding ? result.finding.rank : null,
    confidence: result.finding ? Number(result.finding.confidence.toFixed(3)) : null,
    detectors_fired: result.fired.length,
    total_ms: Math.round(takes.reduce((n, t) => n + (t.durationMs || 0), 0)),
    consented_text: consent,
    client_ver: version,
    takes: takes.map((t) => ({
      slot: t.slot,
      onset_ms: Math.round(t.onsetMs),
      duration_ms: Math.round(t.durationMs),
      pauses: t.pauses | 0,
      longest_ms: Math.round(t.longestMs || 0),
      words: words(t.text),
      specificity: specificity(t.text),
      hedges: count(t.text, HEDGE),
      corrections: t.corrections | 0,
      ...(consent ? { text: String(t.text).slice(0, 4000) } : {}),
    })),
  };
}
