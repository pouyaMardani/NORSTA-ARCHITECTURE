/*
 * Material gallery - temporary sample plates.
 *
 * The studio has not published close-ups of its microcement samples yet, so the
 * gallery ships with one tinted plate per record: a calm, warm surface in the
 * sample's own colour, carrying a hard-to-miss "TEMPORARY PLATE" marking and a
 * fine registration cross, so nobody can mistake one of these for a photograph
 * of the real material.
 *
 *   public/images/samples/placeholder-<slug>.png
 *
 * The plate itself is drawn by `lib/plate.mjs`, which the product catalogue's
 * plates also use — this script only decides *which* plate to draw and *what
 * colour* it is. The record list is read straight out of
 * `content/samples/records.ts` (the sample DTO is the single source of truth),
 * so a new record produces a new plate without anything being duplicated here.
 * Slug and `colorHex` are lifted per record; a record without a `colorHex` falls
 * back to the studio's neutral sand tone and says so on the console.
 *
 * The plates are deliberately plain: they hold the frame, the 4/5 crop and the
 * layout exactly as a real photograph will, and nothing about them is baked into
 * the page. Replacing one with a real photograph is a single edit in
 * `records.ts` — see the note at the top of that file.
 *
 * Usage:
 *   node scripts/make-sample-plates.mjs                  # write every plate
 *   node scripts/make-sample-plates.mjs --slug=smoke-grey # write one plate
 *   node scripts/make-sample-plates.mjs --size=1200x1500  # override the plate size
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderPlate } from "./lib/plate.mjs";

const ROOT = process.cwd();
const RECORDS_PATH = join(ROOT, "content", "samples", "records.ts");
const OUT_DIR = join(ROOT, "public", "images", "samples");

/** 4/5 — the proportion every frame is cut for. */
const DEFAULT_SIZE = { width: 1000, height: 1250 };

/** The studio's neutral sand tone, used when a record names no colour. */
const FALLBACK_TINT = "#cfc0a8";

/* ---------------------------------------------------------------- records ---- */
/**
 * Lift `{ slug, colorHex }` out of every record in `records.ts`.
 *
 * The file is hand-written TypeScript in one fixed shape, so a small, explicit
 * scan is enough — and it means the phone numbers, colours and plates can never
 * drift apart. Anything unparseable throws instead of quietly writing a wrong
 * plate.
 */
function readRecordTints() {
  const source = readFileSync(RECORDS_PATH, "utf8");
  const marks = [...source.matchAll(/^ {4}id:\s*(\d+),\s*$/gm)];
  if (!marks.length) throw new Error(`no records found in ${RECORDS_PATH}`);

  return marks.map((mark, i) => {
    const block = source.slice(mark.index, marks[i + 1]?.index ?? source.length);
    const slug = block.match(/^\s{4}slug:\s*"([^"]+)"/m)?.[1];
    if (!slug) throw new Error(`record ${mark[1]} in records.ts has no slug`);

    const color = block.match(/^\s{4}colorHex:\s*"(#[0-9a-fA-F]{6})"/m)?.[1];
    if (!color) {
      console.warn(`  ! ${slug}: no colorHex, using the neutral sand tone`);
    }
    return { slug, tint: color ?? FALLBACK_TINT };
  });
}

/* ------------------------------------------------------------------- run ---- */
function parseArgs(argv) {
  const options = { slug: null, size: { ...DEFAULT_SIZE } };
  for (const arg of argv) {
    if (arg.startsWith("--slug=")) {
      options.slug = arg.slice("--slug=".length);
    } else if (arg.startsWith("--size=")) {
      const [w, h] = arg.slice("--size=".length).split("x").map(Number);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w < 200 || h < 200) {
        throw new Error(`bad --size value "${arg}" (expected e.g. --size=1200x1500)`);
      }
      options.size = { width: Math.round(w), height: Math.round(h) };
    } else {
      throw new Error(`unknown argument "${arg}"`);
    }
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const allRecords = readRecordTints();
  const records = options.slug
    ? allRecords.filter((record) => record.slug === options.slug)
    : allRecords;

  if (!records.length) {
    throw new Error(
      `no record with slug "${options.slug}" in content/samples/records.ts ` +
        `(have: ${allRecords.map((record) => record.slug).join(", ")})`
    );
  }

  mkdirSync(OUT_DIR, { recursive: true });
  console.log(
    `\n  sample plates  ${options.size.width}x${options.size.height}  ->  public/images/samples/\n`
  );

  let bytesTotal = 0;
  for (const record of records) {
    const bytes = renderPlate({
      seed: record.slug,
      tint: record.tint,
      size: options.size,
      title: record.slug,
    });
    writeFileSync(join(OUT_DIR, `placeholder-${record.slug}.png`), bytes);
    bytesTotal += bytes.length;
    const size = `${Math.round(bytes.length / 1024)} KB`;
    console.log(`  ${record.slug.padEnd(24)} ${record.tint}  ${size.padStart(7)}`);
  }

  console.log(
    `\n  ${records.length} plate(s), ${(bytesTotal / 1024 / 1024).toFixed(2)} MB total\n`
  );
}

main();
