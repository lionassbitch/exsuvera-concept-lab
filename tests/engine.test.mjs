import assert from "node:assert/strict";
import test from "node:test";
import { runEngine, specificity, toPayload, SLOTS } from "../app/lib/engine.mjs";

/** Build four takes from a compact spec, defaulting the boring fields. */
const mk = (spec) =>
  SLOTS.map((slot) => ({
    slot,
    text: spec[slot]?.[0] ?? "",
    onsetMs: spec[slot]?.[1] ?? 800,
    durationMs: (spec[slot]?.[1] ?? 800) + 5000,
    pauses: spec[slot]?.[2] ?? 0,
    longestMs: spec[slot]?.[3] ?? 0,
    corrections: 0,
  }));

const SHARP = {
  what:  ["A 6-week strength program for postpartum runners, $240.", 600],
  who:   ["Marisa Delgado, 34, ran Boston in 2023 and cannot run a mile now.", 900],
  proof: ["Marisa paid $240 on 11 March. Two more paid full price that week.", 800],
  fail:  ["If I cannot keep 8 of 10 clients past week 3 the program does not work.", 1400],
};

test("specificity counts particulars, not adjectives", () => {
  assert.equal(specificity("amazing innovative seamless solution"), 0);
  assert.ok(specificity("Marisa paid $240 on 11 March") > 0);
  // a sentence-initial capital is not a name
  assert.equal(specificity("Busy families nearby"), 0);
});

test("offer-without-customer fires on the two-clock gap", () => {
  const { finding } = runEngine(mk({
    what:  ["Sunday meal prep packs, ready Friday, twenty bucks.", 600],
    who:   ["Busy families I guess, within about three miles.", 8000],
    proof: ["A few people said they'd be interested, hoping to launch soon.", 1500],
    fail:  ["Honestly if the economy tanks or a competitor undercuts me.", 1200],
  }));
  assert.equal(finding.key, "OFFER_NO_CUSTOMER");
  assert.equal(finding.rank, 1);
  assert.match(finding.caption, /longer to reach the customer/);
});

test("a sharp founder gets NO finding — the credibility mechanism", () => {
  const { finding, fired } = runEngine(mk(SHARP));
  assert.equal(finding, null);
  assert.equal(fired.length, 0);
});

test("repeated deflection outranks every other fired detector", () => {
  const r = runEngine(mk({
    what:  ["Consulting.", 700],
    who:   ["Small businesses mostly.", 6500],
    proof: ["Not yet.", 900],
    fail:  ["If the market shifts or funding dries up I guess.", 1100],
  }));
  assert.equal(r.finding.key, "AVOIDED");
  assert.equal(r.finding.rank, 0);
  // it won against competition, not by being the only one
  assert.ok(r.fired.length >= 3, `expected several detectors, got ${r.fired.length}`);
  assert.ok(r.fired.some((f) => f.key === "OFFER_NO_CUSTOMER"));
});

test("invulnerable fires on a slow answer even with no external words", () => {
  const { finding } = runEngine(mk({
    ...SHARP,
    fail: ["I suppose I have not really thought that through properly at all.", 18000],
  }));
  assert.equal(finding.key, "INVULNERABLE");
  assert.match(finding.why, /first time you've been asked/);
});

test("confidence is bounded and rises with signal strength", () => {
  const mild = runEngine(mk({ ...SHARP, who: ["Busy families.", 6000] })).finding;
  const loud = runEngine(mk({ ...SHARP, who: ["Busy families.", 25000] })).finding;
  for (const f of [mild, loud]) {
    assert.ok(f.confidence > 0 && f.confidence <= 1, `out of range: ${f.confidence}`);
  }
  assert.ok(loud.confidence > mild.confidence, "a bigger stall should read as more confident");
});

test("every take is missing-slot safe", () => {
  assert.throws(() => runEngine([{ slot: "what", text: "x", onsetMs: 1, durationMs: 1 }]), /missing slot/);
});

test("payload withholds free text unless consent is given", () => {
  const takes = mk(SHARP);
  const r = runEngine(takes);

  const priv = toPayload(takes, r, { consent: false });
  assert.equal(priv.consented_text, false);
  for (const t of priv.takes) {
    assert.equal("text" in t, false, "text must not be present without consent");
    assert.ok(typeof t.specificity === "number", "signals still travel");
  }

  const shared = toPayload(takes, r, { consent: true });
  assert.equal(shared.consented_text, true);
  assert.ok(shared.takes.every((t) => typeof t.text === "string"));
});

test("payload matches the ingest contract", () => {
  const takes = mk(SHARP);
  const p = toPayload(takes, runEngine(takes), { mode: "voice" });
  assert.equal(p.takes.length, 4);
  assert.deepEqual(p.takes.map((t) => t.slot), [...SLOTS]);
  assert.equal(p.finding_key, null);          // sharp founder → null is valid
  assert.equal(p.mode, "voice");
  assert.ok(Number.isInteger(p.total_ms) && p.total_ms >= 0);
  for (const t of p.takes) {
    for (const k of ["onset_ms", "duration_ms", "pauses", "longest_ms", "words", "specificity", "hedges", "corrections"]) {
      assert.ok(Number.isInteger(t[k]), `${t.slot}.${k} must be an integer`);
    }
  }
});
