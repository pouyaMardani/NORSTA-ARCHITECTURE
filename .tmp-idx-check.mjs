/* One-off: zoom into both channel rules to confirm the ۰۱/۰۲ index sits on the
 * hairline without colliding with the kicker, and print the real rects.
 * Usage: node .tmp-idx-check.mjs [url]
 */
import { launch, sleep } from "./scripts/lib/cdp.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const url = process.argv[2] ?? "http://localhost:3100/";
const outDir = join(process.cwd(), "_ref", "shots");
mkdirSync(outDir, { recursive: true });

const driver = await launch({ profileName: "idx-profile" });
try {
  await driver.setViewport(1440, 900, false);
  await driver.navigate(url, { settleMs: 1200 });
  await driver.cdp.eval(
    `(() => { document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
              document.querySelectorAll(".conn img").forEach((i) => { i.loading = "eager"; });
              const s = document.querySelector(".conn");
              if (s) window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 300);
              return true; })()`,
  );
  await sleep(1500);

  const probe = await driver.cdp.eval(
    `(() => {
      const out = {};
      for (const which of ["instagram", "whatsapp"]) {
        const art = document.querySelector(".conn-path--" + which);
        const idx = art.querySelector(".conn-path-index");
        const kick = art.querySelector(".conn-path-kicker");
        const r = (el) => { const b = el.getBoundingClientRect();
          return { l: Math.round(b.left), r: Math.round(b.right), t: Math.round(b.top),
                   b: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) }; };
        const I = r(idx), K = r(kick);
        const ox = Math.min(I.r, K.r) - Math.max(I.l, K.l);
        const oy = Math.min(I.b, K.b) - Math.max(I.t, K.t);
        out[which] = { index: I, kicker: K, indexOverKicker: ox > 0 && oy > 0 ? { ox, oy } : null,
                       ruleY: Math.round(art.getBoundingClientRect().top),
                       text: idx.textContent.trim() };
      }
      return out;
    })()`,
  );
  console.log(JSON.stringify(probe, null, 2));

  for (const which of ["instagram", "whatsapp"]) {
    const p = await driver.cdp.eval(
      `(() => { const b = document.querySelector(".conn-path--${which}").getBoundingClientRect();
                const w = Math.min(460, b.width);
                return { x: Math.max(b.left, b.right - w), y: b.top + window.scrollY - 26,
                         width: w, height: 100 }; })()`,
    );
    const res = await driver.cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { ...p, scale: 2 },
    });
    writeFileSync(join(outDir, `conn-idx-${which}.png`), Buffer.from(res.data, "base64"));
  }
  console.log("console errors: " + JSON.stringify(driver.consoleErrors));
} finally {
  driver.close();
}