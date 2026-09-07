"use client";

import { useEffect, useState } from "react";
import { useAcademy } from "./AcademyProvider";

export function ExerciseWorkspace({
  phaseSlug,
  lessonSlug,
  title,
  prompt,
  time,
}: {
  phaseSlug: string;
  lessonSlug: string;
  title: string;
  prompt: string;
  time: string;
}) {
  const { ready, getDeliverable, saveDeliverable, markComplete, isComplete } =
    useAcademy();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const complete = isComplete(phaseSlug, lessonSlug);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      try {
        const existing = await getDeliverable(phaseSlug, lessonSlug);
        if (!cancelled && existing?.body) setBody(existing.body);
      } catch {
        // empty draft is fine
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, getDeliverable, phaseSlug, lessonSlug]);

  async function onSave() {
    setStatus("saving");
    setError(null);
    try {
      await saveDeliverable({ phaseSlug, lessonSlug, title, body });
      if (!complete) await markComplete(phaseSlug, lessonSlug);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save");
    }
  }

  async function onCompleteOnly() {
    setStatus("saving");
    setError(null);
    try {
      await markComplete(phaseSlug, lessonSlug);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not mark complete");
    }
  }

  return (
    <div className="exercise workspace">
      <b>Exercise · {time}</b>
      <p className="prompt">{prompt}</p>
      <p className="deliv">Deliverable → {title}</p>
      <label className="srOnly" htmlFor={`deliverable-${lessonSlug}`}>
        Your deliverable
      </label>
      <textarea
        id={`deliverable-${lessonSlug}`}
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          if (status === "saved") setStatus("idle");
        }}
        placeholder="Write your deliverable here. It saves to the LAB Academy backend."
        rows={8}
      />
      <div className="acts">
        <button
          type="button"
          className="pill blue"
          onClick={onSave}
          disabled={status === "saving" || !body.trim()}
        >
          {status === "saving" ? "Saving…" : "Save deliverable"}
        </button>
        <button
          type="button"
          className="pill plainBtn"
          onClick={onCompleteOnly}
          disabled={status === "saving" || complete}
        >
          {complete ? "Lesson complete" : "Mark lesson complete"}
        </button>
        <small>
          {status === "saved"
            ? "Saved to backend"
            : status === "error"
              ? error
              : complete
                ? "Completed"
                : "Backend-backed · guest or ChatGPT identity"}
        </small>
      </div>
    </div>
  );
}
