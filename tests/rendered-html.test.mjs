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
