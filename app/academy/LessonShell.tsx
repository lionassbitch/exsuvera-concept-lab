"use client";

import { AcademyShell } from "./AcademyShell";

export function LessonShell({ children }: { children: React.ReactNode }) {
  return <AcademyShell active="lesson">{children}</AcademyShell>;
}
