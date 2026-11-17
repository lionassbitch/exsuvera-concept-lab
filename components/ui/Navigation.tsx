"use client";

import { useSyncExternalStore } from "react";
import { goToChapter } from "../experience/ScrollDirector";
import { getChapterSnapshot, subscribeScroll } from "../../lib/scroll-world";

const LINKS = [
  { hash: "home", label: "Home", chapter: 0 },
  { hash: "music", label: "Music", chapter: 1 },
  { hash: "world", label: "World", chapter: 2 },
  { hash: "contact", label: "Contact", chapter: 3 },
] as const;

const READOUT = ["01  The artist", "02  The symbol", "03  The world", "Contact"] as const;

export function Navigation() {
  const chapter = useSyncExternalStore(subscribeScroll, getChapterSnapshot, () => 0);

  return (
    <header className="rd-nav">
      <a className="rd-skip" href="#contact" onClick={(event) => { event.preventDefault(); goToChapter("contact"); }}>
        Skip to contact
      </a>
      <p className="rd-word">Rich Demon$</p>
      <p className="rd-now" aria-hidden="true">{READOUT[chapter] ?? READOUT[0]}</p>
      <nav aria-label="Primary">
        <ul className="rd-links">
          {LINKS.map((link) => (
            <li key={link.hash}>
              <a
                href={`#${link.hash}`}
                aria-current={chapter === link.chapter ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  goToChapter(link.hash);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
