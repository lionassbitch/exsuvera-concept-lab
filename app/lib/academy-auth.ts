import { headers } from "next/headers";
import { getChatGPTUser } from "../chatgpt-auth";

const LEARNER_HEADER = "x-academy-learner-id";

/**
 * Resolve the academy learner id.
 * Prefer ChatGPT workspace identity when present; otherwise accept the
 * client-supplied guest id header (uuid stored in localStorage).
 */
export async function resolveLearnerId(
  request?: Request
): Promise<{ learnerId: string; source: "chatgpt" | "guest" } | null> {
  const user = await getChatGPTUser().catch(() => null);
  if (user?.email) {
    return { learnerId: `cg:${user.email}`, source: "chatgpt" };
  }

  const fromRequest = request?.headers.get(LEARNER_HEADER)?.trim();
  if (fromRequest && isValidLearnerId(fromRequest)) {
    return { learnerId: fromRequest, source: "guest" };
  }

  try {
    const h = await headers();
    const fromHeaders = h.get(LEARNER_HEADER)?.trim();
    if (fromHeaders && isValidLearnerId(fromHeaders)) {
      return { learnerId: fromHeaders, source: "guest" };
    }
  } catch {
    // headers() unavailable outside a request context
  }

  return null;
}

export function isValidLearnerId(value: string) {
  return (
    /^guest:[A-Za-z0-9_-]{8,80}$/.test(value) ||
    /^cg:[^\s]{3,320}$/i.test(value)
  );
}

export { LEARNER_HEADER };
