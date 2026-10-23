/*
 * Ad-hoc layout probe.
 *
 * Loads a page at a given viewport and evaluates a JS expression (read from a
 * file) inside it, printing the JSON result. Useful for measuring real
 * geometry instead of guessing from a screenshot.
 *
 * Usage:
 *   node scripts/probe.mjs <url> <width> <height> <exprFile> [--mobile] [--hash=#about] [--settle=4600]
 */
import { readFileSync } from "node:fs";
import { launch, sleep } from "./lib/cdp.mjs";

const [, , url, widthArg, heightArg, exprFile, ...rest] = process.argv;

if (!url || !exprFile) {
  console.error(
    "usage: node scripts/probe.mjs <url> <width> <height> <exprFile> [--mobile] [--hash=#id] [--settle=ms]"
  );
  process.exit(1);
}

const flag = (name, fallback) => {
  const hit = rest.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const width = Number(widthArg) || 390;
const height = Number(heightArg) || 844;
const mobile = rest.includes("--mobile");
const hash = flag("hash", "");
const settle = Number(flag("settle", 4600));
const expression = readFileSync(exprFile, "utf8");

const driver = await launch({ profileName: "probe-profile" });
try {
  await driver.setViewport(width, height, mobile);
  await driver.navigate(url, { hash, settleMs: settle });
  // Make sure every reveal has settled so geometry reflects the final layout.
  await driver.cdp.eval(
    `(() => {
       document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
       document.querySelector(".hero")?.classList.add("is-loaded");
       return true;
     })()`
  );
  await sleep(700);

  const result = await driver.cdp.eval(expression);
  console.log(
    JSON.stringify(
      {
        viewport: { width, height, mobile, hash },
        result,
        consoleErrors: driver.consoleErrors,
      },
      null,
      2
    )
  );
} finally {
  driver.close();
}
