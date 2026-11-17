"use client";

import Image from "next/image";
import { artist, sourceImages, type SourceImageKey } from "../../lib/artist-config";
import { track } from "../../lib/analytics";
import { scrollToProgress } from "../../lib/motion";
import { scrollWorld } from "../../lib/scroll-world";
import { goToChapter } from "../experience/ScrollDirector";
import { ArtistFooter } from "./ArtistFooter";
import { MusicPlayer } from "./MusicPlayer";

export type AssetStatus = "pending" | "ready" | "missing";
export type AssetMap = Record<SourceImageKey, AssetStatus>;

const ACTIONS = [
  { label: "Listen", kind: "listen", href: artist.musicPlatforms[0]?.href ?? null },
  { label: "Watch", kind: "watch", href: artist.videos[0]?.href ?? null },
  { label: "Shop", kind: "shop", href: artist.merchandise[0]?.href ?? null },
  { label: "Follow", kind: "follow", href: artist.socialPlatforms[0]?.href ?? null },
  {
    label: "Book",
    kind: "book",
    href: artist.bookingEmail ? `mailto:${artist.bookingEmail}` : null,
  },
] as const;

function MissingFiles({ keys, assets }: { keys: SourceImageKey[]; assets: AssetMap }) {
  const missing = keys.filter((key) => assets[key] === "missing").map((key) => sourceImages[key].filename);
  if (missing.length === 0) return null;
  return (
    <div className="rd-missing">
      <p>Source image not in this build:</p>
      <ul>
        {missing.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

function Still({ id, assets }: { id: SourceImageKey; assets: AssetMap }) {
  const image = sourceImages[id];
  if (assets[id] !== "ready") return <p className="rd-sr">{image.alt}</p>;
  return (
    <Image
      className="rd-still"
      src={image.src}
      alt={image.alt}
      width={900}
      height={1200}
      unoptimized
    />
  );
}

export function ChapterOverlay({ assets, stills }: { assets: AssetMap; stills: boolean }) {
  const missingActions = ACTIONS.filter((action) => !action.href).map((action) => action.label);
  const actionNote =
    missingActions.length === 0
      ? null
      : missingActions.length === ACTIONS.length
        ? "Streaming, video, shop, social, and booking destinations are not configured."
        : `Still not configured: ${missingActions.join(", ")}.`;

  function explore() {
    track({ name: "engage", action: "scroll_to_explore" });
    if (document.querySelector(".rd")?.classList.contains("is-static")) {
      document.getElementById("music")?.scrollIntoView({ behavior: scrollWorld.reduced ? "auto" : "smooth" });
      return;
    }
    scrollToProgress(0.18, scrollWorld.reduced ? "auto" : "smooth");
  }

  function enter() {
    track({ name: "engage", action: "enter_the_world" });
    if (document.querySelector(".rd")?.classList.contains("is-static")) {
      goToChapter("world");
      return;
    }
    scrollToProgress(0.28, scrollWorld.reduced ? "auto" : "smooth");
  }

  return (
    <div className="rd-overlay">
      <section className="rd-panel rd-panel-0" id="home" aria-labelledby="rd-artist-title">
        {stills ? <Still id="portrait" assets={assets} /> : <p className="rd-sr">{sourceImages.portrait.alt}</p>}
        <p className="rd-kicker">01 / The artist</p>
        <p className="rd-display" id="rd-artist-title" aria-hidden="true">
          Rich Demon$
        </p>
        <p className="rd-project">{artist.featuredProject}</p>
        {artist.tagline ? <p className="rd-lead">{artist.tagline}</p> : null}
        <div className="rd-cta">
          <button type="button" className="rd-enter" onClick={enter}>
            Enter the world
          </button>
          <button type="button" className="rd-textbutton" onClick={explore}>
            Scroll to explore
          </button>
        </div>
        <MissingFiles keys={["portrait", "hoodie"]} assets={assets} />
      </section>

      <section className="rd-panel rd-panel-1" id="music" aria-labelledby="rd-symbol-title">
        {stills ? <Still id="emblem" assets={assets} /> : <p className="rd-sr">{sourceImages.emblem.alt}</p>}
        <p className="rd-kicker">02 / The symbol</p>
        <h2 id="rd-symbol-title">The symbol</h2>
        <MusicPlayer />
        <MissingFiles keys={["emblem"]} assets={assets} />
      </section>

      <section className="rd-panel rd-panel-2" id="world" aria-labelledby="rd-world-title">
        {stills ? <Still id="world" assets={assets} /> : <p className="rd-sr">{sourceImages.world.alt}</p>}
        <p className="rd-kicker">03 / The world</p>
        <h2 id="rd-world-title">{artist.worldLine ?? artist.featuredProject}</h2>
        {artist.worldLine ? <p className="rd-project">{artist.featuredProject}</p> : null}
        {actionNote ? <p className="rd-note">{actionNote}</p> : null}
        <div className="rd-actions">
          {ACTIONS.map((action) => {
            const href = action.href;
            if (!href) {
              return (
                <button key={action.kind} type="button" className="rd-action" disabled>
                  {action.label}
                </button>
              );
            }
            const external = href.startsWith("http");
            return (
              <a
                key={action.kind}
                className="rd-action"
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                onClick={() => track({ name: "outbound_click", kind: action.kind, destination: href })}
              >
                {action.label}
              </a>
            );
          })}
        </div>
        <MissingFiles keys={["world"]} assets={assets} />
      </section>

      <section className="rd-panel rd-panel-3" id="contact" aria-labelledby="rd-contact-title">
        <ArtistFooter />
      </section>
    </div>
  );
}
