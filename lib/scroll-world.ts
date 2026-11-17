export type PerformanceTier = "high" | "low";

export const scrollWorld = {
  raw: 0,
  smooth: 0,
  pointer: { x: 0, y: 0 },
  pointerTarget: { x: 0, y: 0 },
  tier: "high" as PerformanceTier,
  narrow: false,
  reduced: false,
  chapter: 0,
  listeners: new Set<() => void>(),
  setChapter(index: number) {
    if (index === this.chapter) return false;
    this.chapter = index;
    for (const listener of this.listeners) listener();
    return true;
  },
};

export function subscribeScroll(listener: () => void) {
  scrollWorld.listeners.add(listener);
  return () => {
    scrollWorld.listeners.delete(listener);
  };
}

export function getChapterSnapshot() {
  return scrollWorld.chapter;
}
