"use client";

import { useEffect } from "react";
import { track } from "../../lib/analytics";
import {
  CHAPTER_TARGETS,
  chapterFromProgress,
  damp,
  readScrollProgress,
  scrollToProgress,
} from "../../lib/motion";
import { scrollWorld } from "../../lib/scroll-world";

const CHAPTER_IDS = ["artist", "symbol", "world", "contact"] as const;

function behavior(): ScrollBehavior {
  return scrollWorld.reduced ? "auto" : "smooth";
}

export function goToChapter(hash: string) {
  const id = hash.replace(/^#/, "");
  const root = document.querySelector(".rd");
  const nextHash = `#${id}`;
  if (window.location.hash !== nextHash) {
    history.pushState(null, "", nextHash);
  }
  if (root?.classList.contains("is-static")) {
    document.getElementById(id)?.scrollIntoView({ behavior: behavior(), block: "start" });
    return;
  }
  const progress = CHAPTER_TARGETS[id];
  if (progress === undefined) return;
  scrollToProgress(progress, behavior());
}

export function ScrollDirector({ active, mode }: { active: boolean; mode: "cinematic" | "static" }) {
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = performance.now();
    let trigger: { kill: () => void } | null = null;
    let triggerReady = false;
    let cancelled = false;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const applyEnvironment = () => {
      scrollWorld.reduced = reducedQuery.matches;
      scrollWorld.narrow = window.innerWidth < 760;
      const cores = navigator.hardwareConcurrency || 8;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      scrollWorld.tier = coarseQuery.matches || cores <= 4 || memory <= 4 ? "low" : "high";
      if (scrollWorld.tier === "low" || scrollWorld.reduced) {
        scrollWorld.pointerTarget.x = 0;
        scrollWorld.pointerTarget.y = 0;
      }
    };
    applyEnvironment();

    const onPointer = (event: PointerEvent) => {
      if (scrollWorld.tier !== "high" || scrollWorld.narrow) return;
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      scrollWorld.pointerTarget.x = Math.max(-1, Math.min(1, x));
      scrollWorld.pointerTarget.y = Math.max(-1, Math.min(1, -y));
    };

    const onHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || CHAPTER_TARGETS[id] === undefined) return;
      if (document.querySelector(".rd")?.classList.contains("is-static")) {
        document.getElementById(id)?.scrollIntoView({ behavior: behavior(), block: "start" });
        return;
      }
      scrollToProgress(CHAPTER_TARGETS[id], "auto");
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!triggerReady) scrollWorld.raw = readScrollProgress();
      const lambda = scrollWorld.reduced ? 24 : scrollWorld.tier === "low" ? 5.5 : 3.2;
      scrollWorld.smooth = damp(scrollWorld.smooth, scrollWorld.raw, lambda, dt);
      scrollWorld.pointer.x = damp(scrollWorld.pointer.x, scrollWorld.pointerTarget.x, 6, dt);
      scrollWorld.pointer.y = damp(scrollWorld.pointer.y, scrollWorld.pointerTarget.y, 6, dt);
      if (mode === "cinematic") {
        const next = chapterFromProgress(scrollWorld.smooth);
        if (scrollWorld.setChapter(next)) {
          track({ name: "chapter_view", chapter: CHAPTER_IDS[next] });
        }
      }
      const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
      if (bar) {
        bar.style.setProperty("--rd-p", scrollWorld.smooth.toFixed(4));
        bar.setAttribute("aria-valuenow", String(Math.round(scrollWorld.smooth * 100)));
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    track({ name: "chapter_view", chapter: "artist" });

    const bootHash = window.location.hash.replace(/^#/, "");
    if (bootHash && CHAPTER_TARGETS[bootHash] !== undefined) {
      requestAnimationFrame(() => onHash());
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("hashchange", onHash);
    window.addEventListener("resize", applyEnvironment);
    reducedQuery.addEventListener("change", applyEnvironment);

    const root = document.querySelector(".rd-track");
    if (mode === "cinematic") {
      void (async () => {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled || !root) return;
        gsap.registerPlugin(ScrollTrigger);
        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            triggerReady = true;
            scrollWorld.raw = self.progress;
          },
        });
        ScrollTrigger.refresh();
      })();
    }

    const observed = ["home", "music", "world", "contact"]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer =
      mode === "static"
        ? new IntersectionObserver(
            (entries) => {
              const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
              if (!visible) return;
              const index = ["home", "music", "world", "contact"].indexOf(visible.target.id);
              if (index >= 0 && scrollWorld.setChapter(index)) {
                track({ name: "chapter_view", chapter: CHAPTER_IDS[index] });
              }
            },
            { threshold: [0.35, 0.55] }
          )
        : null;
    observed.forEach((element) => observer?.observe(element));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      trigger?.kill();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("resize", applyEnvironment);
      reducedQuery.removeEventListener("change", applyEnvironment);
    };
  }, [active, mode]);

  return null;
}
