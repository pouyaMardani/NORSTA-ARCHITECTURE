/*
 * Minimal, dependency-free Chrome DevTools Protocol driver.
 *
 * Shared bootstrap for the browser-based scripts in this repo:
 *   - scripts/responsive-audit.mjs (layout/overflow/a11y sweep)
 *   - scripts/probe.mjs           (ad-hoc layout measurement)
 *
 * Uses Node's built-in `fetch` and global `WebSocket` (Node >= 22), so no
 * npm dependencies are required.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const BROWSERS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Finds an installed Chromium-based browser, or null. */
export function findBrowser() {
  return BROWSERS.find((p) => existsSync(p)) ?? null;
}

export class CDP {
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

/**
 * Launches a headless browser, connects to it and returns a small driver API.
 * Always call `close()` when finished.
 */
export async function launch({ port = 9333, profileName = "cdp-profile" } = {}) {
  const browserPath = findBrowser();
  if (!browserPath) throw new Error("No Edge/Chrome found — cannot drive a browser.");

  const profile = join(process.cwd(), "_ref", profileName);
  rmSync(profile, { recursive: true, force: true });

  const child = spawn(
    browserPath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let version = null;
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) {
        version = await r.json();
        break;
      }
    } catch {
      /* endpoint not up yet */
    }
    await sleep(500);
  }
  if (!version) {
    child.kill();
    throw new Error("DevTools endpoint never came up.");
  }

  const targets = await (
    await fetch(`http://127.0.0.1:${port}/json/list`)
  ).json();
  const target = targets.find((t) => t.type === "page");
  if (!target) {
    child.kill();
    throw new Error("No page target available.");
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });

  const cdp = new CDP(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  // One persistent load listener that resolves whichever navigation is pending.
  let loadResolve = null;
  cdp.on("Page.loadEventFired", () => {
    const r = loadResolve;
    loadResolve = null;
    if (r) r();
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

  let navCount = 0;

  return {
    cdp,
    version,
    consoleErrors,

    /** Emulates a viewport; pass mobile=true for touch/mobile layouts. */
    async setViewport(width, height, mobile = false, deviceScaleFactor = 1) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        mobile,
        deviceScaleFactor,
      });
    },

    /**
     * Navigates and waits for `load`, then for `settleMs`. A unique query
     * parameter is appended so repeat navigations always trigger a real page
     * load (and therefore a real entrance animation).
     */
    async navigate(url, { hash = "", settleMs = 0 } = {}) {
      const p = new Promise((res) => {
        loadResolve = res;
      });
      navCount += 1;
      const sep = url.includes("?") ? "&" : "?";
      await cdp.send("Page.navigate", { url: `${url}${sep}probe=${navCount}${hash}` });
      await p;
      if (settleMs) await sleep(settleMs);
    },

    async screenshot(file, { fullPage = false } = {}) {
      const res = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: fullPage,
      });
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, Buffer.from(res.data, "base64"));
    },

    close() {
      try {
        ws.close();
      } catch {
        /* already closed */
      }
      child.kill();
    },
  };
}

