#!/usr/bin/env node
/**
 * Render a page in a real browser and report what's actually wrong with it.
 *
 * A component that has never been rendered has not been written. This script
 * is the fast version of "load it and look": it captures console errors,
 * screenshots each breakpoint, and runs the mechanical checks that are tedious
 * by hand — horizontal overflow, missing image dimensions, unlabeled controls,
 * small touch targets, heading order, and whether focus is ever invisible.
 *
 * Usage:
 *   node check-page.mjs http://localhost:3000
 *   node check-page.mjs http://localhost:3000/pricing --out ./shots
 *   node check-page.mjs http://localhost:3000 --widths 320,768,1440
 *   node check-page.mjs http://localhost:3000 --dark
 *
 * Requires Playwright. In this environment Chromium is preinstalled at
 * /opt/pw-browsers — do not run `playwright install`.
 *
 * Exits 1 if console errors or failed checks are found, so it can gate CI.
 */

import { mkdir } from "node:fs/promises";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";

/**
 * Resolve playwright from the project, or fall back to a global install —
 * many environments (including this one) provide it globally rather than as a
 * project dependency, and failing on that is a pointless obstacle.
 */
async function loadChromium() {
  try {
    return (await import("playwright")).chromium;
  } catch {}
  try {
    return (await import("playwright-core")).chromium;
  } catch {}
  try {
    const root = execSync("npm root -g", { encoding: "utf8" }).trim();
    for (const pkg of ["playwright", "playwright-core"]) {
      try {
        const url = pathToFileURL(path.join(root, pkg, "index.mjs")).href;
        return (await import(url)).chromium;
      } catch {
        try {
          const url = pathToFileURL(path.join(root, pkg, "index.js")).href;
          return (await import(url)).chromium;
        } catch {}
      }
    }
  } catch {}
  console.error(
    "Could not load Playwright. Install it in the project (npm i -D playwright)\n" +
    "or point NODE_PATH at a global install. Do not run `playwright install` in\n" +
    "this environment — Chromium is already at /opt/pw-browsers."
  );
  process.exit(2);
}

const chromium = await loadChromium();

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--"));

if (!url) {
  console.error("usage: check-page.mjs <url> [--out DIR] [--widths 320,768,1440] [--dark]");
  process.exit(2);
}

const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};

const outDir = path.resolve(flag("out", "./screenshots"));
const widths = flag("widths", "320,768,1440").split(",").map((n) => parseInt(n, 10));
const dark = args.includes("--dark");

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  colorScheme: dark ? "dark" : "light",
  reducedMotion: "no-preference",
});
const page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
  }
});
page.on("pageerror", (err) => pageErrors.push(err.message));
page.on("requestfailed", (req) => {
  // Aborted requests are normal (cancelled fetches, prefetch races).
  const failure = req.failure()?.errorText ?? "";
  if (!failure.includes("ABORTED")) {
    failedRequests.push(`${req.method()} ${req.url()} — ${failure}`);
  }
});

const findings = [];
const note = (severity, message) => findings.push({ severity, message });

try {
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  if (!response) {
    note("error", "No response from the page.");
  } else if (!response.ok()) {
    note("error", `HTTP ${response.status()} ${response.statusText()}`);
  }
} catch (e) {
  console.error(`Failed to load ${url}: ${e.message}`);
  console.error("Is the dev server running?");
  await browser.close();
  process.exit(1);
}

// ---------------------------------------------------------------- per-width
for (const width of widths) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(400); // let layout and any transitions settle

  const shot = path.join(outDir, `${width}w${dark ? "-dark" : ""}.png`);
  await page.screenshot({ path: shot, fullPage: true });

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    if (doc.scrollWidth <= doc.clientWidth + 1) return null;
    // Identify the widest offender so the report is actionable.
    const culprits = [...document.querySelectorAll("body *")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { el, right: r.right, left: r.left };
      })
      .filter((x) => x.right > doc.clientWidth + 1)
      .sort((a, b) => b.right - a.right)
      .slice(0, 3)
      .map(({ el, right }) => {
        const id = el.id ? `#${el.id}` : "";
        const cls = typeof el.className === "string" && el.className
          ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
          : "";
        return `${el.tagName.toLowerCase()}${id}${cls} (right edge ${Math.round(right)}px)`;
      });
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, culprits };
  });

  if (overflow) {
    note("error",
      `Horizontal overflow at ${width}px: content is ${overflow.scrollWidth}px ` +
      `wide in a ${overflow.clientWidth}px viewport.\n      Widest: ` +
      overflow.culprits.join("\n              "));
  }

  // Touch targets only matter at the narrow end.
  if (width <= 480) {
    const small = await page.evaluate(() => {
      const sel = "a, button, input, select, textarea, [role=button], [tabindex='0']";
      return [...document.querySelectorAll(sel)]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false;   // hidden
          // A ::before/::after can legitimately carry the hit area for a
          // control whose visible box must stay small — a pagination dot, a
          // close cross. Measuring only the element's own rect reports those
          // as failures when the real touch target is fine.
          let w = r.width, h = r.height;
          for (const pseudo of ["::after", "::before"]) {
            const cs = getComputedStyle(el, pseudo);
            if (!cs || cs.content === "none" || cs.position !== "absolute") continue;
            w = Math.max(w, parseFloat(cs.width) || 0);
            h = Math.max(h, parseFloat(cs.height) || 0);
          }
          el.__hit = { w, h };
          return w < 44 || h < 44;
        })
        .slice(0, 8)
        .map((el) => {
          const r = el.getBoundingClientRect();
          const hit = el.__hit || { w: r.width, h: r.height };
          const label = (el.getAttribute("aria-label") || el.textContent || "")
            .trim().slice(0, 30);
          const grown = Math.round(hit.w) !== Math.round(r.width) || Math.round(hit.h) !== Math.round(r.height);
          return `${el.tagName.toLowerCase()} "${label}" ${Math.round(hit.w)}×${Math.round(hit.h)}` +
                 (grown ? ` (box ${Math.round(r.width)}×${Math.round(r.height)}, hit area extended)` : "");
        });
    });
    if (small.length) {
      note("warn", `Touch targets under 44×44px at ${width}px:\n      ` + small.join("\n      "));
    }
  }
}

// ------------------------------------------------------------ static checks
await page.setViewportSize({ width: 1440, height: 900 });

const structural = await page.evaluate(() => {
  const out = {};

  out.imagesWithoutDims = [...document.querySelectorAll("img")]
    .filter((img) => {
      if (img.getAttribute("width") && img.getAttribute("height")) return false;
      const s = getComputedStyle(img);
      return s.aspectRatio === "auto" && (s.height === "auto" || !img.style.height);
    })
    .slice(0, 8)
    .map((img) => img.currentSrc || img.src || "(no src)");

  out.imagesWithoutAlt = [...document.querySelectorAll("img:not([alt])")]
    .slice(0, 8)
    .map((img) => img.currentSrc || img.src || "(no src)");

  out.unlabeledControls = [...document.querySelectorAll(
    "input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea")]
    .filter((el) => {
      if (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")) return false;
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false;
      return !el.closest("label");
    })
    .slice(0, 8)
    .map((el) => `${el.tagName.toLowerCase()}[type=${el.type || "n/a"}]` +
                 (el.name ? ` name="${el.name}"` : ""));

  out.iconButtonsWithoutName = [...document.querySelectorAll("button, [role=button]")]
    .filter((el) => {
      const text = (el.textContent || "").trim();
      return !text && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")
             && !el.getAttribute("title");
    })
    .slice(0, 8)
    .map((el) => el.outerHTML.slice(0, 80));

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .map((h) => ({ level: +h.tagName[1], text: h.textContent.trim().slice(0, 40) }));
  out.h1Count = headings.filter((h) => h.level === 1).length;
  out.headingSkips = [];
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level - headings[i - 1].level > 1) {
      out.headingSkips.push(
        `h${headings[i - 1].level} "${headings[i - 1].text}" -> h${headings[i].level} "${headings[i].text}"`);
    }
  }

  out.positiveTabindex = [...document.querySelectorAll("[tabindex]")]
    .filter((el) => +el.getAttribute("tabindex") > 0)
    .slice(0, 5)
    .map((el) => `${el.tagName.toLowerCase()} tabindex="${el.getAttribute("tabindex")}"`);

  out.title = document.title;
  out.lang = document.documentElement.lang;
  return out;
});

if (!structural.title) note("warn", "Page has no <title>.");
if (!structural.lang) note("warn", "<html> has no lang attribute.");
if (structural.h1Count === 0) note("warn", "No <h1> on the page.");
if (structural.h1Count > 1) note("warn", `${structural.h1Count} <h1> elements — expected 1.`);
if (structural.headingSkips.length)
  note("warn", "Heading levels skipped:\n      " + structural.headingSkips.join("\n      "));
if (structural.imagesWithoutDims.length)
  note("warn", "Images without width/height or aspect-ratio (cause layout shift):\n      "
    + structural.imagesWithoutDims.join("\n      "));
if (structural.imagesWithoutAlt.length)
  note("error", "Images with no alt attribute (screen readers read the filename):\n      "
    + structural.imagesWithoutAlt.join("\n      "));
if (structural.unlabeledControls.length)
  note("error", "Form controls with no accessible label:\n      "
    + structural.unlabeledControls.join("\n      "));
if (structural.iconButtonsWithoutName.length)
  note("error", "Buttons with no accessible name:\n      "
    + structural.iconButtonsWithoutName.join("\n      "));
if (structural.positiveTabindex.length)
  note("warn", "Positive tabindex breaks document order — use 0 or -1:\n      "
    + structural.positiveTabindex.join("\n      "));

// ------------------------------------------------------------- focus sweep
// Tab through the first 30 stops and flag any that render no visible ring.
const focusIssues = await page.evaluate(async () => {
  const focusable = [...document.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((el) => el.getBoundingClientRect().width > 0);

  const bad = [];
  for (const el of focusable.slice(0, 30)) {
    el.focus();
    const s = getComputedStyle(el);
    const noOutline = s.outlineStyle === "none" || parseFloat(s.outlineWidth) === 0;
    const noShadow = s.boxShadow === "none";
    // A ring may also come from a border or background change; this catches the
    // clear-cut case where nothing at all is applied.
    if (noOutline && noShadow) {
      const label = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30);
      bad.push(`${el.tagName.toLowerCase()} "${label}"`);
    }
  }
  document.activeElement?.blur?.();
  return bad.slice(0, 8);
});

if (focusIssues.length) {
  note("error", "No visible focus indicator on:\n      " + focusIssues.join("\n      ") +
    "\n      Style :focus-visible with an outline — this is the only wayfinding keyboard users have.");
}

await browser.close();

// ----------------------------------------------------------------- report
const line = "─".repeat(64);
console.log(`\n${line}\n  ${url}${dark ? "  (dark mode)" : ""}\n${line}\n`);

if (pageErrors.length) {
  console.log("Uncaught page errors:");
  pageErrors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log();
}
if (consoleErrors.length) {
  console.log("Console output:");
  [...new Set(consoleErrors)].slice(0, 15).forEach((e) => console.log(`  • ${e}`));
  console.log();
}
if (failedRequests.length) {
  console.log("Failed requests:");
  failedRequests.slice(0, 10).forEach((r) => console.log(`  ✗ ${r}`));
  console.log();
}

const errors = findings.filter((f) => f.severity === "error");
const warns = findings.filter((f) => f.severity === "warn");

if (errors.length) {
  console.log("Errors:");
  errors.forEach((f) => console.log(`  ✗ ${f.message}`));
  console.log();
}
if (warns.length) {
  console.log("Warnings:");
  warns.forEach((f) => console.log(`  ! ${f.message}`));
  console.log();
}

console.log(`Screenshots: ${outDir}  (${widths.map((w) => `${w}w`).join(", ")})`);

const failed = errors.length + pageErrors.length;
if (!failed && !warns.length && !consoleErrors.length) {
  console.log("\nNo issues found by the automated checks.");
}
console.log(
  "\nThese checks are mechanical — they do not replace tabbing through the page,\n" +
  "forcing the loading/empty/error states, or looking at the screenshots.\n");

process.exit(failed ? 1 : 0);
