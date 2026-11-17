export type Vec3 = [number, number, number];

export type CameraKey = {
  t: number;
  pos: Vec3;
  target: Vec3;
};

export const CHAPTER_TARGETS: Record<string, number> = {
  home: 0.02,
  artist: 0.02,
  music: 0.48,
  symbol: 0.48,
  world: 0.74,
  contact: 0.94,
};

export const WIDE_CAMERA: CameraKey[] = [
  { t: 0, pos: [0, 0.55, 8.1], target: [0, 0.72, 0] },
  { t: 0.2, pos: [0.12, 0.42, 5.35], target: [0, 0.48, 0] },
  { t: 0.34, pos: [1.15, 0.62, 1.15], target: [0.05, 0.28, -6] },
  { t: 0.5, pos: [0.42, 0.38, -2.35], target: [0, 0.22, -6.05] },
  { t: 0.68, pos: [-0.55, 0.72, -6.15], target: [0, 0.28, -12] },
  { t: 0.84, pos: [0.1, 0.62, -8.15], target: [0, 0.18, -12.15] },
  { t: 1, pos: [0, 0.95, -6.35], target: [0, 0.12, -12.2] },
];

export const NARROW_CAMERA: CameraKey[] = [
  { t: 0, pos: [0, 0.48, 7.2], target: [0, 0.85, 0] },
  { t: 0.2, pos: [0, 0.4, 5.5], target: [0, 0.62, 0] },
  { t: 0.34, pos: [0.15, 0.5, 0.7], target: [0, 0.3, -6] },
  { t: 0.5, pos: [0, 0.34, -2.7], target: [0, 0.18, -6.05] },
  { t: 0.68, pos: [0, 0.7, -6.4], target: [0, 0.25, -12] },
  { t: 0.84, pos: [0, 0.58, -8.4], target: [0, 0.12, -12.1] },
  { t: 1, pos: [0, 0.9, -6.6], target: [0, 0.08, -12.15] },
];

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const span = Math.max(0.0001, edge1 - edge0);
  const t = clamp01((value - edge0) / span);
  return t * t * (3 - 2 * t);
}

/** 0 before fade-in, 1 while held, 0 after fade-out. */
export function windowFade(progress: number, fadeIn: number, full: number, fadeOut: number, gone: number) {
  return clamp01(smoothstep(fadeIn, full, progress) * (1 - smoothstep(fadeOut, gone, progress)));
}

export function chapterFromProgress(progress: number) {
  if (progress < 0.3) return 0;
  if (progress < 0.62) return 1;
  if (progress < 0.86) return 2;
  return 3;
}

export function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function samplePath(progress: number, keys: CameraKey[]) {
  const t = clamp01(progress);
  let index = 0;
  while (index < keys.length - 2 && t > keys[index + 1].t) index += 1;
  const from = keys[index];
  const to = keys[index + 1];
  const span = Math.max(0.0001, to.t - from.t);
  const eased = smoothstep(0, 1, (t - from.t) / span);
  return {
    pos: lerpVec(from.pos, to.pos, eased),
    target: lerpVec(from.target, to.target, eased),
  };
}

export function scrollToProgress(progress: number, behavior: ScrollBehavior) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: Math.max(0, max) * clamp01(progress), behavior });
}

export function readScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return clamp01(window.scrollY / max);
}
