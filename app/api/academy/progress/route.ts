import { resolveLearnerId } from "../../../lib/academy-auth";
import { listProgress, upsertProgress } from "../../../lib/academy-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const identity = await resolveLearnerId(request);
    if (!identity) {
      return Response.json({ error: "learner id required" }, { status: 401 });
    }

    const progress = await listProgress(identity.learnerId);
    return Response.json({
      learnerId: identity.learnerId,
      source: identity.source,
      backend: "academy-store",
      progress,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const identity = await resolveLearnerId(request);
    if (!identity) {
      return Response.json({ error: "learner id required" }, { status: 401 });
    }

    const payload = (await request.json()) as {
      phaseSlug?: string;
      lessonSlug?: string;
      status?: string;
    };

    const phaseSlug = payload.phaseSlug?.trim() ?? "";
    const lessonSlug = payload.lessonSlug?.trim() ?? "";
    const status = payload.status?.trim() || "completed";

    if (!phaseSlug || !lessonSlug) {
      return Response.json(
        { error: "phaseSlug and lessonSlug are required" },
        { status: 400 }
      );
    }

    const progress = await upsertProgress({
      learnerId: identity.learnerId,
      phaseSlug,
      lessonSlug,
      status,
    });

    return Response.json({ progress }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
