import { resolveLearnerId } from "../../../lib/academy-auth";
import {
  getDeliverable,
  listDeliverables,
  upsertDeliverable,
} from "../../../lib/academy-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const identity = await resolveLearnerId(request);
    if (!identity) {
      return Response.json({ error: "learner id required" }, { status: 401 });
    }

    const url = new URL(request.url);
    const phaseSlug = url.searchParams.get("phase")?.trim() ?? "";
    const lessonSlug = url.searchParams.get("lesson")?.trim() ?? "";

    if (phaseSlug && lessonSlug) {
      const deliverable = await getDeliverable(
        identity.learnerId,
        phaseSlug,
        lessonSlug
      );
      return Response.json({ deliverable });
    }

    const deliverables = await listDeliverables(identity.learnerId);
    return Response.json({ deliverables });
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
      title?: string;
      body?: string;
    };

    const phaseSlug = payload.phaseSlug?.trim() ?? "";
    const lessonSlug = payload.lessonSlug?.trim() ?? "";
    const title = payload.title?.trim() ?? "";
    const body = payload.body?.trim() ?? "";

    if (!phaseSlug || !lessonSlug || !title) {
      return Response.json(
        { error: "phaseSlug, lessonSlug, and title are required" },
        { status: 400 }
      );
    }

    if (body.length > 20000) {
      return Response.json(
        { error: "deliverable body must be under 20,000 characters" },
        { status: 400 }
      );
    }

    const deliverable = await upsertDeliverable({
      learnerId: identity.learnerId,
      phaseSlug,
      lessonSlug,
      title,
      body,
    });

    return Response.json({ deliverable }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
