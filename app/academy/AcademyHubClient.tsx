"use client";

import Link from "next/link";
import { useAcademy } from "./AcademyProvider";
import type { Phase } from "../../content/academy/types";

export function AcademyHubClient({
  phases,
  totalLessons,
  thesis,
  subtitle,
  tagline,
  title,
}: {
  phases: Phase[];
  totalLessons: number;
  thesis: string;
  subtitle: string;
  tagline: string;
  title: string;
}) {
  const { ready, completedCount, isComplete } = useAcademy();
  const pct = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;
  const words = title.split(" ");

  return (
    <>
      <section className="academyHero">
        <p className="tag">{subtitle}</p>
        <p className="academyTagline">{tagline}</p>
        <h1>
          {words[0]}
          <br />
          <em>{words.slice(1).join(" ")}</em>
        </h1>
        <p className="lead">
          {phases.length} phases · {totalLessons} lessons · one path from
          uncertainty to execution. Frontend curriculum, backend progress —
          every deliverable you write is stored against your learner identity.
        </p>
        <div className="hubProgress">
          <p className="progressLabel">
            {ready
              ? `${completedCount} of ${totalLessons} lessons complete · ${pct}%`
              : "Loading progress…"}
          </p>
          <div className="progressTrack">
            <div className="progressFill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="academyThesis">
        <p className="tag">Why this exists</p>
        <h2>Proof before polish applies to you, too.</h2>
        <p>{thesis}</p>
      </section>

      <section className="phaseGrid" id="curriculum">
        {phases.map((phase) => {
          const done = phase.lessons.filter((l) =>
            isComplete(phase.slug, l.slug)
          ).length;
          return (
            <Link
              key={phase.slug}
              href={`/academy/${phase.slug}`}
              className="phaseCard"
            >
              <span className="num">
                {phase.number} / {phase.title}
              </span>
              <h3>{phase.tagline}</h3>
              <span className="phaseTag">
                {done}/{phase.lessons.length} lessons complete
              </span>
              <p>{phase.description}</p>
              <span className="meta">
                Outcome → {phase.outcome.slice(0, 60)}…
              </span>
            </Link>
          );
        })}
      </section>
    </>
  );
}
