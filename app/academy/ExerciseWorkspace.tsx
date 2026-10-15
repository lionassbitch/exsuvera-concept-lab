"use client";

import { useEffect, useRef, useState } from "react";
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
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "autosaved"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const complete = isComplete(phaseSlug, lessonSlug);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef = useRef(body);
  bodyRef.current = body;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      try {
        const existing = await getDeliverable(phaseSlug, lessonSlug);
        if (!cancelled && existing?.body) {
          setBody(existing.body);
          setDirty(false);
        }
      } catch {
        // empty draft is fine
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, getDeliverable, phaseSlug, lessonSlug]);

  useEffect(() => {
    if (!dirty || !body.trim() || !ready) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        await saveDeliverable({
          phaseSlug,
          lessonSlug,
          title,
          body: bodyRef.current,
        });
        setStatus("autosaved");
        setDirty(false);
      } catch {
        // manual save still available
      }
    }, 1800);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [dirty, body, ready, phaseSlug, lessonSlug, title, saveDeliverable]);

  async function onSave() {
    setStatus("saving");
    setError(null);
    try {
      await saveDeliverable({ phaseSlug, lessonSlug, title, body });
      if (!complete) await markComplete(phaseSlug, lessonSlug);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save");
    }
  }

  async function onCompleteOnly() {
    setStatus("saving");
    setError(null);
    try {
      if (body.trim()) {
        await saveDeliverable({ phaseSlug, lessonSlug, title, body });
      }
      await markComplete(phaseSlug, lessonSlug);
      setStatus("saved");
      setDirty(false);
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
          setDirty(true);
          if (status === "saved" || status === "autosaved") setStatus("idle");
        }}
        placeholder="Write your deliverable here. Autosaves to the LAB Academy backend."
        rows={8}
        aria-describedby={`deliverable-status-${lessonSlug}`}
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
        <small id={`deliverable-status-${lessonSlug}`}>
          {status === "saved"
            ? "Saved · lesson complete"
            : status === "autosaved"
              ? "Autosaved"
              : status === "error"
                ? error
                : complete
                  ? "Completed"
                  : dirty
                    ? "Unsaved changes"
                    : "Backend-backed · autosave on"}
        </small>
      </div>
    </div>
  );
}
