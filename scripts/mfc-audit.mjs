/*
 * Interaction audit for the material library section (`#materials`).
 *
 * Drives headless Edge over the DevTools Protocol and asserts, at a desktop and
 * a phone viewport, the behaviour that a static screenshot cannot prove:
 *
 *   - the wall paints one frame per record, on the expected column count
 *   - a frame opens the viewer, the page locks, and the dialog fits the viewport
 *     (the panel drops under the plate on phones)
 *   - the wheel zooms, anchors inside the stage, and clamps at the 6x ceiling
 *   - the toolbar zooms out one step and resets to 1x, centred
 *   - Tab from the last control stays inside the dialog
 *   - Escape closes the viewer, unlocks the page, and returns focus to the frame
 *   - a finish filter re-flows the wall and leaves the viewer closed
 *
 * Requires a running server:
 *   npm run build && npx next start -p 3100
 *   npm run audit:mfc
 *
 * Writes PNGs to `_ref/shots/` and the raw result to `_ref/mfc-audit.json`
 * (both gitignored). No npm dependencies are needed beyond Node itself.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const BROWSERS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

const VIEWPORTS = [
  { name: "1440x900", w: 1440, h: 900 },
  { name: "390x844", w: 390, h: 844 },
];

const [, , url = "http://localhost:3100"] = process.argv;
const PORT = 9334;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browserPath = BROWSERS.find((p) => existsSync(p));
if (!browserPath) {
  console.error("No Edge/Chrome found. Cannot check.");
  process.exit(2);
}

const outDir = join(process.cwd(), "_ref", "shots");
mkdirSync(outDir, { recursive: true });

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.handlers.get(msg.method) || []) fn(msg.params);
      }
    });
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(
        res.exceptionDetails.exception?.description || JSON.stringify(res.exceptionDetails)
      );
    }
    return res.result.value;
  }
}

/* -------------------------------------------------------------- payloads ---- */
const REVEAL_JS = `document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in")); document.querySelector(".hero")?.classList.add("is-loaded"); true`;

const SCROLL_JS = `(() => { const el = document.querySelector("#materials"); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: "auto" }); return true; })()`;

const WALL_JS = `(() => {
  const section = document.querySelector("#materials");
  if (!section) return { error: "section missing" };
  const grid = section.querySelector(".mfw-grid");
  const frames = [...section.querySelectorAll(".mf")];
  const first = frames[0];
  const opening = first?.querySelector(".mf-window");
  const img = opening?.querySelector("img");
  const cs = getComputedStyle(grid);
  const sr = section.getBoundingClientRect();
  const fr = opening?.getBoundingClientRect();
  return {
    direction: getComputedStyle(section).direction,
    sectionZ: getComputedStyle(section).zIndex,
    sectionTransform: getComputedStyle(section).transform,
    sectionTop: Math.round(sr.top + window.scrollY),
    gridColumns: cs.gridTemplateColumns.split(" ").length,
    gap: cs.gap,
    frames: frames.length,
    chips: [...section.querySelectorAll(".mfw-chip")].map((c) => c.textContent.trim()),
    pressed: section.querySelector(".mfw-chip[aria-pressed='true']")?.textContent.trim(),
    frameWidth: first ? Math.round(first.getBoundingClientRect().width) : null,
    openingRatio: fr ? Number((fr.width / fr.height).toFixed(3)) : null,
    imgLoading: img?.getAttribute("loading"),
    imgHasSizes: Boolean(img?.getAttribute("sizes")),
    imgFromSamples: img?.currentSrc?.includes("/images/samples/") ?? null,
    label: first ? first.textContent.replace(/\\s+/g, " ").trim() : null,
    hasPopup: first ? first.getAttribute("aria-haspopup") : null,
    note: section.querySelector(".mfw-note")?.textContent.trim() ?? null,
    viewerUp: !!section.querySelector(".mv"),
  };
})()`;

const OPEN_JS = `(() => { const first = document.querySelector("#materials .mf"); if (!first) return { error: "no frame" }; first.click(); return { clicked: true }; })()`;

const VIEWER_JS = `(() => {
  const mv = document.querySelector(".mv");
  if (!mv) return { error: "viewer missing" };
  const dialog = mv.querySelector(".mv-dialog");
  const panel = mv.querySelector(".mv-panel");
  const stage = mv.querySelector(".mv-stage");
  const frame = mv.querySelector(".mv-frame");
  const d = dialog.getBoundingClientRect();
  const p = panel.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  return {
    zIndex: getComputedStyle(mv).zIndex,
    position: getComputedStyle(mv).position,
    ariaModal: mv.querySelector(".mv-dialog")?.getAttribute("aria-modal"),
    bodyLocked: document.body.classList.contains("mv-open"),
    bodyOverflow: getComputedStyle(document.body).overflow,
    fits: d.top >= -1 && d.bottom <= window.innerHeight + 1 && d.left >= -1 && d.right <= window.innerWidth + 1,
    dialog: { w: Math.round(d.width), h: Math.round(d.height), top: Math.round(d.top) },
    stage: { w: Math.round(s.width), h: Math.round(s.height) },
    panelUnderStage: p.top >= s.bottom - 1,
    name: mv.querySelector(".mv-name")?.textContent,
    counter: mv.querySelector(".mv-position")?.textContent.trim(),
    zoom: mv.querySelector(".mv-zoom")?.textContent.trim(),
    badge: mv.querySelector(".mv-badge")?.textContent.trim() ?? null,
    hints: mv.querySelector(".mv-hints")?.textContent.replace(/\\s+/g, " ").trim(),
    toolLabelDisplay: getComputedStyle(mv.querySelector(".mv-tool-text")).display,
    touchAction: getComputedStyle(stage).touchAction,
    frameHasTransition: getComputedStyle(frame).transitionProperty.includes("transform"),
    focusedClass: document.activeElement?.className,
    specs: [...mv.querySelectorAll(".mv-spec")].map((row) => row.textContent.replace(/\\s+/g, " ").trim()),
  };
})()`;


const WHEEL_JS = (deltaY) => `(() => {
  const stage = document.querySelector(".mv-stage");
  const r = stage.getBoundingClientRect();
  stage.dispatchEvent(new WheelEvent("wheel", {
    deltaY: ${deltaY},
    clientX: r.left + r.width * 0.35,
    clientY: r.top + r.height * 0.4,
    bubbles: true,
    cancelable: true,
  }));
  return true;
})()`;

const SCALE_JS = `(() => {
  const frame = document.querySelector(".mv-frame");
  const m = new DOMMatrixReadOnly(getComputedStyle(frame).transform);
  const stage = document.querySelector(".mv-stage").getBoundingClientRect();
  return {
    scale: Number(m.a.toFixed(3)),
    x: Math.round(m.e),
    y: Math.round(m.f),
    insideStage: Math.abs(m.e) <= stage.width && Math.abs(m.f) <= stage.height,
    zoom: document.querySelector(".mv-zoom")?.textContent.trim(),
    outDisabled: [...document.querySelectorAll(".mv-tools .mv-tool")][0].disabled,
  };
})()`;

const TOOL_JS = (index) => `(() => {
  const buttons = [...document.querySelectorAll(".mv-tools .mv-tool")];
  const label = buttons[${index}].getAttribute("aria-label");
  buttons[${index}].click();
  return label;
})()`;

const TAB_JS = `(() => {
  const root = document.querySelector(".mv-dialog");
  const reachable = [...root.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')];
  reachable[reachable.length - 1].focus();
  root.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
  return { count: reachable.length };
})()`;

const TAB_RESULT_JS = `(() => {
  const root = document.querySelector(".mv-dialog");
  return {
    insideDialog: root.contains(document.activeElement),
    active: document.activeElement.getAttribute("aria-label") || document.activeElement.className,
  };
})()`;

const FILTER_JS = `(() => {
  const chips = [...document.querySelectorAll("#materials .mfw-chip")];
  chips[1].click();
  return chips[1].textContent.trim();
})()`;

const FILTERED_JS = `(() => {
  const section = document.querySelector("#materials");
  return {
    frames: section.querySelectorAll(".mf").length,
    viewerUp: !!section.querySelector(".mv"),
    pressed: section.querySelector(".mfw-chip[aria-pressed='true']")?.textContent.trim(),
    label: section.querySelector(".mf")?.textContent.replace(/\\s+/g, " ").trim(),
  };
})()`;

const ESCAPE_JS = `(() => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); return true; })()`;

const CLOSED_JS = `(() => ({
  viewerUp: !!document.querySelector(".mv"),
  bodyLocked: document.body.classList.contains("mv-open"),
  focusedClass: document.activeElement?.className ?? null,
}))()`;

/* --------------------------------------------------------------- driver ---- */
const profile = join(process.cwd(), "_ref", "edge-profile-check");
rmSync(profile, { recursive: true, force: true });

const child = spawn(
  browserPath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

let version = null;
for (let i = 0; i < 40; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    if (r.ok) {
      version = await r.json();
      break;
    }
  } catch {
    /* not up yet */
  }
  await sleep(500);
}
if (!version) {
  child.kill();
  throw new Error("DevTools endpoint never came up");
}

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const target = targets.find((t) => t.type === "page");
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

const cdp = new CDP(ws);
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Log.enable");
await cdp.send("Network.enable");

const badResponses = [];
cdp.on("Network.responseReceived", ({ response }) => {
  if (response.status >= 400) badResponses.push(`${response.status} ${response.url}`);
});

const consoleErrors = [];
cdp.on("Log.entryAdded", ({ entry }) => {
  if (entry.level === "error") consoleErrors.push(entry.text);
});
cdp.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
  consoleErrors.push(
    exceptionDetails.exception?.description || exceptionDetails.text || "exception"
  );
});

let loadResolve = null;
cdp.on("Page.loadEventFired", () => {
  const r = loadResolve;
  loadResolve = null;
  if (r) r();
});

async function shot(name) {
  const res = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(res.data, "base64"));
}

async function goto() {
  const p = new Promise((res) => {
    loadResolve = res;
  });
  await cdp.send("Page.navigate", { url });
  await p;
  await sleep(3000);
  await cdp.eval(REVEAL_JS);
  await sleep(600);
  await cdp.eval(SCROLL_JS);
  await sleep(800);
}

const report = { url, browser: version.Browser, viewports: [], consoleErrors, badResponses };

for (const vp of VIEWPORTS) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    mobile: vp.w < 500,
  });

  await goto();
  const entry = { name: vp.name, wall: await cdp.eval(WALL_JS) };
  await shot(`mfc-audit-${vp.name}-wall`);

  // --- open the viewer ----------------------------------------------------
  await cdp.eval(OPEN_JS);
  await sleep(800);
  entry.viewer = await cdp.eval(VIEWER_JS);
  await shot(`mfc-audit-${vp.name}-viewer`);

  // --- wheel zoom, then push past the ceiling -----------------------------
  await cdp.eval(WHEEL_JS(-360));
  await sleep(700);
  entry.zoomIn = await cdp.eval(SCALE_JS);
  await cdp.eval(WHEEL_JS(-60000));
  await sleep(700);
  entry.zoomMax = await cdp.eval(SCALE_JS);
  await shot(`mfc-audit-${vp.name}-zoomed`);

  // --- toolbar: zoom out once, then reset ---------------------------------
  entry.toolZoomOut = await cdp.eval(TOOL_JS(0));
  await sleep(600);
  entry.afterZoomOut = await cdp.eval(SCALE_JS);
  entry.toolReset = await cdp.eval(TOOL_JS(2));
  await sleep(600);
  entry.afterReset = await cdp.eval(SCALE_JS);

  // --- the tab trap -------------------------------------------------------
  entry.tabReachable = await cdp.eval(TAB_JS);
  await sleep(250);
  entry.tabTrap = await cdp.eval(TAB_RESULT_JS);

  // --- Escape closes, unlocks and hands focus back ------------------------
  await cdp.eval(ESCAPE_JS);
  await sleep(700);
  entry.afterClose = await cdp.eval(CLOSED_JS);

  // --- filter the wall ----------------------------------------------------
  entry.filterClicked = await cdp.eval(FILTER_JS);
  await sleep(800);
  entry.afterFilter = await cdp.eval(FILTERED_JS);
  await shot(`mfc-audit-${vp.name}-filtered`);

  report.viewports.push(entry);
}

writeFileSync(join(process.cwd(), "_ref", "mfc-audit.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
ws.close();
child.kill();
process.exit(0);

