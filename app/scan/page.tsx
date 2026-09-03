import Link from "next/link";
import ScanClient from "./ScanClient";
import { HandwritingText } from "@/components/ui/handwriting-text";
import "../scan/scan.css";

export const metadata = {
  title: "Blind Spot Scan — Exsuvera",
  description:
    "Four questions. The engine reads how you answer, not just what you answer, and names the one thing you can't see about your own business.",
};

// The corpus is live, so the page cannot be statically rendered.
export const dynamic = "force-dynamic";

const API =
  process.env.NEXT_PUBLIC_SCAN_API ??
  "https://objhbnfhjgrjdfsfglvd.supabase.co/functions/v1/scan";

type Stats = {
  total: number;
  no_finding: number;
  findings: Record<string, number>;
  median_delta_ms: number;
  labelled: number;
  agreement: number | null;
};

/**
 * Fetched on the server so the corpus is in the first paint rather than
 * arriving after hydration. A dead backend must never take the page with
 * it — the scan itself works entirely client-side.
 */
async function getStats(): Promise<Stats | null> {
  try {
    const res = await fetch(API, { cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return (await res.json()) as Stats;
  } catch {
    return null;
  }
}

export default async function ScanPage() {
  const stats = await getStats();

  return (
    <main className="scanPage">
      <nav className="pocNav">
        <Link href="/">← Concept Lab</Link>
        <b>BLIND SPOT / SCAN</b>
        <a href="#corpus">Corpus</a>
      </nav>

      <section className="scanHero">
        <p className="tag">Exsuvera × LAB</p>
        <h1>
          It isn&apos;t listening
          <br />
          to your{" "}
          <em>
            {/* Each word completes the sentence with something the engine ignores —
                it reads how the answer is produced, not the answer itself. The pen
                stroke is the same idea made visible: the trace, not the text. */}
            <HandwritingText
              words={["answer.", "pitch.", "story.", "confidence."]}
              interval={3600}
              height="1.05em"
            />
          </em>
        </h1>
        <p className="lead">
          It measures how you produce it — where you start fast, where you stall, where you
          reach for a category instead of a person. That&apos;s the part you can&apos;t
          self-report, and it&apos;s where the blind spot lives.
        </p>
      </section>

      <ScanClient api={API} initialStats={stats} />

      <section className="corpus" id="corpus">
        <p className="tag">The living corpus</p>
        {stats && stats.total > 0 ? (
          <>
            <h2>
              {stats.total} scan{stats.total === 1 ? "" : "s"} run so far.
            </h2>
            <div className="corpusGrid">
              <article>
                <b>{(stats.median_delta_ms / 1000).toFixed(1)}s</b>
                <span>
                  median extra time to reach the customer, versus the product
                </span>
              </article>
              <article>
                <b>
                  {stats.total ? Math.round((stats.no_finding / stats.total) * 100) : 0}%
                </b>
                <span>cleared all four — the engine returned nothing</span>
              </article>
              <article>
                <b>{stats.labelled}</b>
                <span>
                  hand-labelled for calibration
                  {stats.agreement !== null
                    ? ` · ${Math.round(stats.agreement * 100)}% agreement`
                    : " · agreement pending"}
                </span>
              </article>
            </div>
            {Object.keys(stats.findings).length > 0 && (
              <ul className="dist">
                {Object.entries(stats.findings)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, n]) => (
                    <li key={key}>
                      <span>{key.replace(/_/g, " ").toLowerCase()}</span>
                      <i style={{ width: `${Math.round((n / stats.total) * 100)}%` }} />
                      <b>{n}</b>
                    </li>
                  ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h2>Nothing recorded yet.</h2>
            <p>
              {stats
                ? "This is the first run. Every completed scan adds one anonymous row — signals only, never your words unless you say so."
                : "The corpus is unreachable right now, which changes nothing about the scan: the engine runs entirely in your browser."}
            </p>
          </>
        )}
      </section>

      <footer className="source">
        <span>Signals only · text stored solely with explicit consent</span>
        <span>Exsuvera × LAB</span>
      </footer>
    </main>
  );
}
