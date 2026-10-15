"use client";

import Link from "next/link";
import { useAcademy } from "./AcademyProvider";
import { AcademyShell } from "./AcademyShell";
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
  const { ready, completedCount, isComplete, next } = useAcademy();
  const pct = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;
  const words = title.split(" ");
  const done = completedCount === totalLessons && totalLessons > 0;

  return (
    <AcademyShell active="curriculum">
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
          uncertainty to execution. Progress and deliverables persist to the
          academy backend — sign in to keep them across devices.
        </p>

        <div className="hubActions">
          {next && !done ? (
            <Link
              href={`/academy/${next.phaseSlug}/${next.lessonSlug}`}
              className="pill blue"
            >
              {completedCount === 0
                ? `Start · ${next.title}`
                : `Resume · ${next.title}`}
            </Link>
          ) : (
            <Link href="/academy/deliverables" className="pill blue">
              View your deliverables
            </Link>
          )}
          <Link href="/academy/deliverables" className="pill plainBtn">
            Deliverables library
          </Link>
        </div>

        <div className="hubProgress">
          <p className="progressLabel">
            {ready
              ? done
                ? `Curriculum complete · ${totalLessons}/${totalLessons}`
                : `${completedCount} of ${totalLessons} lessons complete · ${pct}%`
              : "Loading progress…"}
          </p>
          <div className="progressTrack" aria-hidden="true">
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
          const phaseDone = phase.lessons.filter((l) =>
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
                {phaseDone}/{phase.lessons.length} lessons complete
              </span>
              <p>{phase.description}</p>
              <span className="meta">
                Outcome → {phase.outcome.slice(0, 60)}…
              </span>
            </Link>
          );
        })}
      </section>
    </AcademyShell>
  );
}
