/*
 * Ad-hoc verification of the Norsta Connection section (`.conn`), part of the
 * home page. For every width the layout steps through it measures the real
 * geometry — does the phone collide with a chip? does the feed's last row run
 * off the screen's bottom edge? does anything open a horizontal scrollbar? —
 * and crops the section itself to `_ref/shots/conn-sec-<w>.png`.
 *
 * Usage: node .tmp-conn-check.mjs [url]
 */
import { launch, sleep } from "./scripts/lib/cdp.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const url = process.argv[2] ?? "http://localhost:3100/";
const WIDTHS = [1610, 1440, 1280, 1024, 990, 900, 768, 681, 680, 640, 430, 390, 320];
const SHOTS = [1440, 1024, 768, 430, 390];
const HEIGHT = 900;

const GEOMETRY = `(() => {
  const rect = (el) => { if (!el) return null; const b = el.getBoundingClientRect();
    return { l: Math.round(b.left), r: Math.round(b.right), t: Math.round(b.top),
             b: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) }; };
  const q = (s) => document.querySelector(s);
  const hit = (a, b) => { if (!a || !b) return null; const A = rect(a), B = rect(b);
    const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l);
    const oy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
    return ox > 0 && oy > 0 ? { ox, oy } : null; };

  const sec = q(".conn"), plate = q(".conn-plate"), frame = q(".conn-plate-frame"),
        caption = q(".conn-plate-caption"), label = q(".conn-plate-label"),
        mats = q(".conn-tile--materials"), surf = q(".conn-tile--surface"),
        phone = q(".conn-phone"), body = q(".conn-phone-body"), screen = q(".conn-phone-screen"),
        grid = q(".conn-screen-grid"), paths = q(".conn-paths");
  if (!sec || !phone || !grid) return { missing: true };

  const cs = (el) => getComputedStyle(el);
  const s = rect(screen), g = rect(grid), tile = rect(grid.children[0]);
  const gap = parseFloat(cs(grid).rowGap) || 0;
  const vw = window.innerWidth;
  const outside = [];
  for (const el of sec.querySelectorAll("*")) {
    const c = cs(el);
    if (c.display === "none" || Number(c.opacity) === 0) continue;
    const b = el.getBoundingClientRect();
    if (b.width === 0 && b.height === 0) continue;
    if (b.right > vw + 1 || b.left < -1) {
      outside.push((typeof el.className === "string" ? el.className.trim() : el.tagName) +
        " [" + Math.round(b.left) + ".." + Math.round(b.right) + " of " + vw + "]");
    }
  }

  return {
    vw,
    docScrollWidth: document.documentElement.scrollWidth,
    pageOverflowsX: document.documentElement.scrollWidth > vw + 1,
    section: rect(sec), plate: rect(plate), frame: rect(frame), phone: rect(phone),
    frameRatio: +(rect(frame).w / rect(frame).h).toFixed(3),
    bodyRatio: +(rect(body).w / rect(body).h).toFixed(3),
    phonePlacement: cs(phone).gridColumnStart + "/" + cs(phone).gridColumnEnd +
      " row " + cs(phone).gridRowStart + " self " + cs(phone).justifySelf,
    platePlacement: cs(plate).gridColumnStart + "/" + cs(plate).gridColumnEnd,
    screenPlacement: cs(screen).position,
    tile: { w: tile.w, h: tile.h, ratio: +(tile.w / tile.h).toFixed(3) },
    rows: {
      gridH: g.h, gap: +gap.toFixed(2), gridOffsetInScreen: g.t - s.t,
      visible: s.b - g.t, lastRowClippedPx: Math.max(0, +(g.h - (s.b - g.t)).toFixed(1)),
      rowsVisible: +(((s.b - g.t + gap) / (tile.h + gap))).toFixed(2),
    },
    collisions: {
      phone_x_materials: hit(phone, mats), phone_x_surface: hit(phone, surf),
      phone_x_plate: hit(phone, plate), phone_x_label: hit(phone, label),
      materials_x_label: hit(mats, label), surface_x_label: hit(surf, label),
      surface_x_head: hit(surf, q(".conn-head")),
    },
    clearances: {
      phoneBottom_to_plateBottom: rect(plate).b - rect(phone).b,
      phoneBottom_to_chipTop: rect(phone).b - rect(mats).t,
      chipBottom_to_phoneTop: rect(phone).t - rect(mats).b,
      plateBottom_to_phoneTop: rect(phone).t - rect(plate).b,
    },
    paths: rect(paths),
    outsideViewport: outside.slice(0, 10),
  };
})()`;

const outDir = join(process.cwd(), "_ref", "shots");
mkdirSync(outDir, { recursive: true });

const driver = await launch({ profileName: "conn-profile" });
const report = [];
try {
  for (const w of WIDTHS) {
    await driver.setViewport(w, HEIGHT, w <= 640);
    await driver.navigate(url, { settleMs: 1400 });
    await driver.cdp.eval(
      `(() => { document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
                document.querySelector(".hero")?.classList.add("is-loaded");
                /* next/image is lazy: scroll the section into view and force the
                   fetches, otherwise the crops show empty plates. */
                document.querySelectorAll(".conn img").forEach((i) => { i.loading = "eager"; });
                const sec = document.querySelector(".conn");
                if (sec) window.scrollTo(0, Math.max(0, sec.getBoundingClientRect().top + window.scrollY - 300));
                return true; })()`,
    );
    await sleep(1400);
    await driver.cdp.eval(
      `Promise.all([...document.querySelectorAll(".conn img, .contact img")]
        .map((i) => (i.decode ? i.decode().catch(() => {}) : null)))`,
    );
    await sleep(300);
    const imgs = await driver.cdp.eval(
      `(() => { const all = [...document.querySelectorAll(".conn img")];
                return { total: all.length,
                         failed: all.filter((i) => !i.complete || i.naturalWidth === 0)
                                    .map((i) => (i.currentSrc || i.src || "(no src)").slice(-90)) }; })()`,
    );
    const geo = await driver.cdp.eval(GEOMETRY);
    geo.images = imgs;
    report.push({ w, geo });
    console.log(w + "  " + JSON.stringify(geo));

    if (SHOTS.includes(w) && geo.section) {
      const doc = await driver.cdp.eval(
        `(() => { const b = document.querySelector(".conn").getBoundingClientRect();
                  return { x: b.left + window.scrollX, y: b.top + window.scrollY,
                           width: b.width, height: b.height }; })()`,
      );
      const res = await driver.cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { ...doc, scale: 1 },
      });
      writeFileSync(join(outDir, `conn-sec-${w}.png`), Buffer.from(res.data, "base64"));

      /* One-off: how does the *rest* of the site render the @handle? (bidi check) */
      if (w === 1440) {
        const addr = await driver.cdp.eval(
          `(() => { const el = document.querySelector("#contact .addr a") || document.querySelector(".addr a");
                    if (!el) return null;
                    const b = el.getBoundingClientRect();
                    return { x: b.left + window.scrollX - 4, y: b.top + window.scrollY - 4,
                             width: b.width + 8, height: b.height + 8 }; })()`,
        );
        if (addr) {
          const a = await driver.cdp.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: true,
            clip: { ...addr, scale: 3 },
          });
          writeFileSync(join(outDir, "addr-handle-1440.png"), Buffer.from(a.data, "base64"));
        }
      }
    }
  }
} finally {
  driver.close();
}

writeFileSync("_ref/conn-check.json", JSON.stringify(report, null, 2));
console.log("\nconsole errors: " + JSON.stringify(driver.consoleErrors));
console.log("wrote _ref/conn-check.json and conn-sec-*.png");
