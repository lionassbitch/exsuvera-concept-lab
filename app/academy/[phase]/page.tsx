import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPhases, getPhase } from "../../../content/academy/curriculum";
import "../academy.css";

type Props = { params: Promise<{ phase: string }> };

export async function generateStaticParams() {
  return getAllPhases().map((p) => ({ phase: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { phase: slug } = await params;
  const phase = getPhase(slug);
  if (!phase) return { title: "LAB Academy" };
  return {
    title: `${phase.title} — LAB Academy`,
    description: phase.description,
  };
}

export default async function PhasePage({ params }: Props) {
  const { phase: slug } = await params;
  const phase = getPhase(slug);
  if (!phase) notFound();

  return (
    <main className="academyPage">
      <nav className="pocNav">
        <Link href="/academy">← LAB Academy</Link>
        <b>
          {phase.number} / {phase.title.toUpperCase()}
        </b>
        <Link href="#lessons">Lessons</Link>
      </nav>

      <section className="phaseHero">
        <p className="tag">Phase {phase.number}</p>
        <h1>
          {phase.title}.
          <br />
          <em>{phase.tagline}</em>
        </h1>
        <p className="lead">{phase.description}</p>
        <div className="phaseOutcome">
          <b>Phase outcome</b>
          <p>{phase.outcome}</p>
        </div>
      </section>

      <section className="lessonList" id="lessons">
        <p className="tag">{phase.lessons.length} lessons</p>
        {phase.lessons.map((lesson, i) => (
          <Link
            key={lesson.slug}
            href={`/academy/${phase.slug}/${lesson.slug}`}
            className="lessonRow"
          >
            <span className="idx">
              {phase.number}.{String(i + 1).padStart(2, "0")}
            </span>
            <h3>{lesson.title}</h3>
            <span className="dur">{lesson.duration}</span>
            <p>{lesson.summary}</p>
          </Link>
        ))}
      </section>

      <footer className="source">
        <Link href="/academy">All phases</Link>
        <span>Exsuvera × LAB</span>
      </footer>
    </main>
  );
}
