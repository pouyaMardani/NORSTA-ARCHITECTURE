/*
 * Product catalogue - temporary plates.
 *
 * The studio has not photographed its stock yet, so the catalogue ships with one
 * tinted plate per shelf and one per product: a calm, warm surface in the item's
 * own tone, carrying a hard-to-miss "TEMPORARY PLATE" marking and a fine
 * registration cross, so nobody can mistake one of these for a photograph of the
 * real product.
 *
 *   public/images/products/category-<id>.png
 *   public/images/products/placeholder-<slug>.png
 *
 * The plate itself is drawn by `lib/plate.mjs` — the same renderer the material
 * gallery's sample plates use, so a stand-in looks like a stand-in everywhere on
 * the site. This script only decides *which* plate to draw and *what colour* it
 * is.
 *
 * Both the item list and the plate sizes are read straight out of the content
 * module (`content/products/records.ts` for the products, `config.ts` for the
 * four shelves and for `PRODUCT_PLATE_SIZES`), which stays the single source of
 * truth: a new record produces a new plate, and a changed `PRODUCT_PLATE_SIZES`
 * regenerates every plate at the size the app declares — so the intrinsic
 * `width`/`height` in a record can never drift from the file on disk.
 *
 * Usage:
 *   node scripts/make-product-plates.mjs                 # write every plate
 *   node scripts/make-product-plates.mjs --slug=stainless-trowel
 *   node scripts/make-product-plates.mjs --category=tools
 *   node scripts/make-product-plates.mjs --size=1600x1200  # override, all plates
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderPlate } from "./lib/plate.mjs";

const ROOT = process.cwd();
const RECORDS_PATH = join(ROOT, "content", "products", "records.ts");
const CONFIG_PATH = join(ROOT, "content", "products", "config.ts");
const OUT_DIR = join(ROOT, "public", "images", "products");

/** Used only when `config.ts` cannot be parsed — and then loudly. */
const FALLBACK_SIZES = {
  category: { width: 1600, height: 1200 },
  product: { width: 1200, height: 900 },
};

/* ------------------------------------------------------------ the sources ---- */

/**
 * Read `PRODUCT_PLATE_SIZES` out of the content module.
 *
 * The app reserves an image's box from the record's own `width`/`height`, so the
 * plate on disk and the record that points at it must agree. Reading the size
 * here — rather than repeating it — is what keeps them from drifting apart.
 */
function readPlateSizes() {
  const source = readFileSync(CONFIG_PATH, "utf8");
  const block = source.match(/PRODUCT_PLATE_SIZES\s*=\s*\{([\s\S]*?)\}\s*as const/)?.[1];
  if (!block) {
    console.warn("  ! PRODUCT_PLATE_SIZES not found in config.ts, using the built-in sizes");
    return { ...FALLBACK_SIZES };
  }

  const size = (key) => {
    const match = block.match(
      new RegExp(`${key}\\s*:\\s*\\{\\s*width:\\s*(\\d+)\\s*,\\s*height:\\s*(\\d+)\\s*\\}`)
    );
    if (!match) return null;
    return { width: Number(match[1]), height: Number(match[2]) };
  };

  const category = size("category");
  const product = size("product");
  if (!category || !product) {
    console.warn("  ! PRODUCT_PLATE_SIZES is incomplete, using the built-in sizes");
    return { ...FALLBACK_SIZES };
  }
  return { category, product };
}

/**
 * The four shelves: `{ id, tint }`, in the order `PRODUCT_CATEGORIES` declares.
 *
 * The file is hand-written TypeScript in one fixed shape, so a small explicit
 * scan is enough. A category whose tint cannot be read is skipped with a warning
 * rather than silently drawn in the wrong colour.
 */
function readCategoryTints() {
  const source = readFileSync(CONFIG_PATH, "utf8");
  const marks = [...source.matchAll(/^ {4}id:\s*"([a-z-]+)",\s*$/gm)];
  if (!marks.length) throw new Error(`no categories found in ${CONFIG_PATH}`);

  return marks
    .map((mark, i) => {
      const id = mark[1];
      const block = source.slice(mark.index, marks[i + 1]?.index ?? source.length);
      const tint = block.match(/^ {4}tintHex:\s*"(#[0-9a-fA-F]{6})",?\s*$/m)?.[1];
      if (!tint) {
        console.warn(`  ! category ${id}: no tintHex, skipping`);
        return null;
      }
      return { id, tint };
    })
    .filter(Boolean);
}

/**
 * The products: `{ slug, tint }`, in the order `records.ts` declares them.
 *
 * Anchored on the record's numeric `id`, exactly as the material gallery's plate
 * generator is, so `tintHex` may sit anywhere inside the record.
 */
function readProductTints() {
  const source = readFileSync(RECORDS_PATH, "utf8");
  const marks = [...source.matchAll(/^ {4}id:\s*(\d+),\s*$/gm)];
  if (!marks.length) throw new Error(`no records found in ${RECORDS_PATH}`);

  return marks.map((mark, i) => {
    const block = source.slice(mark.index, marks[i + 1]?.index ?? source.length);
    const slug = block.match(/^ {4}slug:\s*"([^"]+)"/m)?.[1];
    if (!slug) throw new Error(`record ${mark[1]} in records.ts has no slug`);

    const tint = block.match(/^ {4}tintHex:\s*"(#[0-9a-fA-F]{6})",?\s*$/m)?.[1];
    if (!tint) throw new Error(`record ${slug} in records.ts has no tintHex`);
    return { slug, tint };
  });
}

/* ------------------------------------------------------------------- run ---- */
function parseArgs(argv) {
  const options = { slug: null, category: null, size: null };
  for (const arg of argv) {
    if (arg.startsWith("--slug=")) {
      options.slug = arg.slice("--slug=".length);
    } else if (arg.startsWith("--category=")) {
      options.category = arg.slice("--category=".length);
    } else if (arg.startsWith("--size=")) {
      const [w, h] = arg.slice("--size=".length).split("x").map(Number);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w < 200 || h < 200) {
        throw new Error(`bad --size value "${arg}" (expected e.g. --size=1600x1200)`);
      }
      options.size = { width: Math.round(w), height: Math.round(h) };
    } else {
      throw new Error(`unknown argument "${arg}"`);
    }
  }
  return options;
}

function writePlate(fileName, { seed, tint, size }) {
  const bytes = renderPlate({ seed, tint, size, title: seed });
  writeFileSync(join(OUT_DIR, fileName), bytes);
  const kb = `${Math.round(bytes.length / 1024)} KB`;
  console.log(`  ${fileName.padEnd(38)} ${tint}  ${kb.padStart(7)}`);
  return bytes.length;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const sizes = readPlateSizes();

  const categories = readCategoryTints();
  const products = readProductTints();

  // With `--size`, every plate is drawn at that size: an explicit override is a
  // deliberate act, and honouring it for only one group would be surprising.
  const categorySize = options.size ?? sizes.category;
  const productSize = options.size ?? sizes.product;

  const wantedCategories = options.category
    ? categories.filter((category) => category.id === options.category)
    : options.slug
      ? []
      : categories;
  const wantedProducts =
    options.slug || options.category
      ? options.slug
        ? products.filter((product) => product.slug === options.slug)
        : []
      : products;

  if (!wantedCategories.length && !wantedProducts.length) {
    throw new Error(
      `nothing selected — categories: ${categories.map((c) => c.id).join(", ")}; ` +
        `products: ${products.map((p) => p.slug).join(", ")}`
    );
  }

  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`\n  product plates  ->  public/images/products/\n`);

  let bytes = 0;
  let count = 0;

  if (wantedCategories.length) {
    console.log(`  category plates  ${categorySize.width}x${categorySize.height}`);
    for (const category of wantedCategories) {
      bytes += writePlate(`category-${category.id}.png`, {
        seed: `category-${category.id}`,
        tint: category.tint,
        size: categorySize,
      });
      count += 1;
    }
  }

  if (wantedProducts.length) {
    if (wantedCategories.length) console.log("");
    console.log(`  product plates   ${productSize.width}x${productSize.height}`);
    for (const product of wantedProducts) {
      bytes += writePlate(`placeholder-${product.slug}.png`, {
        seed: product.slug,
        tint: product.tint,
        size: productSize,
      });
      count += 1;
    }
  }

  console.log(`\n  ${count} plate(s), ${(bytes / 1024 / 1024).toFixed(2)} MB total\n`);
}

main();
