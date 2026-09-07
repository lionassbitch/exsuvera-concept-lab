import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentLessons,
  getAllPhases,
  getLesson,
  getLessonIndex,
  getPhase,
  getTotalLessons,
} from "../../../../content/academy/curriculum";
import { ExerciseWorkspace } from "../../ExerciseWorkspace";

type Props = { params: Promise<{ phase: string; lesson: string }> };

export async function generateStaticParams() {
  return getAllPhases().flatMap((p) =>
    p.lessons.map((l) => ({ phase: p.slug, lesson: l.slug }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { phase: phaseSlug, lesson: lessonSlug } = await params;
  const lesson = getLesson(phaseSlug, lessonSlug);
  if (!lesson) return { title: "LAB Academy" };
  return {
    title: `${lesson.title} — LAB Academy`,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const { phase: phaseSlug, lesson: lessonSlug } = await params;
  const phase = getPhase(phaseSlug);
  const lesson = getLesson(phaseSlug, lessonSlug);
  if (!phase || !lesson) notFound();

  const index = getLessonIndex(phaseSlug, lessonSlug);
  const total = getTotalLessons();
  const { prev, next } = getAdjacentLessons(phaseSlug, lessonSlug);
  const pct = Math.round((index / total) * 100);
  const lessonNum =
    phase.lessons.findIndex((l) => l.slug === lessonSlug) + 1;

  return (
    <main className="academyPage">
      <nav className="pocNav">
        <Link href={`/academy/${phase.slug}`}>← {phase.title}</Link>
        <b>
          {phase.number}.{String(lessonNum).padStart(2, "0")}
        </b>
        <Link href="/academy">Academy</Link>
      </nav>

      <div className="progressBar">
        <p className="progressLabel">
          Lesson {index} of {total}
        </p>
        <div className="progressTrack">
          <div className="progressFill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <section className="lessonHero">
        <p className="tag">
          Phase {phase.number} · {phase.title}
        </p>
        <h1>{lesson.title}</h1>
        <div className="lessonMeta">
          <span className="idx">
            {index}/{total}
          </span>
          <span>{lesson.duration}</span>
        </div>
        <p className="lead">{lesson.summary}</p>
      </section>

      <section className="lessonBody">
        <div className="objectives">
          <b>Objectives</b>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>

        <div className="prose">
          {lesson.body.map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>

        {lesson.exercise ? (
          <ExerciseWorkspace
            phaseSlug={phase.slug}
            lessonSlug={lesson.slug}
            title={lesson.exercise.deliverable}
            prompt={lesson.exercise.prompt}
            time={lesson.exercise.time}
          />
        ) : null}

        {lesson.toolLink && (
          <Link href={lesson.toolLink.href} className="toolLink">
            {lesson.toolLink.label}
          </Link>
        )}
      </section>

      <nav className="lessonNav" aria-label="Lesson navigation">
        {prev ? (
          <Link href={`/academy/${prev.phase.slug}/${prev.lesson.slug}`}>
            <span>Previous</span>
            <b>{prev.lesson.title}</b>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/academy/${next.phase.slug}/${next.lesson.slug}`}
            className="next"
          >
            <span>Next</span>
            <b>{next.lesson.title}</b>
          </Link>
        ) : (
          <Link href="/academy" className="next">
            <span>Complete</span>
            <b>Return to Academy →</b>
          </Link>
        )}
      </nav>

      <footer className="source">
        <span>{lesson.exercise?.deliverable ?? phase.outcome}</span>
        <span>Exsuvera × LAB</span>
      </footer>
    </main>
  );
}
