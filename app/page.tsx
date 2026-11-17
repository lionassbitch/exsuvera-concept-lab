import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { SiteShell } from "../components/ui/SiteShell";
import { artist } from "../lib/artist-config";
import "./rich-demons.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--rd-display",
  display: "swap",
});

const description = `${artist.featuredProject} is the featured project by ${artist.artistName}. Biography, releases, and official links have not been published on this site.`;

export const metadata: Metadata = {
  title: `${artist.artistName} — ${artist.featuredProject}`,
  description,
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: `${artist.artistName} — ${artist.featuredProject}`,
    description,
    type: "website",
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.artistName,
    description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <noscript>
        <div className={`rd is-static ${display.variable}`}>
          <h1>Rich Demon$ — Entitled 2 Equity</h1>
          <p>Three chapters: the artist, the symbol, and the world. Enable JavaScript for the scroll-directed sequence.</p>
          <p>Biography, releases, audio, and official links have not been published on this site.</p>
        </div>
      </noscript>
      <SiteShell displayClassName={display.variable} />
    </>
  );
}
