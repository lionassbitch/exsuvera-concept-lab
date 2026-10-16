export type BibleLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type BibleBlock =
  | { type: "kicker"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "lede"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; label: string; text: string }
  | { type: "creed"; lines: string[] }
  | { type: "prompt"; id: string; title: string; body: string; negative?: string }
  | { type: "links"; items: BibleLink[] }
  | { type: "code"; label?: string; text: string };

export type BibleSection = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  summary: string;
  blocks: BibleBlock[];
};
