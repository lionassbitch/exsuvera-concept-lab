import { headers } from "next/headers";
import { getChatGPTUser } from "../chatgpt-auth";

const LEARNER_HEADER = "x-academy-learner-id";

/**
 * Resolve the academy learner id.
 * Authenticated ChatGPT identity is derived only from trusted server-side
 * identity. The client-supplied header may identify a guest but MUST NOT
 * impersonate the reserved "cg:" namespace.
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

/** Validate only externally supplied guest ids; never accept ChatGPT ids. */
export function isValidLearnerId(value: string) {
  return /^guest:[A-Za-z0-9_-]{8,80}$/.test(value);
}

export { LEARNER_HEADER };
