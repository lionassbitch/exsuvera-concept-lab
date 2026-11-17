export type AnalyticsEvent =
  | { name: "chapter_view"; chapter: string }
  | { name: "outbound_click"; kind: string; destination: string }
  | { name: "engage"; action: string }
  | { name: "playback"; action: "play" | "pause" | "seek"; trackId: string };

type Sink = (event: AnalyticsEvent) => void;

const sinks = new Set<Sink>();

/** Register a provider later. The site runs with no sink attached. */
export function registerAnalyticsSink(sink: Sink) {
  sinks.add(sink);
  return () => sinks.delete(sink);
}

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  for (const sink of sinks) sink(event);
  window.dispatchEvent(new CustomEvent("rd-analytics", { detail: event }));
}
