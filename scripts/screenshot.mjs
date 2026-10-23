/*
 * Visual verification helper.
 *
 * Renders a URL in headless Chromium (Microsoft Edge or Google Chrome) at the
 * target viewport sizes and writes PNG screenshots to `_ref/shots/`.
 *
 * Usage:
 *   node scripts/screenshot.mjs <url> <label> [--scroll=<px>]
 *
 * Requires a local Edge/Chrome install — no extra npm dependencies.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BROWSERS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

const VIEWPORTS = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "laptop", w: 1280, h: 800 },
  { name: "tablet", w: 768, h: 1024 },
  { name: "mobile", w: 390, h: 844 },
];

const SECTIONS = ["top", "services", "about", "work", "contact"];

const [, , url, label = "page", ...rest] = process.argv;
const allTargets = rest.includes("--targets=all");

if (!url) {
  console.error("usage: node scripts/screenshot.mjs <url> <label> [--targets=all]");
  process.exit(1);
}

const browser = BROWSERS.find((p) => existsSync(p));
if (!browser) {
  console.error("No Edge/Chrome found. Cannot capture screenshots.");
  process.exit(2);
}

const outDir = join(process.cwd(), "_ref", "shots");
mkdirSync(outDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const vp of VIEWPORTS) {
  // Only the desktop viewport gets the full section sweep unless --targets=all.
  const sections = allTargets || vp.name === "desktop" ? SECTIONS : ["top"];

  for (const section of sections) {
    const out = join(outDir, `${label}-${vp.name}-${section}.png`);
    const target = section === "top" ? url : `${url}#${section}`;
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=10000",
      `--window-size=${vp.w},${vp.h}`,
      `--screenshot=${out}`,
      target,
    ];
    try {
      execFileSync(browser, args, { stdio: "ignore", timeout: 120_000 });
      console.log(`ok   ${vp.name.padEnd(8)} ${String(vp.w).padStart(4)}x${vp.h}  ${section}`);
      ok++;
    } catch (err) {
      console.error(`fail ${vp.name}/${section}: ${err.message}`);
      fail++;
    }
  }
}

console.log(`\n${ok} captured, ${fail} failed -> ${outDir}`);
