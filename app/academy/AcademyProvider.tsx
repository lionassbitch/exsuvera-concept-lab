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
const LOCAL_DELIVERABLES_KEY = "exsuvera.lab-academy.deliverables";
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

export type NextLesson = {
  phaseSlug: string;
  lessonSlug: string;
  title: string;
  phaseTitle: string;
};

type AcademyApi = {
  learnerId: string | null;
  source: "guest" | "chatgpt" | null;
  backend: "d1" | "memory" | null;
  ready: boolean;
  error: string | null;
  progress: ProgressRow[];
  deliverables: DeliverableRow[];
  completedCount: number;
  totalLessons: number;
  next: NextLesson | null;
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
  exportMarkdown: () => string;
};

const AcademyContext = createContext<AcademyApi | null>(null);

function createGuestId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `guest:${crypto.randomUUID()}`;
  }
  return `guest:${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
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

function readLocalDeliverables(learnerId: string): DeliverableRow[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_DELIVERABLES_KEY}:${learnerId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DeliverableRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalDeliverable(learnerId: string, row: DeliverableRow) {
  try {
    const existing = readLocalDeliverables(learnerId).filter(
      (d) =>
        !(d.phaseSlug === row.phaseSlug && d.lessonSlug === row.lessonSlug)
    );
    localStorage.setItem(
      `${LOCAL_DELIVERABLES_KEY}:${learnerId}`,
      JSON.stringify([row, ...existing])
    );
  } catch {
    // private mode / quota — ignore
  }
}

async function academyFetch(
  path: string,
  learnerId: string | null,
  init?: RequestInit
): Promise<Record<string, unknown>> {
  const headers = new Headers(init?.headers);
  if (learnerId) headers.set(LEARNER_HEADER, learnerId);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(path, { ...init, headers, cache: "no-store" });
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
  const [source, setSource] = useState<"guest" | "chatgpt" | null>(null);
  const [backend, setBackend] = useState<"d1" | "memory" | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableRow[]>([]);
  const [next, setNext] = useState<NextLesson | null>(null);

  const refresh = useCallback(async () => {
    const id = learnerId ?? loadOrCreateLearnerId();
    if (!learnerId) setLearnerId(id);
    setError(null);
    try {
      const data = await academyFetch("/api/academy/session", id);
      setSource((data.source as "guest" | "chatgpt" | null) ?? "guest");
      setBackend((data.backend as "d1" | "memory") ?? "memory");
      setProgress((data.progress as ProgressRow[] | undefined) ?? []);
      setNext((data.next as NextLesson | null) ?? null);
      const remote = await academyFetch("/api/academy/deliverables", id);
      const remoteRows =
        (remote.deliverables as DeliverableRow[] | undefined) ?? [];
      const localRows = readLocalDeliverables(id);
      // Prefer remote; fill gaps from local cache
      const map = new Map<string, DeliverableRow>();
      for (const row of localRows) {
        map.set(`${row.phaseSlug}::${row.lessonSlug}`, row);
      }
      for (const row of remoteRows) {
        map.set(`${row.phaseSlug}::${row.lessonSlug}`, row);
      }
      setDeliverables([...map.values()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load session");
      setProgress([]);
      setDeliverables(readLocalDeliverables(id));
    } finally {
      setReady(true);
    }
  }, [learnerId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = loadOrCreateLearnerId();
      if (cancelled) return;
      setLearnerId(id);
      try {
        const data = await academyFetch("/api/academy/session", id);
        if (cancelled) return;
        setSource((data.source as "guest" | "chatgpt" | null) ?? "guest");
        setBackend((data.backend as "d1" | "memory") ?? "memory");
        setProgress((data.progress as ProgressRow[] | undefined) ?? []);
        setNext((data.next as NextLesson | null) ?? null);
        const remote = await academyFetch("/api/academy/deliverables", id);
        if (cancelled) return;
        const remoteRows =
          (remote.deliverables as DeliverableRow[] | undefined) ?? [];
        const localRows = readLocalDeliverables(id);
        const map = new Map<string, DeliverableRow>();
        for (const row of localRows) {
          map.set(`${row.phaseSlug}::${row.lessonSlug}`, row);
        }
        for (const row of remoteRows) {
          map.set(`${row.phaseSlug}::${row.lessonSlug}`, row);
        }
        setDeliverables([...map.values()]);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load session");
          setDeliverables(readLocalDeliverables(id));
        }
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
      const nextRow = data.progress as ProgressRow;
      setProgress((prev) => {
        const without = prev.filter(
          (row) =>
            !(row.phaseSlug === phaseSlug && row.lessonSlug === lessonSlug)
        );
        return [...without, nextRow];
      });
      await refresh();
    },
    [learnerId, refresh]
  );

  const getDeliverable = useCallback(
    async (phaseSlug: string, lessonSlug: string) => {
      if (!learnerId) return null;
      const cached = readLocalDeliverables(learnerId).find(
        (d) => d.phaseSlug === phaseSlug && d.lessonSlug === lessonSlug
      );
      try {
        const data = await academyFetch(
          `/api/academy/deliverables?phase=${encodeURIComponent(phaseSlug)}&lesson=${encodeURIComponent(lessonSlug)}`,
          learnerId
        );
        return (data.deliverable as DeliverableRow | null) ?? cached ?? null;
      } catch {
        return cached ?? null;
      }
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
      const row = data.deliverable as DeliverableRow;
      writeLocalDeliverable(learnerId, row);
      setDeliverables((prev) => {
        const without = prev.filter(
          (d) =>
            !(
              d.phaseSlug === input.phaseSlug &&
              d.lessonSlug === input.lessonSlug
            )
        );
        return [row, ...without];
      });
      return row;
    },
    [learnerId]
  );

  const exportMarkdown = useCallback(() => {
    const lines = [
      "# LAB Academy — My Deliverables",
      "",
      `Learner: ${learnerId ?? "unknown"}`,
      `Exported: ${new Date().toISOString()}`,
      "",
    ];
    for (const row of deliverables) {
      lines.push(`## ${row.title}`);
      lines.push(`_${row.phaseSlug} / ${row.lessonSlug}_`);
      lines.push("");
      lines.push(row.body || "_(empty)_");
      lines.push("");
    }
    if (deliverables.length === 0) {
      lines.push("_No deliverables saved yet._");
    }
    return lines.join("\n");
  }, [deliverables, learnerId]);

  const value = useMemo<AcademyApi>(
    () => ({
      learnerId,
      source,
      backend,
      ready,
      error,
      progress,
      deliverables,
      completedCount: progress.filter((row) => row.status === "completed")
        .length,
      totalLessons,
      next,
      isComplete,
      markComplete,
      getDeliverable,
      saveDeliverable,
      refresh,
      exportMarkdown,
    }),
    [
      learnerId,
      source,
      backend,
      ready,
      error,
      progress,
      deliverables,
      totalLessons,
      next,
      isComplete,
      markComplete,
      getDeliverable,
      saveDeliverable,
      refresh,
      exportMarkdown,
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
