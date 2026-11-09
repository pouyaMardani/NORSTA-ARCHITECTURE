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
 * `make-favicon.mjs`, and the deploy regenerates the plates the same way it
 * regenerates the favicon rasters. The metadata that points at them lives in
 * the section layouts (`app/page.tsx`, `app/articles/layout.tsx`,
 * `app/academy/layout.tsx`, `app/microcement/layout.tsx` and
 * `app/microcement/works/page.tsx`).
 *
 * The four plates, and why each source was chosen:
 *
 *   home.jpg        — the villa (`hero-villa.png`), the site's own hero still.
 *   articles.jpg    — the warm bathroom (`about-courtyard.png`), the magazine's
 *                      first featured cover.
 *   academy.jpg     — the finished kitchen (`after.png`), the result the
 *                      academy teaches toward.
 *   microcement.jpg — the dark living room (`surface-floor-03.jpg`), the most
 *                      striking single microcement surface in the repo.
 *
 * The catalogue (`/products`) deliberately has no plate: its photographs are
 * marked temporary plates, and publishing one as the social card would
 * advertise a placeholder as a product photograph (see
 * `app/products/layout.tsx`).
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
  {
    name: "microcement.jpg",
    src: "public/images/www/surface-floor-03.jpg",
    alt: "نشیمن با کف تیره، دیوار چوبی و پنجره‌های بزرگ",
  },
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** One plate, at the best quality that still fits the 200 KB budget. */
async function makePlate(sharp, plate) {
  const srcPath = join(ROOT, plate.src);
  if (!(await exists(srcPath))) {
    throw new Error(`source photograph missing: ${plate.src}`);
  }

  let quality = START_QUALITY;
  let buffer;
  for (;;) {
    buffer = await sharp(srcPath)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buffer.length <= MAX_BYTES || quality <= MIN_QUALITY) break;
    quality -= 8;
  }

  await writeFile(join(OUT_DIR, plate.name), buffer);
  return { name: plate.name, bytes: buffer.length, quality };
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
    const over = result.bytes > MAX_BYTES ? "  ⚠ OVER BUDGET" : "";
    console.log(
      `  ${result.name}: ${kb} KB (quality ${result.quality})${over}`,
    );
  }
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

  if (failures.length) {
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ all ${PLATES.length} share plates are 1200×630 JPEGs at 200 KB or less`);
  }
}

const flags = new Set(process.argv.slice(2));
if (flags.has("--verify")) {
  await verify();
} else {
  await generate();
}
