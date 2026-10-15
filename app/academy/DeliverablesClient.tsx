"use client";

import Link from "next/link";
import { useAcademy } from "./AcademyProvider";
import { AcademyShell } from "./AcademyShell";
import { getPhase } from "../../content/academy/curriculum";

export function DeliverablesClient() {
  const { ready, deliverables, exportMarkdown, next } = useAcademy();

  function onExport() {
    const md = exportMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lab-academy-deliverables-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AcademyShell active="deliverables">
      <section className="phaseHero">
        <p className="tag">Your work</p>
        <h1>
          Deliverables
          <br />
          <em>library.</em>
        </h1>
        <p className="lead">
          Everything you&apos;ve written across LAB Academy — saved to the
          backend, cached locally, exportable as Markdown.
        </p>
        <div className="hubActions">
          <button type="button" className="pill blue" onClick={onExport}>
            Export Markdown
          </button>
          {next ? (
            <Link
              href={`/academy/${next.phaseSlug}/${next.lessonSlug}`}
              className="pill plainBtn"
            >
              Resume curriculum
            </Link>
          ) : null}
        </div>
      </section>

      <section className="deliverableList">
        {!ready ? (
          <p className="emptyState">Loading deliverables…</p>
        ) : deliverables.length === 0 ? (
          <div className="emptyState">
            <p>No deliverables yet.</p>
            <p>
              Complete a lesson exercise and hit Save — your work will show up
              here.
            </p>
            {next ? (
              <Link
                href={`/academy/${next.phaseSlug}/${next.lessonSlug}`}
                className="pill blue"
              >
                Start first lesson
              </Link>
            ) : null}
          </div>
        ) : (
          deliverables.map((row) => {
            const phase = getPhase(row.phaseSlug);
            return (
              <article
                key={`${row.phaseSlug}-${row.lessonSlug}`}
                className="deliverableCard"
              >
                <header>
                  <span className="tag">
                    {phase?.number ?? "—"} / {phase?.title ?? row.phaseSlug}
                  </span>
                  <h2>{row.title}</h2>
                  <Link
                    href={`/academy/${row.phaseSlug}/${row.lessonSlug}`}
                    className="delivLink"
                  >
                    Open lesson →
                  </Link>
                </header>
                <pre>{row.body || "(empty)"}</pre>
                <footer>
                  Updated{" "}
                  {row.updatedAt
                    ? new Date(row.updatedAt).toLocaleString()
                    : "—"}
                </footer>
              </article>
            );
          })
        )}
      </section>
    </AcademyShell>
  );
}
