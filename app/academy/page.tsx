import Link from "next/link";
import {
  curriculum,
  getAllPhases,
  getTotalLessons,
} from "../../content/academy/curriculum";
import "./academy.css";

export const metadata = {
  title: "LAB Academy — Exsuvera",
  description:
    "From unsure to execution: nine phases to sharpen your vision, reverse-plan your mission, and ship with proof.",
};

export default function AcademyPage() {
  const phases = getAllPhases();
  const totalLessons = getTotalLessons();

  return (
    <main className="academyPage">
      <nav className="pocNav">
        <Link href="/">← Concept Lab</Link>
        <b>LAB / ACADEMY</b>
        <Link href="#curriculum">Curriculum</Link>
      </nav>

      <section className="academyHero">
        <p className="tag">{curriculum.subtitle}</p>
        <p className="academyTagline">{curriculum.tagline}</p>
        <h1>
          {curriculum.title.split(" ")[0]}
          <br />
          <em>{curriculum.title.split(" ").slice(1).join(" ")}</em>
        </h1>
        <p className="lead">
          {phases.length} phases · {totalLessons} lessons · one path from
          uncertainty to execution. Each phase ends with a deliverable you can
          hold, test, and build on.
        </p>
      </section>

      <section className="academyThesis">
        <p className="tag">Why this exists</p>
        <h2>Proof before polish applies to you, too.</h2>
        <p>{curriculum.thesis}</p>
      </section>

      <section className="phaseGrid" id="curriculum">
        {phases.map((phase) => (
          <Link
            key={phase.slug}
            href={`/academy/${phase.slug}`}
            className="phaseCard"
          >
            <span className="num">{phase.number} / {phase.title}</span>
            <h3>{phase.tagline}</h3>
            <span className="phaseTag">{phase.lessons.length} lessons</span>
            <p>{phase.description}</p>
            <span className="meta">Outcome → {phase.outcome.slice(0, 60)}…</span>
          </Link>
        ))}
      </section>

      <footer className="source">
        <Link href="/scan">Blind Spot Scan</Link>
        <Link href="/blueprint">Blueprint Chat</Link>
        <span>Exsuvera × LAB</span>
      </footer>
    </main>
  );
}
