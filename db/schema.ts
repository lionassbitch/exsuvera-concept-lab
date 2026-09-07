import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Durable D1 tables for LAB Academy (used when DB binding is present). */
export const academyProgress = sqliteTable(
  "academy_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    learnerId: text("learner_id").notNull(),
    phaseSlug: text("phase_slug").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    status: text("status").notNull().default("completed"),
    completedAt: text("completed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("academy_progress_learner_lesson").on(
      table.learnerId,
      table.phaseSlug,
      table.lessonSlug
    ),
  ]
);

export const academyDeliverables = sqliteTable(
  "academy_deliverables",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    learnerId: text("learner_id").notNull(),
    phaseSlug: text("phase_slug").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("academy_deliverables_learner_lesson").on(
      table.learnerId,
      table.phaseSlug,
      table.lessonSlug
    ),
  ]
);
