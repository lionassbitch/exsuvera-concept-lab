import { resolveLearnerId } from "../../../lib/academy-auth";
import {
  getLastBackendMode,
  listDeliverables,
  listProgress,
  probeBackend,
} from "../../../lib/academy-store";
import {
  getFirstLesson,
  getNextIncompleteLesson,
  getTotalLessons,
} from "../../../../content/academy/curriculum";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const identity = await resolveLearnerId(request);
    const backend = await probeBackend();

    if (!identity) {
      return Response.json({
        authenticated: false,
        learnerId: null,
        source: null,
        backend: backend.mode,
        d1: backend.d1,
        schemaOk: backend.schemaOk,
        progress: [],
        deliverableCount: 0,
        completedCount: 0,
        totalLessons: getTotalLessons(),
        next: getFirstLesson()
          ? {
              phaseSlug: getFirstLesson()!.phase.slug,
              lessonSlug: getFirstLesson()!.lesson.slug,
              title: getFirstLesson()!.lesson.title,
              phaseTitle: getFirstLesson()!.phase.title,
            }
          : null,
      });
    }

    const [progress, deliverables] = await Promise.all([
      listProgress(identity.learnerId),
      listDeliverables(identity.learnerId),
    ]);

    const completed = progress.filter((row) => row.status === "completed");
    const next =
      getNextIncompleteLesson(completed) ?? getFirstLesson();

    return Response.json({
      authenticated: true,
      learnerId: identity.learnerId,
      source: identity.source,
      backend: getLastBackendMode(),
      d1: backend.d1,
      schemaOk: backend.schemaOk,
      progress,
      deliverableCount: deliverables.length,
      completedCount: completed.length,
      totalLessons: getTotalLessons(),
      next: next
        ? {
            phaseSlug: next.phase.slug,
            lessonSlug: next.lesson.slug,
            title: next.lesson.title,
            phaseTitle: next.phase.title,
          }
        : null,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
