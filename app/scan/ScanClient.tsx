"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// Plain ESM, shared with `node --test`. Typed through its JSDoc, so this
// import carries real types rather than `any`.
import { QUESTIONS, runEngine, toPayload } from "../lib/engine.mjs";

type Phase = "intro" | "asking" | "working" | "result";
type Slot = "what" | "who" | "proof" | "fail";
type Sample = { t: number; v: number };
type Take = {
  slot: Slot;
  text: string;
  onsetMs: number;
  durationMs: number;
  pauses: number;
  longestMs: number;
  corrections: number;
  samples: Sample[];
};

const PAUSE_MS = 1300;

/**
 * Renders one answer's activity envelope, with the dead air labelled.
 * When `live`, it reads the frame from a ref inside its own rAF loop rather
 * than re-rendering React — a 60fps trace must not cost 60 renders a second.
 */
function Trace({
  take, getFrame, live = false, height = 108,
}: {
  take?: Take | null;
  getFrame?: () => Take | null;
  live?: boolean;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<Take | null>(null);

  const draw = useCallback(() => {
    const c = ref.current;
    const t = live && getFrame ? getFrame() : take;
    frameRef.current = t ?? null;
    if (!c || !t) return;
    const rect = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(1, Math.round(rect.width * dpr));
    c.height = Math.max(1, Math.round(rect.height * dpr));
    const g = c.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    g.clearRect(0, 0, w, h);

    const span = Math.max(6000, t.durationMs || 6000);
    const x = (ms: number) => (ms / span) * w;
    const base = h - 14;


    if (t.onsetMs > 0) {
      const ow = x(t.onsetMs);
      g.fillStyle = "rgba(198,255,74,.10)";
      g.fillRect(0, 0, ow, h);
      g.strokeStyle = "#c6ff4a";
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(ow + 0.5, 0); g.lineTo(ow + 0.5, h); g.stroke();
      if (ow > 78) {
        const label = `${(t.onsetMs / 1000).toFixed(1)}s before the first word`;
        g.font = "10px ui-monospace, monospace";
        g.fillStyle = "#c6ff4a";
        g.fillText(label, Math.max(6, ow / 2 - g.measureText(label).width / 2), h / 2 + 3);
      }
    }

    g.strokeStyle = "rgba(233,230,221,.22)";
    g.beginPath(); g.moveTo(0, base + 0.5); g.lineTo(w, base + 0.5); g.stroke();

    if (t.samples.length > 1) {
      g.beginPath();
      g.moveTo(x(t.samples[0].t), base);
      for (const s of t.samples) g.lineTo(x(s.t), base - s.v * (base - 8));
      g.lineTo(x(t.samples[t.samples.length - 1].t), base);
      g.closePath();
      g.fillStyle = "rgba(41,73,255,.30)";
      g.fill();
      g.strokeStyle = "#e9e6dd";
      g.lineWidth = 1.4;
      g.beginPath();
      t.samples.forEach((s, i) => {
        const px = x(s.t), py = base - s.v * (base - 8);
        if (i) g.lineTo(px, py); else g.moveTo(px, py);
      });
      g.stroke();
    }

    const step = span > 24000 ? 10 : span > 12000 ? 5 : 2;
    g.fillStyle = "rgba(154,162,186,.9)";
    g.font = "9px ui-monospace, monospace";
    for (let s = step; s * 1000 < span; s += step) g.fillText(`${s}s`, x(s * 1000) + 3, h - 3);
  }, [take, live, getFrame]);

  useEffect(() => {
    let id = 0;
    if (live) {
      const loop = () => { draw(); id = requestAnimationFrame(loop); };
      id = requestAnimationFrame(loop);
    } else {
      draw();
    }
    window.addEventListener("resize", draw, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", draw);
    };
  }, [draw, live]);

  return <canvas ref={ref} className="traceC" style={{ height }} aria-hidden="true" />;
}

export default function ScanClient({
  api,
  initialStats,
}: {
  api: string;
  initialStats: { total: number; median_delta_ms: number } | null;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [takes, setTakes] = useState<Take[]>([]);
  const [result, setResult] = useState<ReturnType<typeof runEngine> | null>(null);
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [stats, setStats] = useState(initialStats);

  const t0 = useRef(0);
  const onset = useRef(0);
  const lastKey = useRef(0);
  const pauses = useRef(0);
  const longest = useRef(0);
  const corrections = useRef(0);
  const samples = useRef<Sample[]>([]);
  const raf = useRef(0);
  const decay = useRef(0);
  const ta = useRef<HTMLTextAreaElement | null>(null);
  // the live frame lives in a ref; Trace reads it inside its own rAF
  const frame = useRef<Take | null>(null);

  const startQuestion = useCallback(() => {
    t0.current = performance.now();
    onset.current = 0; lastKey.current = 0; pauses.current = 0;
    longest.current = 0; corrections.current = 0; decay.current = 0;
    samples.current = [];
    const tick = () => {
      const t = performance.now() - t0.current;
      decay.current *= 0.9;
      samples.current.push({ t, v: decay.current });
      if (samples.current.length > 3000) samples.current.shift();
      frame.current = {
        slot: QUESTIONS[i].slot as Slot, text: "", onsetMs: onset.current,
        durationMs: Math.max(6000, t), pauses: pauses.current,
        longestMs: longest.current, corrections: 0, samples: samples.current,
      };
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [i]);

  useEffect(() => {
    if (phase === "asking") { startQuestion(); ta.current?.focus(); }
    return () => cancelAnimationFrame(raf.current);
  }, [phase, i, startQuestion]);

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const now = performance.now();
    if (!onset.current) onset.current = now - t0.current;
    if (lastKey.current) {
      const gap = now - lastKey.current;
      if (gap > PAUSE_MS) { pauses.current++; longest.current = Math.max(longest.current, gap); }
    }
    lastKey.current = now;
    decay.current = Math.min(1, decay.current + 0.34);
    setValue(e.target.value);
  }

  function next() {
    cancelAnimationFrame(raf.current);
    const now = performance.now();
    const take: Take = {
      slot: QUESTIONS[i].slot as Slot,
      text: value.trim(),
      onsetMs: onset.current || now - t0.current,
      durationMs: now - t0.current,
      pauses: pauses.current,
      longestMs: longest.current,
      corrections: corrections.current,
      samples: [...samples.current],
    };
    const all = [...takes, take];
    setTakes(all);
    if (i + 1 < QUESTIONS.length) { setValue(""); setI(i + 1); return; }
    setPhase("working");
    const r = runEngine(all);
    setResult(r);
    setTimeout(() => setPhase("result"), 900);
  }

  /** Sending is explicit and opt-in: nothing leaves the browser until asked. */
  async function contribute() {
    if (!result) return;
    setSent("sending");
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toPayload(takes, result, { mode: "text", consent })),
      });
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as { stats?: { total: number; median_delta_ms: number } };
      if (body.stats) setStats(body.stats);
      setSent("ok");
    } catch {
      setSent("fail");
    }
  }

  function reset() {
    setPhase("intro"); setI(0); setTakes([]); setResult(null);
    setSent("idle"); setValue(""); frame.current = null;
  }

  const finding = result?.finding ?? null;
  const proof = finding ? takes.find((t) => t.slot === finding.slot) ?? null : null;

  return (
    <section className="scanApp">
      {phase === "intro" && (
        <div className="panel">
          <p className="tag">Four questions · about ninety seconds</p>
          <p className="lead">
            Answer fast and honestly. Don&apos;t polish — polishing is the thing it&apos;s
            looking for. The engine runs entirely in your browser.
          </p>
          {stats && stats.total > 0 && (
            <p className="statline">
              {stats.total} founder{stats.total === 1 ? "" : "s"} so far · median{" "}
              {(stats.median_delta_ms / 1000).toFixed(1)}s longer to reach the customer
            </p>
          )}
          <button className="pill blue" onClick={() => setPhase("asking")}>
            Begin the scan
          </button>
        </div>
      )}

      {phase === "asking" && (
        <div className="panel">
          <div className="qhead">
            <p className="tag">
              Question {i + 1} of {QUESTIONS.length}
            </p>
            <span className="steps" aria-hidden="true">
              {QUESTIONS.map((_: unknown, n: number) => (
                <i key={n} className={n < i ? "done" : n === i ? "now" : ""} />
              ))}
            </span>
          </div>
          <label className="qlabel" htmlFor="scanAnswer">{QUESTIONS[i].q}</label>
          <p className="hint">{QUESTIONS[i].hint}</p>
          <Trace getFrame={() => frame.current} live />
          <textarea
            id="scanAnswer"
            ref={ta}
            rows={4}
            value={value}
            onChange={onInput}
            onKeyDown={(e) => { if (e.key === "Backspace" || e.key === "Delete") corrections.current++; }}
            spellCheck={false}
            autoComplete="off"
          />
          <div className="acts">
            {/* one word must be submittable: a curt answer IS the deflection signal */}
            <button className="pill blue" onClick={next} disabled={value.trim().length === 0}>
              {i + 1 === QUESTIONS.length ? "See the finding →" : "Next →"}
            </button>
            <small>{value.trim() ? `${value.trim().split(/\s+/).length} words` : "—"}</small>
          </div>
        </div>
      )}

      {phase === "working" && (
        <div className="panel">
          <p className="tag">Reading the shape of your answers</p>
          <h2 className="working">Ranking by consequence…</h2>
        </div>
      )}

      {phase === "result" && result && (
        <div className="panel result">
          <div className="fhead">
            <span className="k">{finding ? "Blind spot · 01 of 1" : "No finding"}</span>
            <span className="conf">
              {finding
                ? `confidence ${Math.round(finding.confidence * 100)}% · ${result.fired.length} fired`
                : "all detectors under threshold"}
            </span>
          </div>

          {finding ? (
            <>
              <h2>{finding.title}</h2>
              <p>{finding.why}</p>
              <p className="quote">&ldquo;{finding.quote}&rdquo;</p>
              <div className="closeIt">
                <b>Close it</b>
                {finding.close}
              </div>
              {proof && (
                <div className="proof">
                  <p className="tag">{QUESTIONS.find((q: { slot: string }) => q.slot === finding.slot)?.q}</p>
                  <Trace take={proof} height={120} />
                  <small>{finding.caption}</small>
                </div>
              )}
            </>
          ) : (
            <>
              <h2>You cleared all four.</h2>
              <p>
                Uncommon — most founders leak on the third. You answered fast where speed is
                honest, slowly where it should cost something, and with real particulars
                throughout. The scan is deliberately shallow; what survives it is further in.
              </p>
            </>
          )}

          <ul className="signals">
            {result.signals.map((s: { label: string; value: string; hit: boolean; frac: number }) => (
              <li key={s.label} className={s.hit ? "hit" : ""}>
                <span>{s.label}</span>
                <b>{s.value}</b>
                <i><em style={{ width: `${Math.round(s.frac * 100)}%` }} /></i>
              </li>
            ))}
          </ul>

          <div className="contribute">
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              Also share my answers, not just the timings
            </label>
            <div className="acts">
              <button className="pill blue" onClick={contribute} disabled={sent === "sending" || sent === "ok"}>
                {sent === "ok" ? "Added to the corpus" : sent === "sending" ? "Sending…" : "Add to the corpus"}
              </button>
              <button className="pill plainBtn" onClick={reset}>Run it again</button>
            </div>
            <small role="status">
              {sent === "fail"
                ? "Couldn't reach the corpus — your result is unaffected."
                : sent === "ok"
                ? "Recorded. Signals only unless you ticked the box."
                : "Nothing is sent until you press it."}
            </small>
          </div>
        </div>
      )}
    </section>
  );
}
