/**
 * One-shot: splice the two `conn` fragments into `app/globals.css`, replacing
 * the old Instagram-showcase blocks. Bottom-up, so the earlier line numbers
 * stay valid between the two splices. The boundary assertions are the point:
 * if a rule moved, this refuses rather than cutting the wrong lines.
 */
import { readFileSync, writeFileSync } from "node:fs";

const lines = (p) => readFileSync(p, "utf8").replace(/\s+$/, "").split("\n");

const css = readFileSync("app/globals.css", "utf8").split("\n");
const desktop = lines(".tmp-conn-desktop.css");
const responsive = lines(".tmp-conn-responsive.css");

const at = (n) => (css[n - 1] ?? "").trim();

const checks = {
  "line 652 starts the old desktop block": at(652).includes("INSTAGRAM SHOWCASE"),
  "line 709 ends it": at(709).startsWith(".ig-cta:focus-visible"),
  "line 1030 starts the old ≤960 block": at(1030).includes("960px"),
  "line 1063 closes it": at(1063) === "}",
  "line 712 opens the responsive section": at(712).includes("RESPONSIVE"),
};
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
if (failed.length) throw new Error(`boundaries moved:\n  ${failed.join("\n  ")}`);

// 1030..1063 -> the conn responsive blocks
css.splice(1030 - 1, 1063 - 1030 + 1, ...responsive);
// 652..709 -> the conn desktop block
css.splice(652 - 1, 709 - 652 + 1, ...desktop);

writeFileSync("app/globals.css", css.join("\n"));

console.log(`desktop  652-709  (58 lines) -> ${desktop.length} lines`);
console.log(`responsive 1030-1063 (34 lines) -> ${responsive.length} lines`);
console.log(`globals.css -> ${css.length} lines`);

const written = readFileSync("app/globals.css", "utf8");
const left = (written.match(/\.ig[-{]/g) ?? []).length;
console.log(`remaining .ig selectors in globals.css: ${left}`);
console.log(
  `brace balance: ${(written.match(/{/g) ?? []).length} { vs ${(written.match(/}/g) ?? []).length} }`,
);
