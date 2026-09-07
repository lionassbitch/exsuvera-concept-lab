"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "exsuvera.lab-academy.learner-id";
const LEARNER_HEADER = "x-academy-learner-id";

export type ProgressRow = {
  phaseSlug: string;
  lessonSlug: string;
  status: string;
  completedAt: string | null;
};

export type DeliverableRow = {
  phaseSlug: string;
  lessonSlug: string;
  title: string;
  body: string;
  updatedAt: string | null;
};

type AcademyApi = {
  learnerId: string | null;
  ready: boolean;
  progress: ProgressRow[];
  completedCount: number;
  isComplete: (phaseSlug: string, lessonSlug: string) => boolean;
  markComplete: (phaseSlug: string, lessonSlug: string) => Promise<void>;
  getDeliverable: (
    phaseSlug: string,
    lessonSlug: string
  ) => Promise<DeliverableRow | null>;
  saveDeliverable: (input: {
    phaseSlug: string;
    lessonSlug: string;
    title: string;
    body: string;
  }) => Promise<DeliverableRow>;
  refresh: () => Promise<void>;
};

const AcademyContext = createContext<AcademyApi | null>(null);

function createGuestId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `guest:${crypto.randomUUID()}`;
  }
  return `guest:${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

function loadOrCreateLearnerId() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing?.startsWith("guest:")) return existing;
    const next = createGuestId();
    localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return createGuestId();
  }
}

async function academyFetch(
  path: string,
  learnerId: string,
  init?: RequestInit
): Promise<Record<string, unknown>> {
  const headers = new Headers(init?.headers);
  headers.set(LEARNER_HEADER, learnerId);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(path, { ...init, headers });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : `Request failed (${res.status})`
    );
  }
  return data;
}

export function AcademyProvider({
  children,
  totalLessons,
}: {
  children: ReactNode;
  totalLessons: number;
}) {
  const [learnerId, setLearnerId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  const refresh = useCallback(async () => {
    const id = learnerId ?? loadOrCreateLearnerId();
    if (!learnerId) setLearnerId(id);
    const data = await academyFetch("/api/academy/progress", id);
    setProgress((data.progress as ProgressRow[] | undefined) ?? []);
    setReady(true);
  }, [learnerId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = loadOrCreateLearnerId();
        if (cancelled) return;
        setLearnerId(id);
        const data = await academyFetch("/api/academy/progress", id);
        if (cancelled) return;
        setProgress((data.progress as ProgressRow[] | undefined) ?? []);
      } catch {
        if (!cancelled) setProgress([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isComplete = useCallback(
    (phaseSlug: string, lessonSlug: string) =>
      progress.some(
        (row) =>
          row.phaseSlug === phaseSlug &&
          row.lessonSlug === lessonSlug &&
          row.status === "completed"
      ),
    [progress]
  );

  const markComplete = useCallback(
    async (phaseSlug: string, lessonSlug: string) => {
      if (!learnerId) return;
      const data = await academyFetch("/api/academy/progress", learnerId, {
        method: "POST",
        body: JSON.stringify({ phaseSlug, lessonSlug, status: "completed" }),
      });
      const next = data.progress as ProgressRow;
      setProgress((prev) => {
        const without = prev.filter(
          (row) =>
            !(row.phaseSlug === phaseSlug && row.lessonSlug === lessonSlug)
        );
        return [...without, next];
      });
    },
    [learnerId]
  );

  const getDeliverable = useCallback(
    async (phaseSlug: string, lessonSlug: string) => {
      if (!learnerId) return null;
      const data = await academyFetch(
        `/api/academy/deliverables?phase=${encodeURIComponent(phaseSlug)}&lesson=${encodeURIComponent(lessonSlug)}`,
        learnerId
      );
      return (data.deliverable as DeliverableRow | null) ?? null;
    },
    [learnerId]
  );

  const saveDeliverable = useCallback(
    async (input: {
      phaseSlug: string;
      lessonSlug: string;
      title: string;
      body: string;
    }) => {
      if (!learnerId) throw new Error("Learner not ready");
      const data = await academyFetch("/api/academy/deliverables", learnerId, {
        method: "POST",
        body: JSON.stringify(input),
      });
      return data.deliverable as DeliverableRow;
    },
    [learnerId]
  );

  const value = useMemo<AcademyApi>(
    () => ({
      learnerId,
      ready,
      progress,
      completedCount: progress.filter((row) => row.status === "completed").length,
      isComplete,
      markComplete,
      getDeliverable,
      saveDeliverable,
      refresh,
    }),
    [
      learnerId,
      ready,
      progress,
      isComplete,
      markComplete,
      getDeliverable,
      saveDeliverable,
      refresh,
      totalLessons,
    ]
  );

  return (
    <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
  );
}

export function useAcademy() {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error("useAcademy must be used within AcademyProvider");
  return ctx;
}
