/**
 * LAB Academy persistence — production-oriented write-through store.
 *
 * - Always writes to in-memory (Worker-isolate) store
 * - Also writes to Cloudflare D1 when the binding is healthy
 * - Reads prefer D1, then merge/fallback to memory
 * - Dynamic import of cloudflare:workers so Node tests stay clean
 */

export type ProgressRow = {
  phaseSlug: string;
  lessonSlug: string;
  status: string;
  completedAt: string;
};

export type DeliverableRow = {
  phaseSlug: string;
  lessonSlug: string;
  title: string;
  body: string;
  updatedAt: string;
};

export type BackendMode = "d1" | "memory";

type ProgressKey = string;
type DeliverableKey = string;

const progressStore = new Map<ProgressKey, ProgressRow & { learnerId: string }>();
const deliverableStore = new Map<
  DeliverableKey,
  DeliverableRow & { learnerId: string }
>();

function progressKey(learnerId: string, phaseSlug: string, lessonSlug: string) {
  return `${learnerId}::${phaseSlug}::${lessonSlug}`;
}

function deliverableKey(
  learnerId: string,
  phaseSlug: string,
  lessonSlug: string
) {
  return `${learnerId}::${phaseSlug}::${lessonSlug}`;
}

type D1Like = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
      first: <T = Record<string, unknown>>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};

let d1Ready: Promise<D1Like | null> | null = null;
let schemaReady: Promise<void> | null = null;
let lastBackend: BackendMode = "memory";

export function getLastBackendMode(): BackendMode {
  return lastBackend;
}

async function getD1(): Promise<D1Like | null> {
  if (!d1Ready) {
    d1Ready = (async () => {
      try {
        const mod = await import(/* @vite-ignore */ "cloudflare:workers");
        const db = (mod as { env?: { DB?: D1Like } }).env?.DB;
        return db ?? null;
      } catch {
        return null;
      }
    })();
  }
  return d1Ready;
}

async function runSql(db: D1Like, query: string) {
  await db.prepare(query).bind().run();
}

async function ensureD1Schema(db: D1Like) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await runSql(
        db,
        `CREATE TABLE IF NOT EXISTS academy_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          learner_id TEXT NOT NULL,
          phase_slug TEXT NOT NULL,
          lesson_slug TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      );
      await runSql(
        db,
        `CREATE UNIQUE INDEX IF NOT EXISTS academy_progress_learner_lesson
          ON academy_progress (learner_id, phase_slug, lesson_slug)`
      );
      await runSql(
        db,
        `CREATE TABLE IF NOT EXISTS academy_deliverables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          learner_id TEXT NOT NULL,
          phase_slug TEXT NOT NULL,
          lesson_slug TEXT NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      );
      await runSql(
        db,
        `CREATE UNIQUE INDEX IF NOT EXISTS academy_deliverables_learner_lesson
          ON academy_deliverables (learner_id, phase_slug, lesson_slug)`
      );
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

async function getHealthyD1(): Promise<D1Like | null> {
  const db = await getD1();
  if (!db) return null;
  try {
    await ensureD1Schema(db);
    lastBackend = "d1";
    return db;
  } catch {
    lastBackend = "memory";
    return null;
  }
}

function memoryProgress(learnerId: string): ProgressRow[] {
  return [...progressStore.values()]
    .filter((row) => row.learnerId === learnerId)
    .map(({ phaseSlug, lessonSlug, status, completedAt }) => ({
      phaseSlug,
      lessonSlug,
      status,
      completedAt,
    }));
}

function memoryDeliverables(learnerId: string): DeliverableRow[] {
  return [...deliverableStore.values()]
    .filter((row) => row.learnerId === learnerId)
    .map(({ phaseSlug, lessonSlug, title, body, updatedAt }) => ({
      phaseSlug,
      lessonSlug,
      title,
      body,
      updatedAt,
    }));
}

export async function probeBackend(): Promise<{
  mode: BackendMode;
  d1: boolean;
  schemaOk: boolean;
}> {
  const db = await getD1();
  if (!db) {
    lastBackend = "memory";
    return { mode: "memory", d1: false, schemaOk: false };
  }
  try {
    await ensureD1Schema(db);
    lastBackend = "d1";
    return { mode: "d1", d1: true, schemaOk: true };
  } catch {
    lastBackend = "memory";
    return { mode: "memory", d1: true, schemaOk: false };
  }
}

export async function listProgress(learnerId: string): Promise<ProgressRow[]> {
  const db = await getHealthyD1();
  if (db) {
    try {
      const { results } = await db
        .prepare(
          `SELECT phase_slug as phaseSlug, lesson_slug as lessonSlug, status, completed_at as completedAt
           FROM academy_progress WHERE learner_id = ?`
        )
        .bind(learnerId)
        .all<ProgressRow>();
      // Hydrate memory from D1 so isolate stays consistent
      for (const row of results) {
        progressStore.set(progressKey(learnerId, row.phaseSlug, row.lessonSlug), {
          ...row,
          learnerId,
        });
      }
      return results;
    } catch {
      lastBackend = "memory";
    }
  }
  return memoryProgress(learnerId);
}

export async function upsertProgress(input: {
  learnerId: string;
  phaseSlug: string;
  lessonSlug: string;
  status?: string;
}): Promise<ProgressRow> {
  const status = input.status ?? "completed";
  const now = new Date().toISOString();
  const row: ProgressRow = {
    phaseSlug: input.phaseSlug,
    lessonSlug: input.lessonSlug,
    status,
    completedAt: now,
  };

  progressStore.set(
    progressKey(input.learnerId, input.phaseSlug, input.lessonSlug),
    { ...row, learnerId: input.learnerId }
  );

  const db = await getHealthyD1();
  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO academy_progress (learner_id, phase_slug, lesson_slug, status, completed_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(learner_id, phase_slug, lesson_slug)
           DO UPDATE SET status = excluded.status, completed_at = excluded.completed_at, updated_at = excluded.updated_at`
        )
        .bind(
          input.learnerId,
          input.phaseSlug,
          input.lessonSlug,
          status,
          now,
          now
        )
        .run();
    } catch {
      lastBackend = "memory";
    }
  }

  return row;
}

export async function getDeliverable(
  learnerId: string,
  phaseSlug: string,
  lessonSlug: string
): Promise<DeliverableRow | null> {
  const db = await getHealthyD1();
  if (db) {
    try {
      const row = await db
        .prepare(
          `SELECT phase_slug as phaseSlug, lesson_slug as lessonSlug, title, body, updated_at as updatedAt
           FROM academy_deliverables
           WHERE learner_id = ? AND phase_slug = ? AND lesson_slug = ?`
        )
        .bind(learnerId, phaseSlug, lessonSlug)
        .first<DeliverableRow>();
      if (row) {
        deliverableStore.set(deliverableKey(learnerId, phaseSlug, lessonSlug), {
          ...row,
          learnerId,
        });
        return row;
      }
    } catch {
      lastBackend = "memory";
    }
  }

  return (
    deliverableStore.get(deliverableKey(learnerId, phaseSlug, lessonSlug)) ??
    null
  );
}

export async function listDeliverables(
  learnerId: string
): Promise<DeliverableRow[]> {
  const db = await getHealthyD1();
  if (db) {
    try {
      const { results } = await db
        .prepare(
          `SELECT phase_slug as phaseSlug, lesson_slug as lessonSlug, title, body, updated_at as updatedAt
           FROM academy_deliverables WHERE learner_id = ?
           ORDER BY updated_at DESC`
        )
        .bind(learnerId)
        .all<DeliverableRow>();
      for (const row of results) {
        deliverableStore.set(
          deliverableKey(learnerId, row.phaseSlug, row.lessonSlug),
          { ...row, learnerId }
        );
      }
      return results;
    } catch {
      lastBackend = "memory";
    }
  }

  return memoryDeliverables(learnerId).sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
  );
}

export async function upsertDeliverable(input: {
  learnerId: string;
  phaseSlug: string;
  lessonSlug: string;
  title: string;
  body: string;
}): Promise<DeliverableRow> {
  const now = new Date().toISOString();
  const row: DeliverableRow = {
    phaseSlug: input.phaseSlug,
    lessonSlug: input.lessonSlug,
    title: input.title,
    body: input.body,
    updatedAt: now,
  };

  deliverableStore.set(
    deliverableKey(input.learnerId, input.phaseSlug, input.lessonSlug),
    { ...row, learnerId: input.learnerId }
  );

  const db = await getHealthyD1();
  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO academy_deliverables (learner_id, phase_slug, lesson_slug, title, body, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(learner_id, phase_slug, lesson_slug)
           DO UPDATE SET title = excluded.title, body = excluded.body, updated_at = excluded.updated_at`
        )
        .bind(
          input.learnerId,
          input.phaseSlug,
          input.lessonSlug,
          input.title,
          input.body,
          now,
          now
        )
        .run();
    } catch {
      lastBackend = "memory";
    }
  }

  return row;
}
