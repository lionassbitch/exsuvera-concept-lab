import Link from "next/link";
import {
  curriculum,
  getAllPhases,
  getTotalLessons,
} from "../../content/academy/curriculum";
import { AcademyHubClient } from "./AcademyHubClient";

export const metadata = {
  title: "LAB Academy — Exsuvera",
  description:
    "From unsure to execution: nine phases to sharpen your vision, reverse-plan your mission, and ship with proof. Frontend curriculum with backend progress.",
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

      <AcademyHubClient
        phases={phases}
        totalLessons={totalLessons}
        thesis={curriculum.thesis}
        subtitle={curriculum.subtitle}
        tagline={curriculum.tagline}
        title={curriculum.title}
      />

      <footer className="source">
        <Link href="/scan">Blind Spot Scan</Link>
        <Link href="/blueprint">Blueprint Chat</Link>
        <span>Exsuvera × LAB · FE + BE</span>
      </footer>
    </main>
  );
}
