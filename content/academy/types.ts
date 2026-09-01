export type Exercise = {
  prompt: string;
  deliverable: string;
  time: string;
};

export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  objectives: string[];
  body: string[];
  exercise?: Exercise;
  toolLink?: { href: string; label: string };
};

export type Phase = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  outcome: string;
  lessons: Lesson[];
};

export type Curriculum = {
  title: string;
  subtitle: string;
  tagline: string;
  thesis: string;
  phases: Phase[];
};
