"use client";

import Link from "next/link";
import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
} from "../chatgpt-auth-client";
import { useAcademy } from "./AcademyProvider";

export function AcademyShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: "curriculum" | "deliverables" | "lesson";
}) {
  const { ready, source, backend, completedCount, totalLessons, next, error } =
    useAcademy();
  const pct = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  return (
    <>
      <nav className="pocNav academyNav" aria-label="LAB Academy">
        <Link href="/">← Concept Lab</Link>
        <b>LAB / ACADEMY</b>
        <div className="navLinks">
          <Link
            href="/academy"
            aria-current={active === "curriculum" ? "page" : undefined}
          >
            Curriculum
          </Link>
          <Link
            href="/academy/deliverables"
            aria-current={active === "deliverables" ? "page" : undefined}
          >
            Deliverables
          </Link>
          {next ? (
            <Link
              href={`/academy/${next.phaseSlug}/${next.lessonSlug}`}
              className="navCta"
            >
              {completedCount === 0 ? "Start" : "Resume"}
            </Link>
          ) : null}
        </div>
      </nav>

      <div className="academyStatus" role="status">
        <span>
          {ready
            ? `${completedCount}/${totalLessons} · ${pct}%`
            : "Loading…"}
        </span>
        <span className="dot" aria-hidden="true" />
        <span>
          {source === "chatgpt" ? "Signed in" : "Guest session"}
          {backend ? ` · ${backend === "d1" ? "D1" : "memory"}` : ""}
        </span>
        <span className="dot" aria-hidden="true" />
        {source === "chatgpt" ? (
          <a href={chatGPTSignOutPath("/academy")}>Sign out</a>
        ) : (
          <a href={chatGPTSignInPath("/academy")}>Sign in with ChatGPT</a>
        )}
      </div>

      {error ? (
        <p className="academyBanner" role="alert">
          Sync issue: {error}. Local drafts are still available.
        </p>
      ) : null}

      {children}
    </>
  );
}
