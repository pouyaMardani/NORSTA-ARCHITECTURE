/*
 * Responsive verification harness (no extra npm dependencies).
 *
 * Drives headless Edge/Chrome over the DevTools Protocol to, for every target
 * viewport:
 *   - load the page and let the reveal transitions settle
 *   - measure horizontal overflow and list the offending elements
 *   - inspect the nav (hamburger visible? desktop links visible?)
 *   - exercise the mobile menu (open → check → Escape → check)
 *   - collect console errors
 *   - write a viewport screenshot and a full-page screenshot
 *
 * Usage:
 *   node scripts/responsive-audit.mjs [url] [label]
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
  { name: "320x568", w: 320, h: 568, mobile: true },
  { name: "375x812", w: 375, h: 812, mobile: true },
  { name: "390x844", w: 390, h: 844, mobile: true },
  { name: "430x932", w: 430, h: 932, mobile: true },
  { name: "768x1024", w: 768, h: 1024, mobile: false },
  { name: "1280x800", w: 1280, h: 800, mobile: false },
  { name: "1440x900", w: 1440, h: 900, mobile: false },
];

const [, , url = "http://localhost:3100", label = "resp"] = process.argv;
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browserPath = BROWSERS.find((p) => existsSync(p));
if (!browserPath) {
  console.error("No Edge/Chrome found. Cannot audit.");
  process.exit(2);
}

const outDir = join(process.cwd(), "_ref", "shots");
mkdirSync(outDir, { recursive: true });

/* ------------------------------------------------------------------ CDP ---- */
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
  /** Evaluate an expression returning a JSON-serialisable value. */
  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(
        res.exceptionDetails.exception?.description ||
          JSON.stringify(res.exceptionDetails)
      );
    }
    return res.result.value;
  }
}

/* ------------------------------------------------------- audit payloads ---- */
const AUDIT_JS = `(() => {
  const vw = window.innerWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(".lightbox")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
    if (cs.position === "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      const cls = typeof el.className === "string" ? el.className.trim() : "";
      const id = el.id ? "#" + el.id : "";
      offenders.push(
        el.tagName.toLowerCase() + id +
        (cls ? "." + cls.split(/\\s+/).join(".") : "") +
        " [" + Math.round(r.left) + ".." + Math.round(r.right) + " w=" + Math.round(r.width) + "]"
      );
    }
  }
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const head = document.querySelector(".nav");
  const tc = toggle ? getComputedStyle(toggle) : null;
  const lc = links ? getComputedStyle(links) : null;
  const lr = links ? links.getBoundingClientRect() : null;
  return {
    viewportWidth: vw,
    docScrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > vw + 1,
    offenderCount: offenders.length,
    offenders: offenders.slice(0, 12),
    headerClasses: head ? head.className : null,
    headerOpacity: head ? Number(getComputedStyle(head).opacity) : null,
    navToggleDisplay: tc ? tc.display : null,
    navToggleExpanded: toggle ? toggle.getAttribute("aria-expanded") : null,
    navLinksVisible: !!(lc && lc.display !== "none" && lc.visibility !== "hidden" && Number(lc.opacity) > 0.5),
    navLinksPosition: lc ? lc.position : null,
    navLinksRect: lr ? { left: Math.round(lr.left), right: Math.round(lr.right), top: Math.round(lr.top) } : null,
  };
})()`;

const MENU_OPEN_JS = `(() => {
  const t = document.querySelector(".nav-toggle");
  if (!t) return { error: "no toggle" };
  t.click();
  return { clicked: true };
})()`;

/**
 * The panel is closed by choosing a link. The home page's `#work` is the link
 * the harness has always used; on other routes the header points back at the
 * home sections (`/#work`), so the panel's own first link is used instead of
 * assuming a route-specific one exists — the assertion is "choosing a link
 * closes the panel", which holds either way.
 */
const MENU_LINK_JS = `(() => {
  const links = document.querySelector(".nav-links");
  if (!links) return { clicked: false, reason: "no panel" };
  const target = links.querySelector('a[href="#work"]') || links.querySelector("a");
  if (!target) return { clicked: false, reason: "no links" };
  target.click();
  return { clicked: true, href: target.getAttribute("href") };
})()`;

const MENU_STATE_JS = `(() => {
  const t = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const head = document.querySelector(".nav");
  const hcs = getComputedStyle(head);
  const cs = getComputedStyle(links);
  const r = links.getBoundingClientRect();
  const a = links.querySelector("a");
  a.focus();
  return {
    expanded: t.getAttribute("aria-expanded"),
    menuAttr: head.getAttribute("data-menu-open"),
    headerClasses: head.className,
    headerOpacity: Number(hcs.opacity),
    headerTop: Math.round(head.getBoundingClientRect().top),
    inert: links.hasAttribute("inert"),
    ariaHidden: links.getAttribute("aria-hidden"),
    visibility: cs.visibility,
    opacity: Number(Number(cs.opacity).toFixed(2)),
    pointerEvents: cs.pointerEvents,
    rect: { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom) },
    withinViewport: r.left >= -1 && r.right <= window.innerWidth + 1,
    bodyLocked: document.body.classList.contains("menu-open"),
    linkFocusable: document.activeElement === a,
    linkCount: links.querySelectorAll("a").length,
  };
})()`;

const REVEAL_JS = `(() => {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  document.querySelector(".hero")?.classList.add("is-loaded");
  return true;
})()`;

const ESCAPE_JS = `(() => {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  return true;
})()`;

const SCROLL_JS = (id) => `(() => {
  const el = document.getElementById("${id}");
  if (!el) return false;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
  return true;
})()`;

/* --------------------------------------------------------------- driver ---- */
const profile = join(process.cwd(), "_ref", "edge-profile");
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
    if (r.ok) { version = await r.json(); break; }
  } catch { /* not up yet */ }
  await sleep(500);
}
if (!version) { child.kill(); throw new Error("DevTools endpoint never came up"); }

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const target = targets.find((t) => t.type === "page");
if (!target) { child.kill(); throw new Error("No page target"); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

const cdp = new CDP(ws);
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Log.enable");

const consoleErrors = [];
cdp.on("Log.entryAdded", ({ entry }) => {
  if (entry.level === "error") consoleErrors.push(entry.text);
});
cdp.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
  consoleErrors.push(
    exceptionDetails.exception?.description || exceptionDetails.text || "exception"
  );
});

// One persistent load listener that resolves whichever navigation is pending.
let loadResolve = null;
cdp.on("Page.loadEventFired", () => {
  const r = loadResolve;
  loadResolve = null;
  if (r) r();
});
let navCount = 0;
async function goto(hash = "") {
  const p = new Promise((res) => { loadResolve = res; });
  navCount += 1;
  await cdp.send("Page.navigate", {
    url: `${url}${url.includes("?") ? "&" : "?"}probe=${navCount}${hash}`,
  });
  await p;
  await sleep(4600);           // let entrance reveals, counters and safety net settle
  await cdp.eval(REVEAL_JS);   // make sure everything is in its final state
  await sleep(500);
}

async function shot(name) {
  const res = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(res.data, "base64"));
}
async function shotFull(name) {
  const res = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(res.data, "base64"));
}

const report = { url, browser: version.Browser, viewports: [], consoleErrors };

for (const vp of VIEWPORTS) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: 1,
    mobile: vp.mobile,
  });

  await goto();
  const audit = await cdp.eval(AUDIT_JS);
  await shot(`${label}-${vp.name}-top`);

  const entry = { ...vp, audit, menu: null };

  if (vp.mobile) {
    // ---- hamburger interaction ----
    await cdp.eval(MENU_OPEN_JS);
    await sleep(600);
    const openState = await cdp.eval(MENU_STATE_JS);
    await shot(`${label}-${vp.name}-menu-open`);

    await cdp.eval(ESCAPE_JS);
    await sleep(600);
    const closedState = await cdp.eval(MENU_STATE_JS);

    // ---- selecting a link closes the panel ----
    await cdp.eval(MENU_OPEN_JS);
    await sleep(400);
    const beforeNav = await cdp.eval(MENU_STATE_JS);
    const linkPicked = await cdp.eval(MENU_LINK_JS);
    await sleep(900);
    const afterNav = await cdp.eval(MENU_STATE_JS);

    entry.menu = {
      open: openState,
      afterEscape: closedState,
      beforeLinkSelect: beforeNav.expanded,
      linkSelected: linkPicked,
      afterLinkSelect: afterNav.expanded,
      scrolledToWork: await cdp.eval("Math.round(window.scrollY)"),
    };
    await cdp.eval("window.scrollTo(0, 0); true");
    await sleep(400);
  }

  await shotFull(`${label}-${vp.name}-full`);
  report.viewports.push(entry);
  console.error(
    `  ${vp.name.padEnd(10)} overflow=${audit.overflow ? "YES" : "no "} ` +
      `offenders=${String(audit.offenderCount).padStart(2)} ` +
      `toggle=${audit.navToggleDisplay} links=${audit.navLinksVisible}`
  );
}

// ---- dense section sweep on the reference mobile width ----
// The five sections below are the home page's; a route such as `/academy` or
// `/articles` has none of them, so the sweep reports what it actually found
// rather than photographing the top of the page five times.
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
});
await goto();
const sweepIds = ["services", "about", "work", "materials", "contact"];
const presentIds = await cdp.eval(
  `(() => ${JSON.stringify(sweepIds)}.filter((id) => document.getElementById(id)))()`
);
if (presentIds.length === 0) {
  console.error("  (no home-page sections on this route — sweep skipped)");
} else if (presentIds.length < sweepIds.length) {
  console.error(`  sweep: ${presentIds.join(", ")} present of ${sweepIds.join(", ")}`);
}
for (const id of presentIds) {
  await cdp.eval(SCROLL_JS(id));
  // Reveal transitions run up to 1.4s (clip-path) — wait them out so the
  // capture shows settled geometry rather than a mid-animation frame.
  await sleep(2400);
  await shot(`${label}-390x844-${id}`);
}
report.sweepIds = presentIds;

writeFileSync(
  join(process.cwd(), "_ref", `${label}-report.json`),
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));
ws.close();
child.kill();

