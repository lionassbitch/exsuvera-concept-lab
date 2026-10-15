"use client";

import { AcademyShell } from "./AcademyShell";

export function PhaseShell({ children }: { children: React.ReactNode }) {
  return <AcademyShell active="curriculum">{children}</AcademyShell>;
}
