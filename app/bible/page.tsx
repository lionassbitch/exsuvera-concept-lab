import Link from "next/link";
import { bibleMeta, sections } from "../../content/bible";

const trinity = [
  {
    who: "Pryde · Lion",
    title: "Sovereign Will",
    text: "Command without permission. The held claw. Strength that survives the moment nobody applauds.",
  },
  {
    who: "Kickz · Ass",
    title: "Stubborn Truth",
    text: "Who is carrying all this? The load, the bray, the refusal to haul discarded armor into another year.",
  },
  {
    who: "Anput · Bitch",
    title: "The Threshold",
    text: "Alive. Needs help. Eating the others. Loyalty that stays when spectacle has gone home.",
  },
];

export default function BibleHub() {
  return (
    <main className="biblePage">
      <nav className="pocNav">
        <Link href="/">← Concept Lab</Link>
        <b>EXSUVERA / ORIGINS BIBLE</b>
        <Link href="/bible/sources">Sources</Link>
      </nav>

      <header className="bibleHero">
        <p className="bibleWarning">{bibleMeta.kicker}</p>
        <h1>
          The word
          <br />
          that grew <em>teeth.</em>
        </h1>
        <p className="lead">
          A late Uber. One misheard syllable. Three creatures. A company name
          that saved a life by giving it work. Two years later the sky handed
          the same sentence back. This is the house for that work: canon,
          method, screenplay, prompts, merch, products.
        </p>
        <p className="bibleCreed">
          <span>Be the Lion, not the liar.</span>
          <span>Be the Ass, not the asshole.</span>
          <span>Be that Bitch, not a bitch.</span>
        </p>
      </header>

      <section className="trinity" aria-label="The trinity">
        {trinity.map((member) => (
          <article key={member.who}>
            <span className="who">{member.who}</span>
            <h2>{member.title}</h2>
            <p>{member.text}</p>
          </article>
        ))}
      </section>

      <section className="bibleGrid" aria-label="Bible sections">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/bible/${section.slug}`}
            className="bibleCard"
          >
            <span className="num">{section.number}</span>
            <h3>{section.title}</h3>
            <p>{section.summary}</p>
            <b>{section.tagline} →</b>
          </Link>
        ))}
      </section>

      <footer className="source">
        <span>{bibleMeta.warning}</span>
        <span>Ancient roots. Modern tools. Bronx authorship.</span>
      </footer>
    </main>
  );
}
