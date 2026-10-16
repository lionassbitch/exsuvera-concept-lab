import { characters } from "./characters";
import { creed } from "./creed";
import { merch } from "./merch";
import { method } from "./method";
import { origins } from "./origins";
import { products } from "./products";
import { prompts } from "./prompts";
import { screenplayIntro } from "./screenplay";
import { sky } from "./sky";
import { sources } from "./sources";
import type { BibleSection } from "./types";

export type { BibleBlock, BibleLink, BibleSection } from "./types";
export { screenplayActs } from "./screenplay";
export type { ScreenplayAct } from "./screenplay";

export const bibleMeta = {
  title: "Origins Bible",
  kicker: "Exsuvera presents",
  name: "Lion Ass Bitch",
  line: "The insult became the universe.",
  warning: "This is not a brand. This is a warning.",
};

export const sections: BibleSection[] = [
  creed,
  origins,
  characters,
  sky,
  method,
  screenplayIntro,
  prompts,
  merch,
  products,
  sources,
];

export function getSection(slug: string): BibleSection | undefined {
  return sections.find((section) => section.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: BibleSection;
  next?: BibleSection;
} {
  const index = sections.findIndex((section) => section.slug === slug);
  if (index < 0) return {};
  return {
    prev: sections[index - 1],
    next: sections[index + 1],
  };
}
