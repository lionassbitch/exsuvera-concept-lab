import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {}, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the concept lab", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Concept Lab/i);
  assert.match(html, /Thyself/);
  assert.match(html, /Blueprint Chat/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders the interactive prototype route", async () => {
  const response = await render("/interactive");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Try the/);
  assert.match(html, /Begin listening/);
  assert.match(html, /Speak your answer/);
});

test("renders the Origins Bible hub and a section", async () => {
  const hub = await render("/bible");
  assert.equal(hub.status, 200);
  const hubHtml = await hub.text();
  assert.match(hubHtml, /Origins Bible/i);
  assert.match(hubHtml, /The word/i);
  assert.match(hubHtml, /Pryde/);
  assert.match(hubHtml, /Anput/);
  assert.match(hubHtml, /This is not a brand/i);

  const origins = await render("/bible/origins");
  assert.equal(origins.status, 200);
  const originsHtml = await origins.text();
  assert.match(originsHtml, /word that grew teeth/i);
  assert.match(originsHtml, /Lion/);

  const sources = await render("/bible/sources");
  assert.equal(sources.status, 200);
  const sourcesHtml = await sources.text();
  assert.match(sourcesHtml, /ChatGPT/);
  assert.match(sourcesHtml, /Claude/);
  assert.match(sourcesHtml, /The Crown from Below/);
  assert.match(sourcesHtml, /Notice to Quit/);
  assert.match(sourcesHtml, /due diligence/i);
  assert.match(sourcesHtml, /data export is ready/i);
});

test("renders LAB Academy hub and a lesson", async () => {
  const hub = await render("/academy");
  assert.equal(hub.status, 200);
  const hubHtml = await hub.text();
  assert.match(hubHtml, /LAB Academy/i);
  assert.match(hubHtml, /sharpen my vision/i);
  assert.match(hubHtml, /Orientation/);
  assert.match(hubHtml, /backend progress/i);

  const lesson = await render("/academy/orientation/uncertainty-audit");
  assert.equal(lesson.status, 200);
  const lessonHtml = await lesson.text();
  assert.match(lessonHtml, /The uncertainty audit/);
  assert.match(lessonHtml, /Save deliverable|Deliverable/i);
});
