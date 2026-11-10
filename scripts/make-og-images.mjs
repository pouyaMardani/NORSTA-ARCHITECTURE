/**
 * Generate the site's share plates (OpenGraph images) from the studio's own
 * photographs.
 *
 *   node scripts/make-og-images.mjs            # generate all four plates
 *   node scripts/make-og-images.mjs --verify   # re-read what is on disk and check it
 *
 * Each plate is a 1200×630 JPEG at 200 KB or less — the size a social crawler
 * expects, cut from a photograph the site already ships, so no new binary ever
 * has to be committed: `package.json` runs this from `prebuild`, next to
 * `make-brand-mark.mjs`, and the deploy regenerates the plates the same way it
 * regenerates the favicon rasters. The metadata that points at them lives in
 * the section layouts (`app/page.tsx`, `app/articles/layout.tsx` and
 * `app/academy/layout.tsx`).
 *
 * The three plates, and why each source was chosen:
 *
 *   home.jpg        — the villa (`hero-villa.png`), the site's own hero still.
 *   articles.jpg    — the warm bathroom (`about-courtyard.png`), the magazine's
 *                      first featured cover.
 *   academy.jpg     — the finished kitchen (`after.png`), the result the
 *                      academy teaches toward.
 *
 * The catalogue (`/products`) deliberately has no plate: its photographs are
 * marked temporary plates, and publishing one as the social card would
 * advertise a placeholder as a product photograph (see
 * `app/products/layout.tsx`).
 *
 * Besides the plates, the script also cuts the fixed band's background:
 *
 *   band.jpg        — the same villa (`hero-villa.png`), cut wide (2000×1125)
 *                      for the full-bleed fixed-background band
 *                      (`components/ParallaxBand.tsx`). A share plate is
 *                      1200×630; a full-viewport background needs the width,
 *                      so the band gets its own size and a larger budget.
 *
 * And the hero video's poster — the still the hero shows while the video
 * loads, or if it never plays:
 *
 *   hero-poster.jpg — the same villa (`hero-villa.png`), cut to the video's
 *                      own 1920×1080, for the `<video poster>` in
 *                      (`components/Hero.tsx`). It is the same villa the
 *                      video slowly pans across, so the moment the video
 *                      starts the still hands over to the motion without a
 *                      visible jump — never a second, unrelated picture.
 *
 * Resilience: `sharp` is the image library Next.js itself ships for its
 * optimiser, so it is present in `node_modules` on a normal install — but if
 * it is ever absent (a deploy that skips optional dependencies), the script
 * warns and exits successfully rather than failing the build. A missing plate
 * is a degraded share card; a failed build is a down site.
 */

import { access, mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "images", "og");

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_BYTES = 200 * 1024;
const START_QUALITY = 82;
const MIN_QUALITY = 55;

const PLATES = [
  {
    name: "home.jpg",
    src: "public/images/hero-villa.png",
    alt: "ویلایی با سطوح ساده‌ی میکروسمنت و پنجره‌های بزرگ",
  },
  {
    name: "articles.jpg",
    src: "public/images/about-courtyard.png",
    alt: "فضای داخلی سنگی با نور طبیعی و دیوارهای مادهای",
  },
  {
    name: "academy.jpg",
    src: "public/images/after.png",
    alt: "آشپزخانه‌ی روشن با جزیره‌ی مرکزی و سطوح یکدست میکروسمنت",
  },
];

/** The fixed band's background: same villa, cut wide for a full viewport. */
const BAND = {
  name: "band.jpg",
  src: "public/images/hero-villa.png",
  alt: "ویلایی مدرن در غروب با استخر؛ کوهستان در پس‌زمینه",
  width: 2000,
  height: 1125,
  maxBytes: 350 * 1024,
};

/** The hero video's poster: same villa, cut to the video's own 1920×1080. */
const POSTER = {
  name: "hero-poster.jpg",
  src: "public/images/hero-villa.png",
  alt: "ویلایی مدرن در غروب با استخر؛ کوهستان در پس‌زمینه",
  width: 1920,
  height: 1080,
  maxBytes: 350 * 1024,
};

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** One plate, at the best quality that still fits its budget. A plate may
    carry its own `width`, `height` and `maxBytes` (the band does); the share
    plates default to the 1200×630 / 200 KB standard. */
async function makePlate(sharp, plate) {
  const srcPath = join(ROOT, plate.src);
  if (!(await exists(srcPath))) {
    throw new Error(`source photograph missing: ${plate.src}`);
  }

  const width = plate.width ?? WIDTH;
  const height = plate.height ?? HEIGHT;
  const maxBytes = plate.maxBytes ?? MAX_BYTES;
  let quality = START_QUALITY;
  let buffer;
  for (;;) {
    buffer = await sharp(srcPath)
      .resize(width, height, { fit: "cover", position: "centre" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buffer.length <= maxBytes || quality <= MIN_QUALITY) break;
    quality -= 8;
  }

  await writeFile(join(OUT_DIR, plate.name), buffer);
  return { name: plate.name, bytes: buffer.length, quality, maxBytes };
}

async function generate() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn(
      "  make-og-images: `sharp` is not installed — skipping the share plates.\n" +
        "  The build continues; the OpenGraph images will 404 until sharp is present.",
    );
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  for (const plate of PLATES) {
    const result = await makePlate(sharp, plate);
    const kb = (result.bytes / 1024).toFixed(1);
    const over = result.bytes > result.maxBytes ? "  ⚠ OVER BUDGET" : "";
    console.log(
      `  ${result.name}: ${kb} KB (quality ${result.quality})${over}`,
    );
  }

  const band = await makePlate(sharp, BAND);
  const bandKb = (band.bytes / 1024).toFixed(1);
  const bandOver = band.bytes > band.maxBytes ? "  ⚠ OVER BUDGET" : "";
  console.log(`  ${band.name}: ${bandKb} KB (quality ${band.quality})${bandOver}`);

  const poster = await makePlate(sharp, POSTER);
  const posterKb = (poster.bytes / 1024).toFixed(1);
  const posterOver = poster.bytes > poster.maxBytes ? "  ⚠ OVER BUDGET" : "";
  console.log(`  ${poster.name}: ${posterKb} KB (quality ${poster.quality})${posterOver}`);
}

async function verify() {
  const sharp = (await import("sharp")).default;
  const failures = [];

  for (const plate of PLATES) {
    const path = join(OUT_DIR, plate.name);
    if (!(await exists(path))) {
      failures.push(`${plate.name}: missing — run without --verify first`);
      continue;
    }
    const { size } = await stat(path);
    if (size > MAX_BYTES) {
      failures.push(`${plate.name}: ${(size / 1024).toFixed(1)} KB, over the 200 KB budget`);
    }
    const meta = await sharp(path).metadata();
    if (meta.width !== WIDTH || meta.height !== HEIGHT) {
      failures.push(`${plate.name}: ${meta.width}×${meta.height}, expected ${WIDTH}×${HEIGHT}`);
    }
    if (meta.format !== "jpeg") {
      failures.push(`${plate.name}: ${meta.format}, expected jpeg`);
    }
  }

  const bandPath = join(OUT_DIR, BAND.name);
  if (!(await exists(bandPath))) {
    failures.push(`${BAND.name}: missing — run without --verify first`);
  } else {
    const { size } = await stat(bandPath);
    if (size > BAND.maxBytes) {
      failures.push(`${BAND.name}: ${(size / 1024).toFixed(1)} KB, over the ${(BAND.maxBytes / 1024).toFixed(0)} KB budget`);
    }
    const meta = await sharp(bandPath).metadata();
    if (meta.width !== BAND.width || meta.height !== BAND.height) {
      failures.push(`${BAND.name}: ${meta.width}×${meta.height}, expected ${BAND.width}×${BAND.height}`);
    }
    if (meta.format !== "jpeg") {
      failures.push(`${BAND.name}: ${meta.format}, expected jpeg`);
    }
  }

  const posterPath = join(OUT_DIR, POSTER.name);
  if (!(await exists(posterPath))) {
    failures.push(`${POSTER.name}: missing — run without --verify first`);
  } else {
    const { size } = await stat(posterPath);
    if (size > POSTER.maxBytes) {
      failures.push(`${POSTER.name}: ${(size / 1024).toFixed(1)} KB, over the ${(POSTER.maxBytes / 1024).toFixed(0)} KB budget`);
    }
    const meta = await sharp(posterPath).metadata();
    if (meta.width !== POSTER.width || meta.height !== POSTER.height) {
      failures.push(`${POSTER.name}: ${meta.width}×${meta.height}, expected ${POSTER.width}×${POSTER.height}`);
    }
    if (meta.format !== "jpeg") {
      failures.push(`${POSTER.name}: ${meta.format}, expected jpeg`);
    }
  }

  if (failures.length) {
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ all ${PLATES.length} share plates are 1200×630 JPEGs at 200 KB or less, and the band and hero poster are ${BAND.width}×${BAND.height} / ${POSTER.width}×${POSTER.height}`);
  }
}

const flags = new Set(process.argv.slice(2));
if (flags.has("--verify")) {
  await verify();
} else {
  await generate();
}
