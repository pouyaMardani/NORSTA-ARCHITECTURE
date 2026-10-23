/**
 * Localisation verification: scans the app source for user-facing English text.
 *
 * Reports any JSX text node / translatable attribute (aria-label, alt, title,
 * placeholder) that contains three or more consecutive Latin letters, excluding
 * an explicit allow-list of intentional brand/technical strings.
 *
 * Usage: node scripts/verify-fa.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const TARGETS = ["app", "components"];

/** Intentional Latin that must survive localisation. */
const ALLOW = [
  /^NORSTA$/,
  /^NORSTA HOME$/,
  /^© NORSTA HOME$/,
  /^studio@monolithatelier\.com$/,
  /^https?:\/\//,
  /^mailto:/,
  /^\/images\//,
  /^\d+$/,
  /^[\s&·/→—–,.:%+()\-]*$/,
];

const LATIN = /[A-Za-z]{3,}/;

/** Named entities are markup, not prose — drop them before testing. */
const decodeEntities = (s) =>
  s
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = TARGETS.flatMap((t) => walk(join(ROOT, t))).filter((f) =>
  /\.(tsx|ts)$/.test(f)
);

const findings = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).split(sep).join("/");

  // JSX text nodes: > ... <  with no braces inside.
  for (const m of src.matchAll(/>([^<>{}\n]{3,})</g)) {
    const text = decodeEntities(m[1]);
    if (!text || !LATIN.test(text)) continue;
    if (ALLOW.some((re) => re.test(text))) continue;
    findings.push({ file: rel, kind: "text", text });
  }

  // Translatable attributes.
  for (const m of src.matchAll(/(aria-label|alt|title|placeholder)="([^"]*)"/g)) {
    const [, attr, value] = m;
    const text = decodeEntities(value);
    if (!LATIN.test(text)) continue;
    if (ALLOW.some((re) => re.test(text))) continue;
    findings.push({ file: rel, kind: attr, text });
  }
}

const lines = [];
lines.push(`scanned ${files.length} source files under ${TARGETS.join(", ")}`);
if (findings.length === 0) {
  lines.push("RESULT: clean — no untranslated user-facing English found");
} else {
  lines.push(`RESULT: ${findings.length} candidate(s) need review`);
  for (const f of findings) lines.push(`  ${f.file} [${f.kind}] ${f.text}`);
}

const out = lines.join("\n");
console.log(out);
process.exitCode = findings.length === 0 ? 0 : 1;
