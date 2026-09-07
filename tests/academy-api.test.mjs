import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-api`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

function guestId() {
  return `guest:test-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}

async function api(worker, path, { method = "GET", id, body } = {}) {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "x-academy-learner-id": id,
  };
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),
    {},
    { waitUntil() {}, passThroughOnException() {} }
  );
}

test("academy progress API persists completion", async () => {
  const worker = await loadWorker();
  const id = guestId();

  const post = await api(worker, "/api/academy/progress", {
    method: "POST",
    id,
    body: {
      phaseSlug: "orientation",
      lessonSlug: "uncertainty-audit",
      status: "completed",
    },
  });
  assert.equal(post.status, 201);
  const created = await post.json();
  assert.equal(created.progress.phaseSlug, "orientation");
  assert.equal(created.progress.lessonSlug, "uncertainty-audit");

  const get = await api(worker, "/api/academy/progress", { id });
  assert.equal(get.status, 200);
  const listed = await get.json();
  assert.ok(
    listed.progress.some(
      (row) =>
        row.phaseSlug === "orientation" &&
        row.lessonSlug === "uncertainty-audit"
    )
  );
});

test("academy deliverables API saves exercise text", async () => {
  const worker = await loadWorker();
  const id = guestId();

  const post = await api(worker, "/api/academy/deliverables", {
    method: "POST",
    id,
    body: {
      phaseSlug: "mission",
      lessonSlug: "mission-workshop",
      title: "Final mission statement",
      body: "Help busy parents reclaim Sunday evenings.",
    },
  });
  assert.equal(post.status, 201);
  const created = await post.json();
  assert.match(created.deliverable.body, /Sunday evenings/);

  const get = await api(
    worker,
    "/api/academy/deliverables?phase=mission&lesson=mission-workshop",
    { id }
  );
  assert.equal(get.status, 200);
  const fetched = await get.json();
  assert.equal(fetched.deliverable.title, "Final mission statement");
});

test("academy API rejects missing learner id", async () => {
  const worker = await loadWorker();
  const res = await worker.fetch(
    new Request("http://localhost/api/academy/progress", {
      headers: { accept: "application/json" },
    }),
    {},
    { waitUntil() {}, passThroughOnException() {} }
  );
  assert.equal(res.status, 401);
});
