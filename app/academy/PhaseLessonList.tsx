"use client";

import Link from "next/link";
import { useAcademy } from "./AcademyProvider";
import type { Lesson } from "../../content/academy/types";

export function PhaseLessonList({
  phaseSlug,
  phaseNumber,
  lessons,
}: {
  phaseSlug: string;
  phaseNumber: string;
  lessons: Lesson[];
}) {
  const { isComplete } = useAcademy();

  return (
    <section className="lessonList" id="lessons">
      <p className="tag">{lessons.length} lessons</p>
      {lessons.map((lesson, i) => {
        const done = isComplete(phaseSlug, lesson.slug);
        return (
          <Link
            key={lesson.slug}
            href={`/academy/${phaseSlug}/${lesson.slug}`}
            className={`lessonRow${done ? " done" : ""}`}
          >
            <span className="idx">
              {done
                ? "✓"
                : `${phaseNumber}.${String(i + 1).padStart(2, "0")}`}
            </span>
            <h3>{lesson.title}</h3>
            <span className="dur">{lesson.duration}</span>
            <p>{lesson.summary}</p>
          </Link>
        );
      })}
    </section>
  );
}
