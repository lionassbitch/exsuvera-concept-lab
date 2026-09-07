/**
 * LAB Academy persistence.
 *
 * Primary: in-memory store (works in Node tests + Worker isolates).
 * Optional: Cloudflare D1 when the `cloudflare:workers` binding is available
 * (loaded dynamically so Node's test runner never sees a static import).
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
  exec: (query: string) => Promise<unknown>;
};

let d1Ready: Promise<D1Like | null> | null = null;
let schemaReady: Promise<void> | null = null;

async function getD1(): Promise<D1Like | null> {
  if (!d1Ready) {
    d1Ready = (async () => {
      try {
        const mod = await import(
          /* @vite-ignore */ "cloudflare:workers"
        );
        const db = (mod as { env?: { DB?: D1Like } }).env?.DB;
        return db ?? null;
      } catch {
        return null;
      }
    })();
  }
  return d1Ready;
}

async function ensureD1Schema(db: D1Like) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS academy_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          learner_id TEXT NOT NULL,
          phase_slug TEXT NOT NULL,
          lesson_slug TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE UNIQUE INDEX IF NOT EXISTS academy_progress_learner_lesson
          ON academy_progress (learner_id, phase_slug, lesson_slug);
        CREATE TABLE IF NOT EXISTS academy_deliverables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          learner_id TEXT NOT NULL,
          phase_slug TEXT NOT NULL,
          lesson_slug TEXT NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE UNIQUE INDEX IF NOT EXISTS academy_deliverables_learner_lesson
          ON academy_deliverables (learner_id, phase_slug, lesson_slug);
      `);
    })();
  }
  await schemaReady;
}

export async function listProgress(learnerId: string): Promise<ProgressRow[]> {
  const db = await getD1();
  if (db) {
    await ensureD1Schema(db);
    const { results } = await db
      .prepare(
        `SELECT phase_slug as phaseSlug, lesson_slug as lessonSlug, status, completed_at as completedAt
         FROM academy_progress WHERE learner_id = ?`
      )
      .bind(learnerId)
      .all<ProgressRow>();
    return results;
  }

  return [...progressStore.values()]
    .filter((row) => row.learnerId === learnerId)
    .map(({ phaseSlug, lessonSlug, status, completedAt }) => ({
      phaseSlug,
      lessonSlug,
      status,
      completedAt,
    }));
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

  const db = await getD1();
  if (db) {
    await ensureD1Schema(db);
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
    return row;
  }

  progressStore.set(
    progressKey(input.learnerId, input.phaseSlug, input.lessonSlug),
    { ...row, learnerId: input.learnerId }
  );
  return row;
}

export async function getDeliverable(
  learnerId: string,
  phaseSlug: string,
  lessonSlug: string
): Promise<DeliverableRow | null> {
  const db = await getD1();
  if (db) {
    await ensureD1Schema(db);
    return db
      .prepare(
        `SELECT phase_slug as phaseSlug, lesson_slug as lessonSlug, title, body, updated_at as updatedAt
         FROM academy_deliverables
         WHERE learner_id = ? AND phase_slug = ? AND lesson_slug = ?`
      )
      .bind(learnerId, phaseSlug, lessonSlug)
      .first<DeliverableRow>();
  }

  return (
    deliverableStore.get(deliverableKey(learnerId, phaseSlug, lessonSlug)) ??
    null
  );
}

export async function listDeliverables(
  learnerId: string
): Promise<DeliverableRow[]> {
  const db = await getD1();
  if (db) {
    await ensureD1Schema(db);
    const { results } = await db
      .prepare(
        `SELECT phase_slug as phaseSlug, lesson_slug as lessonSlug, title, body, updated_at as updatedAt
         FROM academy_deliverables WHERE learner_id = ?`
      )
      .bind(learnerId)
      .all<DeliverableRow>();
    return results;
  }

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

  const db = await getD1();
  if (db) {
    await ensureD1Schema(db);
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
    return row;
  }

  deliverableStore.set(
    deliverableKey(input.learnerId, input.phaseSlug, input.lessonSlug),
    { ...row, learnerId: input.learnerId }
  );
  return row;
}
