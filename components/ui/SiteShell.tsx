"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { sourceImageList, type SourceImageKey } from "../../lib/artist-config";
import { getChapterSnapshot, scrollWorld, subscribeScroll } from "../../lib/scroll-world";
import { ChapterOverlay, type AssetMap } from "./ChapterOverlay";
import { Navigation } from "./Navigation";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollDirector } from "../experience/ScrollDirector";

const ExperienceCanvas = dynamic(
  () => import("../experience/ExperienceCanvas").then((mod) => mod.ExperienceCanvas),
  { ssr: false }
);

const PENDING_ASSETS: AssetMap = {
  hoodie: "pending",
  portrait: "pending",
  portraitRed: "pending",
  emblem: "pending",
  world: "pending",
};

type Presentation = "boot" | "cinematic" | "static";

function subscribeBrowser() {
  return () => {};
}

function readPresentation(): Presentation {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  scrollWorld.reduced = reduced;
  scrollWorld.narrow = window.innerWidth < 760;
  scrollWorld.tier = coarse || cores <= 4 || memory <= 4 ? "low" : "high";
  if (!hasWebGL() || reduced) return "static";
  return "cinematic";
}

function readServerPresentation(): Presentation {
  return "boot";
}

function readWebglNote() {
  return hasWebGL() ? null : "This browser cannot open the 3D sequence. The same chapters are shown as a page.";
}

function probe(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

let webglSupport: boolean | null = null;

function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglSupport = Boolean(gl);
    const lose = gl?.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return webglSupport;
  } catch {
    webglSupport = false;
    return false;
  }
}

class CanvasGuard extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const CHAPTER_ANNOUNCEMENT = ["The artist", "The symbol", "The world", "Contact"];

export function SiteShell({ displayClassName }: { displayClassName: string }) {
  const chapter = useSyncExternalStore(subscribeScroll, getChapterSnapshot, () => 0);
  const detected = useSyncExternalStore(subscribeBrowser, readPresentation, readServerPresentation);
  const detectedNote = useSyncExternalStore(subscribeBrowser, readWebglNote, () => null);
  const [failure, setFailure] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetMap>(PENDING_ASSETS);
  const presentation: Presentation = failure ? "static" : detected;
  const webglNote = failure ?? detectedNote;

  useEffect(() => {
    document.body.classList.add("rd-on");
    let cancelled = false;
    void Promise.all(
      sourceImageList.map(async (image) => {
        const ok = await probe(image.src);
        return [image.key, ok ? "ready" : "missing"] as const;
      })
    ).then((entries) => {
      if (cancelled) return;
      setAssets(Object.fromEntries(entries) as Record<SourceImageKey, AssetMap[SourceImageKey]>);
    });

    return () => {
      cancelled = true;
      document.body.classList.remove("rd-on");
    };
  }, []);

  const mode = presentation === "static" ? "static" : "cinematic";

  return (
    <div
      className={`rd ${displayClassName}${presentation === "static" ? " is-static" : ""}${presentation === "boot" ? " is-boot" : ""}`}
      data-chapter={chapter}
    >
      <h1 className="rd-sr">Rich Demon$ — Entitled 2 Equity</h1>
      <p className="rd-sr">
        Scroll-directed sequence in three chapters: the artist, the symbol, and the world. Source photographs appear in the scene when they are part of this build.
      </p>
      <p className="rd-sr" aria-live="polite">
        {CHAPTER_ANNOUNCEMENT[chapter] ?? CHAPTER_ANNOUNCEMENT[0]}
      </p>
      <Navigation />
      <ScrollProgress />
      <div className="rd-vignette" aria-hidden="true" />
      {webglNote ? <p className="rd-fallback-note" role="status">{webglNote}</p> : null}
      {presentation === "cinematic" ? (
        <CanvasGuard onError={() => setFailure("The 3D sequence stopped. The same chapters are shown as a page.")}>
          <ExperienceCanvas onFailure={() => setFailure("The 3D sequence stopped. The same chapters are shown as a page.")} />
        </CanvasGuard>
      ) : null}
      <ChapterOverlay assets={assets} stills={presentation === "static"} />
      <div className="rd-track" aria-hidden="true" />
      <ScrollDirector active={presentation !== "boot"} mode={mode} />
    </div>
  );
}
