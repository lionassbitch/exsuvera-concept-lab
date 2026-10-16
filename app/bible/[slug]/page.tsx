import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacent,
  getSection,
  sections,
  screenplayActs,
} from "../../../content/bible";
import { BlockList } from "../BlockList";

export function generateStaticParams() {
  return sections.map((section) => ({ slug: section.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) return { title: "Origins Bible" };
  return {
    title: `${section.title} — Origins Bible`,
    description: section.summary,
  };
}

export default async function BibleSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();
  const { prev, next } = getAdjacent(slug);
  const isScreenplay = slug === "screenplay";

  return (
    <main className="biblePage">
      <nav className="pocNav">
        <Link href="/bible">← Origins Bible</Link>
        <b>
          {section.number} / {section.title.toUpperCase()}
        </b>
        <Link href="/bible/sources">Sources</Link>
      </nav>

      <header className="bibleSection">
        <p className="tag">{section.tagline}</p>
        <h1>{section.title}</h1>
        <p className="lead">{section.summary}</p>
      </header>

      <BlockList blocks={section.blocks} />

      {isScreenplay ? (
        <>
          <nav className="scriptNav" aria-label="Screenplay acts">
            {screenplayActs.map((act) => (
              <a key={act.id} href={`#${act.slug}`}>
                {act.title}
              </a>
            ))}
          </nav>
          {screenplayActs.map((act) => (
            <article className="scriptAct" key={act.id} id={act.slug}>
              <h2>{act.title}</h2>
              <pre>{act.body}</pre>
            </article>
          ))}
        </>
      ) : null}

      <nav className="biblePager">
        {prev ? (
          <Link href={`/bible/${prev.slug}`}>
            <span>Previous</span>
            {prev.title}
          </Link>
        ) : (
          <Link href="/bible">
            <span>Index</span>
            Origins Bible
          </Link>
        )}
        {next ? (
          <Link className="next" href={`/bible/${next.slug}`}>
            <span>Next</span>
            {next.title}
          </Link>
        ) : (
          <Link className="next" href="/bible">
            <span>Index</span>
            Back to the door
          </Link>
        )}
      </nav>
    </main>
  );
}
