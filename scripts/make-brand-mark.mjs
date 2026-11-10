/*
 * The Norsta mark — the 3D stone `N`, and every favicon asset plus the site
 * logo cut from it.
 *
 * ---------------------------------------------------------------------------
 * The design: a three-dimensional `N` in dark stone, its bevelled piers and
 * bowed spine catching the light, on a warm ivory stone ground.
 * ---------------------------------------------------------------------------
 * One idea, in the studio's own two colours (`--ink` #1d1c18 and `--bg`
 * #f3e9de, lifted straight out of `app/globals.css`): a full-bleed square of
 * warm stone carrying a deep charcoal `N`, rendered as a solid three-
 * dimensional letter rather than a flat drawing. Nothing else: no rim, no
 * outline, no gradient, no second idea, no gold vein — the mark is the
 * material itself, the microcement and stone the studio works in.
 *
 * Why a tile rather than a bare letter: a tab strip is the one place a mark
 * is always tiny and always on someone else's background. A full-bleed stone
 * tile answers that with polarity instead of with a boundary — on a light tab
 * the tile dissolves into the strip and the charcoal `N` carries the
 * recognition, on a dark tab the tile itself is the shape you see. The
 * rasters therefore stay stone with a charcoal mark, and `public/favicon.svg`
 * inverts to the charcoal tile under `prefers-color-scheme: dark`, which
 * keeps a dark tab quiet.
 *
 * `N` is the studio's initial in the Latin wordmark only — the page itself is
 * Persian — so the mark stays a letterform, never a word.
 *
 * Why a script, and why a raster source: the SVG and the rasters must be the
 * same drawing. The source is one 512px RGBA PNG of the rendered mark, kept
 * as base64 text in `scripts/brand-mark.png.b64` — a text file, so it travels
 * through the same push flow as every other source file, and the build cuts
 * every asset from it on disk instead of shipping whatever binaries happen to
 * be checked in. The PNG encoder/decoder and the box-filter downscaler live in
 * `scripts/lib/png.mjs` (no image library, no native modules), so a deploy
 * always cuts the rasters from the source on disk. Re-run this after touching
 * the source. The build runs it too (`prebuild` in `package.json`).
 *
 * The favicon SVG and the logo SVG embed a small raster of the mark as a
 * base64 data URI — they are text files, so they are the two assets that can
 * be committed and served without a build. The PNG rasters and the ICO are
 * binaries: they are cut here at build time and must not be expected to be
 * current in the checkout.
 *
 * Every variant carries the same drawing: the iOS tile needs no inset, because
 * the tile *is* the square it is masked in, so the squircle crops the tile's
 * own corners and never the letter.
 *
 * Usage:
 *   node scripts/make-brand-mark.mjs              # write every asset
 *   node scripts/make-brand-mark.mjs --verify     # re-read what is on disk and check it
 *   node scripts/make-brand-mark.mjs --preview    # also write _ref/brand-mark-preview.html
 *
 * Writes (all under `public/`):
 *   favicon.svg  favicon-dark.svg  favicon.ico
 *   favicon-16x16.png  favicon-32x32.png  favicon-48x48.png  apple-touch-icon.png
 *   images/logo-n.svg
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { crop, decodePng, encodePng, scale } from "./lib/png.mjs";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public");
const LOGO_DIR = join(OUT_DIR, "images");
const SOURCE_PATH = join(ROOT, "scripts", "brand-mark.png.b64");
const PREVIEW_PATH = join(ROOT, "_ref", "brand-mark-preview.html");

/** The source render, on a square grid so every coordinate stays an integer. */
const SOURCE_SIZE = 512;

/** The sizes every browser, taskbar and iOS home screen can ask for. */
const PNG_SIZES = [16, 32, 48];
const ICO_SIZES = [16, 32, 48];
const APPLE_ICON_SIZE = 180;

/** The raster embedded in the two favicon SVGs; a tab strip never shows more. */
const FAVICON_RASTER_SIZE = 64;
/** The raster embedded in the logo SVG; the header shows it at ~32px. */
const LOGO_RASTER_SIZE = 128;

/* --------------------------------------------------------------- source ---- */
/**
 * The mark, as RGBA pixels. The source file is base64 text (comments and
 * line breaks stripped) so it can live in the repository as a text file; it
 * decodes to the 512px RGBA PNG the whole script cuts from.
 */
function loadSource() {
  const text = readFileSync(SOURCE_PATH, "utf8");
  const base64 = text
    .split("\n")
    .filter((line) => !line.startsWith("#"))
    .join("")
    .trim();
  const bytes = Buffer.from(base64, "base64");
  const decoded = decodePng(bytes);
  if (decoded.width !== SOURCE_SIZE || decoded.height !== SOURCE_SIZE) {
    throw new Error(
      `brand-mark source is ${decoded.width}×${decoded.height}, expected ${SOURCE_SIZE}×${SOURCE_SIZE}`
    );
  }
  // Normalise to RGBA: `scale` reads a 4-byte stride.
  return crop(decoded, 0, 0, decoded.width, decoded.height);
}

/** A new RGBA image with every colour channel inverted; alpha untouched. */
function invert(image) {
  const data = Buffer.from(image.data);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return { width: image.width, height: image.height, channels: 4, data };
}

/* ------------------------------------------------------------------ SVG ---- */
/**
 * The square, full-bleed tile as an SVG that embeds a small raster of the
 * mark. The raster is downscaled from the source, so the file stays small
 * enough to be a favicon and a logo; the browser scales it to the tile.
 */
function rasterSvg(rasterPng) {
  const base64 = rasterPng.toString("base64");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SOURCE_SIZE}" height="${SOURCE_SIZE}" viewBox="0 0 ${SOURCE_SIZE} ${SOURCE_SIZE}" role="img" aria-label="NORSTA">
  <image href="data:image/png;base64,${base64}" width="${SOURCE_SIZE}" height="${SOURCE_SIZE}"/>
</svg>
`;
}

/* ------------------------------------------------------------------ ICO ---- */
/**
 * Pack PNG images into an `.ico` container.
 *
 * Modern browsers, Windows and macOS all read PNG-compressed icon entries, so
 * the container is the header, one 16-byte directory entry per image and the
 * PNG payloads — no BMP encoding, and the same drawing as every other asset.
 *
 * @param {Array<{ size: number; png: Buffer }>} entries
 * @returns {Buffer}
 */
function encodeIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = 6 + directory.length;

  entries.forEach((entry, i) => {
    const o = i * 16;
    directory[o] = entry.size >= 256 ? 0 : entry.size;
    directory[o + 1] = entry.size >= 256 ? 0 : entry.size;
    directory[o + 2] = 0; // palette size
    directory[o + 3] = 0; // reserved
    directory.writeUInt16LE(1, o + 4); // colour planes
    directory.writeUInt16LE(32, o + 6); // bits per pixel
    directory.writeUInt32LE(entry.png.length, o + 8);
    directory.writeUInt32LE(offset, o + 12);
    offset += entry.png.length;
  });

  return Buffer.concat([header, directory, ...entries.map((e) => e.png)]);
}

/* --------------------------------------------------------------- assemble ---- */
/** Every artefact this script owns, as `[filename, bytes]`. */
function buildAssets() {
  const source = loadSource();

  // The favicon SVGs embed a small raster; the dark one is the same raster
  // inverted, so a dark tab gets the charcoal tile with the ivory mark.
  const faviconRaster = encodePng(scale(source, FAVICON_RASTER_SIZE));
  const darkRaster = encodePng(scale(invert(source), FAVICON_RASTER_SIZE));

  const assets = [
    ["favicon.svg", Buffer.from(rasterSvg(faviconRaster), "utf8")],
    ["favicon-dark.svg", Buffer.from(rasterSvg(darkRaster), "utf8")],
  ];

  // The rasters share one render per size: the ICO is packed from the very
  // bytes the standalone PNGs carry, so the two can never differ.
  const rasters = new Map();
  for (const size of PNG_SIZES) {
    rasters.set(size, encodePng(scale(source, size)));
    assets.push([`favicon-${size}x${size}.png`, rasters.get(size)]);
  }

  assets.push([
    "favicon.ico",
    encodeIco(ICO_SIZES.map((size) => ({ size, png: rasters.get(size) }))),
  ]);

  assets.push([
    "apple-touch-icon.png",
    encodePng(scale(source, APPLE_ICON_SIZE)),
  ]);

  // The logo: the same mark, embedded at a size that stays crisp wherever
  // the header or the footer shows it.
  const logoRaster = encodePng(scale(source, LOGO_RASTER_SIZE));
  assets.push(["images/logo-n.svg", Buffer.from(rasterSvg(logoRaster), "utf8")]);

  return assets;
}

/** Write every asset and report it. */
function write() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(LOGO_DIR, { recursive: true });
  const assets = buildAssets();
  for (const [name, bytes] of assets) {
    writeFileSync(join(OUT_DIR, name), bytes);
    console.log(`  ${name.padEnd(20)} ${String(bytes.length).padStart(7)} bytes`);
  }
  console.log(
    `\n  ${assets.length} assets in public/ — cut from the ${SOURCE_SIZE}×${SOURCE_SIZE} ` +
      `stone mark in scripts/brand-mark.png.b64.`
  );
}

/* ----------------------------------------------------------------- verify ---- */
/** Read every asset back off disk and check it is the drawing we meant. */
function verify() {
  const failures = [];
  const check = (label, ok, detail = "") => {
    console.log(`  ${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
    if (!ok) failures.push(label);
  };

  const read = (name) => readFileSync(join(OUT_DIR, name));

  for (const [name, bytes] of buildAssets()) {
    try {
      const onDisk = read(name);
      check(`${name} matches the current build`, onDisk.equals(bytes), `${onDisk.length} bytes`);
    } catch {
      check(`${name} exists`, false, "missing");
    }
  }

  /* The PNG rasters decode at their own size and are fully opaque: a tab
     strip must be given the whole tile, not a hole in it. */
  for (const size of PNG_SIZES) {
    try {
      const image = decodePng(read(`favicon-${size}x${size}.png`));
      check(
        `favicon-${size}x${size}.png decodes at ${size}×${size}`,
        image.width === size && image.height === size,
        `${image.width}×${image.height}`
      );
      let opaque = true;
      for (let i = 3; i < image.data.length; i += image.channels) {
        if (image.data[i] !== 255) {
          opaque = false;
          break;
        }
      }
      check(`favicon-${size}x${size}.png has no transparent pixel`, opaque);
    } catch (error) {
      check(`favicon-${size}x${size}.png decodes`, false, String(error.message));
    }
  }

  /* The 180px iOS tile: the same drawing at the same full bleed, opaque. */
  try {
    const apple = decodePng(read("apple-touch-icon.png"));
    check(
      `apple-touch-icon.png is ${APPLE_ICON_SIZE}×${APPLE_ICON_SIZE}`,
      apple.width === APPLE_ICON_SIZE && apple.height === APPLE_ICON_SIZE
    );
    let opaque = true;
    for (let i = 3; i < apple.data.length; i += apple.channels) {
      if (apple.data[i] !== 255) {
        opaque = false;
        break;
      }
    }
    check("apple-touch-icon.png is fully opaque (iOS requires it)", opaque);
  } catch (error) {
    check("apple-touch-icon.png decodes", false, String(error.message));
  }

  /* .ico: three PNG entries, byte-identical to the standalone rasters. */
  try {
    const ico = read("favicon.ico");
    const count = ico.readUInt16LE(4);
    check("favicon.ico declares three images", count === ICO_SIZES.length, `${count}`);
    ICO_SIZES.forEach((size, i) => {
      const o = 6 + i * 16;
      const bytes = ico.readUInt32LE(o + 8);
      const offset = ico.readUInt32LE(o + 12);
      const payload = ico.subarray(offset, offset + bytes);
      check(
        `favicon.ico[${i}] is the ${size}px PNG`,
        ico[o] === size &&
          payload[0] === 0x89 &&
          payload[1] === 0x50 &&
          payload.equals(read(`favicon-${size}x${size}.png`))
      );
    });
  } catch (error) {
    check("favicon.ico parses", false, String(error.message));
  }

  /* The SVGs embed the mark as a raster, square, and nothing else. */
  for (const name of ["favicon.svg", "favicon-dark.svg", "images/logo-n.svg"]) {
    try {
      const svg = read(name).toString("utf8");
      check(
        `${name} is a square tile embedding the mark`,
        svg.includes(`viewBox="0 0 ${SOURCE_SIZE} ${SOURCE_SIZE}"`) &&
          svg.includes("data:image/png;base64,") &&
          (svg.match(/<image /g) || []).length === 1
      );
    } catch (error) {
      check(`${name} reads`, false, String(error.message));
    }
  }

  /* The dark favicon is the inverted raster, not a copy of the light one. */
  try {
    const light = read("favicon.svg").toString("utf8");
    const dark = read("favicon-dark.svg").toString("utf8");
    check(
      "favicon-dark.svg embeds a different raster from favicon.svg",
      light !== dark
    );
  } catch {
    check("favicon-dark.svg differs from favicon.svg", false, "unreadable");
  }

  console.log(
    failures.length
      ? `\n  ${failures.length} check(s) failed: ${failures.join(", ")}`
      : "\n  all checks passed — every asset on disk is the current drawing."
  );
  if (failures.length) process.exitCode = 1;
}

/* --------------------------------------------------------------- preview ---- */
/**
 * Inspection sheet. The mark as a browser paints it — the SVG favicon, the
 * PNGs and the ICO, and the logo — over the backgrounds a tab strip and a
 * header actually use, each at true size next to a nearest-neighboured 8×
 * zoom, so the pixel grid survives the review.
 *
 * Written to `_ref/brand-mark-preview.html` (gitignored, never shipped), with
 * paths relative to `public/`, so it can be reviewed alongside the running
 * site: serve the repo root over HTTP and open `/_ref/brand-mark-preview.html`.
 */
function preview() {
  const url = (name) => `../public/${name}`;
  const sizes = [16, 32, 48];
  const backdrops = [
    ["#dee1e6", "light chrome", "a light browser tab"],
    ["#f3e9de", "the studio canvas", "--bg"],
    ["#202124", "dark chrome", "a dark browser tab"],
    ["#0b0b0c", "near black", "pitch-dark chrome"],
  ];

  const tile = (name, size) =>
    `<figure><img src="${url(name)}" width="${size}" height="${size}" alt="">` +
    `<figcaption>${size}px</figcaption></figure>`;

  const zoom = (name, size) =>
    `<figure class="zoom"><img src="${url(name)}" width="${size * 8}" height="${
      size * 8
    }" alt="" style="image-rendering:pixelated"><figcaption>${size}px × 8</figcaption></figure>`;

  const sections = backdrops
    .map(
      ([hex, label, note]) => `<section>
  <h2>on ${label} <span>${hex} — ${note}</span></h2>
  <div class="row" style="background:${hex}">
    ${sizes.map((s) => tile("favicon.svg", s)).join("\n    ")}
    ${zoom("favicon-16x16.png", 16)}
    ${zoom("favicon-32x32.png", 32)}
  </div>
</section>`
    )
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Norsta mark — inspection sheet</title>
<style>
  body{margin:0;padding:40px;background:#f3e9de;color:#1d1c18;
       font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
  h1{font-size:18px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px}
  h2{font-size:13px;font-weight:500;margin:0 0 12px;letter-spacing:.04em}
  h2 span{opacity:.55;font-weight:400}
  section{margin:0 0 28px}
  .row{display:flex;align-items:flex-end;gap:28px;padding:24px 28px;flex-wrap:wrap}
  figure{margin:0;text-align:center}
  figcaption{font-size:11px;letter-spacing:.06em;opacity:.7;margin-top:8px}
  .zoom{margin-left:auto}
  .raw{display:flex;gap:28px;align-items:flex-end;padding:24px 28px;background:#dee1e6}
  .note{max-width:64ch;opacity:.7;margin:0 0 24px}
</style>
</head>
<body>
<h1>Norsta mark — inspection sheet</h1>
<p class="note">A three-dimensional <code>N</code> in dark stone on a full-bleed warm
ivory tile. The SVG at true tab size on the four backgrounds a tab strip uses,
then the 16 and 32px rasters magnified 8× with nearest-neighbour so the pixel
grid shows. Regenerate with
<code>node scripts/make-brand-mark.mjs --preview</code>.</p>
${sections}
<section>
  <h2>the iOS tile at 180px <span>the same drawing, full bleed</span></h2>
  <div class="raw">
    <figure><img src="${url("apple-touch-icon.png")}" width="180" height="180" alt=""><figcaption>apple-touch-icon.png</figcaption></figure>
    <figure><img src="${url("apple-touch-icon.png")}" width="90" height="90" alt=""><figcaption>90px</figcaption></figure>
    <figure><img src="${url("apple-touch-icon.png")}" width="45" height="45" alt=""><figcaption>45px</figcaption></figure>
  </div>
</section>
<section>
  <h2>the logo <span>the same mark, as the header and footer show it</span></h2>
  <div class="raw">
    <figure><img src="${url("images/logo-n.svg")}" width="128" height="128" alt=""><figcaption>logo-n.svg at 128px</figcaption></figure>
    <figure><img src="${url("images/logo-n.svg")}" width="32" height="32" alt=""><figcaption>at 32px — header size</figcaption></figure>
    <figure><img src="${url("favicon-dark.svg")}" width="120" height="120" alt=""><figcaption>favicon-dark.svg</figcaption></figure>
  </div>
</section>
<section>
  <h2>the raw files <span>what the browser downloads</span></h2>
  <div class="raw">
    <figure><img src="${url("favicon.ico")}" width="48" height="48" alt=""><figcaption>favicon.ico</figcaption></figure>
    <figure><img src="${url("favicon.svg")}" width="120" height="120" alt=""><figcaption>favicon.svg</figcaption></figure>
  </div>
</section>
</body>
</html>
`;

  mkdirSync(join(ROOT, "_ref"), { recursive: true });
  writeFileSync(PREVIEW_PATH, html);
  console.log(`\n  inspection sheet → ${PREVIEW_PATH}`);
}

/* ------------------------------------------------------------------- run ---- */
function main() {
  const flags = new Set(process.argv.slice(2));

  if (flags.has("--verify")) {
    console.log("Reading public/ back and checking it against the source above:\n");
    verify();
  } else {
    console.log("Cutting the Norsta mark:\n");
    write();
  }

  if (flags.has("--preview")) preview();
  else if (!flags.has("--verify")) {
    console.log("\n  --verify re-reads what was just written; --preview writes the sheet.");
  }
}

main();
