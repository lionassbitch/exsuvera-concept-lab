import { probeBackend } from "../../../lib/academy-store";
import { getTotalLessons, getAllPhases } from "../../../../content/academy/curriculum";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const backend = await probeBackend();
    return Response.json({
      ok: true,
      service: "lab-academy",
      backend: backend.mode,
      d1: backend.d1,
      schemaOk: backend.schemaOk,
      phases: getAllPhases().length,
      lessons: getTotalLessons(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
