import Link from "next/link";
import { DeliverablesClient } from "../DeliverablesClient";

export const metadata = {
  title: "Deliverables — LAB Academy",
  description:
    "Your saved LAB Academy exercise deliverables. Export as Markdown anytime.",
};

export default function DeliverablesPage() {
  return (
    <main className="academyPage">
      <DeliverablesClient />
      <footer className="source">
        <Link href="/academy">Curriculum</Link>
        <span>Exsuvera × LAB</span>
      </footer>
    </main>
  );
}
