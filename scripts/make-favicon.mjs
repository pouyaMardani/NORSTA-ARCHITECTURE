/*
 * The Norsta mark — monogram master, and every favicon asset cut from it.
 *
 * ---------------------------------------------------------------------------
 * The design
 * ---------------------------------------------------------------------------
 * A custom uppercase `N` sealed in a perfect circle: the studio's own two
 * colours (`--ink` #1d1c18 and `--bg` #f3e9de, lifted straight out of
 * `app/globals.css`) arranged as a medallion — a deep warm charcoal disc, a
 * solid ivory rim instead of a hairline, and the ivory `N` inside it.
 *
 * The medallion is deliberate. A tab strip is the one place a mark is always
 * tiny and always on someone else's background, so the design carries its own
 * boundary: the ivory rim is ~7% of the disc, which resolves to a full pixel of
 * solid ivory at 16×16 and reads on a white tab, a dark tab and everything
 * between. Nothing here is outlined in a colour that can vanish.
 *
 * The letter is drawn, not typed. It is exactly two vertical stems and one
 * sheared parallelogram:
 *
 *       (157,125)┌────┐ (211,125)
 *                │    └────┐                stems  54 units thick, 262 tall
 *                │         └────┐           diagonal one stem thick *horizontally*
 *                │              └────┐      ⇒ ~88% of the stem thickness measured
 *                └────┐              │        across the stroke, which is how a
 *                     └────┐         │        type designer stops a diagonal from
 *                          └─────────┘        looking heavier than the stems
 *       (157,387)                  (355,387)
 *
 * Every join is an exact shared edge (the diagonal's foot is the right stem's
 * footprint), so the whole glyph fills as one union with no seam and no
 * hairline crack at 16px. Cap height 262 against a 198 width: a shade
 * condensed, which is what keeps an `N` legible when it is eight pixels tall.
 *
 * `N` is the studio's initial in the Latin wordmark only — the page itself is
 * Persian — so the mark stays a letterform, never a word.
 *
 * Why a script: the SVG and the rasters must be the same drawing. The geometry
 * below is the single source of truth, rasterised analytically (supersampled
 * point-in-shape tests — no font, no canvas, no image library), so the SVG
 * favicon Chrome uses, the ICO Safari uses and the 180px iOS icon can never
 * drift apart. Re-run this after touching any constant.
 *
 * `public/favicon.svg` also swaps to the ivory medallion under
 * `prefers-color-scheme: dark` (progressive enhancement — the charcoal disc is
 * already legible on a dark tab). `public/favicon-dark.svg` is that same
 * inverted medallion as a standalone file, for the explicit
 * `media="(prefers-color-scheme: dark)"` icon link in `app/layout.tsx`.
 *
 * The raster assets keep the charcoal medallion at every size, with two
 * deliberate large-size refinements: the 180px iOS tile fills its square with
 * ink and lifts the medallion's field by one step, so the disc reads as a
 * raised plaque rather than a floating shape; and it is drawn at 87%, leaving
 * the iOS squircle mask nothing to crop. Both are documented on `PALETTE` and
 * `APPLE_ICON`.
 *
 * Usage:
 *   node scripts/make-favicon.mjs              # write every asset
 *   node scripts/make-favicon.mjs --verify     # re-read what is on disk and check it
 *   node scripts/make-favicon.mjs --preview    # also write _ref/favicon-preview.html
 *
 * Writes (all under `public/`):
 *   favicon.svg  favicon-dark.svg  favicon.ico
 *   favicon-16x16.png  favicon-32x32.png  favicon-48x48.png  apple-touch-icon.png
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { decodePng, encodePng } from "./lib/png.mjs";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public");
const PREVIEW_PATH = join(ROOT, "_ref", "favicon-preview.html");

/* --------------------------------------------------------------- geometry ---- */
/** Masters are drawn on a 512 grid so every coordinate stays an integer. */
const VIEWBOX = 512;
const CENTER = VIEWBOX / 2;

/**
 * The disc and its rim. The rim is 36 units — 7.3% of the diameter, i.e. a
 * full pixel of ivory once the mark is drawn at 16×16 and 12.7px at 180.
 */
const DISC_RADIUS = 236;
const FIELD_RADIUS = 200;

/**
 * The letter: a cap-height box of 198 × 262, centred on the disc, with stems
 * half the width of the counters so the `N` still reads when it is six pixels
 * wide. The diagonal runs from the left stem's inner top corner to the right
 * stem's inner bottom corner, one stem thick, giving the exact parallelogram
 * in `letterPolygons()` — see the header for why that is the right thickness.
 */
const LETTER = {
  x0: 157,
  x1: 355,
  y0: 125,
  y1: 387,
  stem: 54,
};

/**
 * Brand colours, taken from the site's own tokens in `app/globals.css`:
 * `--bg: #f3e9de` (warm ivory) and `--ink: #1d1c18` (deep warm charcoal).
 *
 * `plate` is the one tone that exists only at large sizes: the field of the
 * 180px iOS medallion, one step up from ink, so the disc separates from the ink
 * square behind it without a gradient or an outline.
 */
const PALETTE = {
  ink: "#1d1c18",
  ivory: "#f3e9de",
  plate: "#2b2721",
};

/** iOS: full-bleed square, medallion inside the squircle mask. */
const APPLE_ICON = { size: 180, scale: 0.87 };

/** The sizes every browser, taskbar and iOS home screen can ask for. */
const PNG_SIZES = [16, 32, 48];
const ICO_SIZES = [16, 32, 48];

/** Medallion painted on a transparent canvas — what every tab gets. */
const MEDALLION = {
  disc: PALETTE.ivory,
  field: PALETTE.ink,
  mark: PALETTE.ivory,
};

/** The same medallion inverted, for dark chrome (and the `-dark` SVG). */
const MEDALLION_INVERTED = {
  disc: PALETTE.ink,
  field: PALETTE.ivory,
  mark: PALETTE.ink,
};

/** Medallion on the ink plate of the iOS tile. */
const PLATE_MEDALLION = {
  disc: PALETTE.ivory,
  field: PALETTE.plate,
  mark: PALETTE.ivory,
};

/* ------------------------------------------------------------ letterform ---- */
/**
 * The three polygons the `N` is made of, in master coordinates, as `[x, y]`
 * pairs. The rasteriser and the SVG path are both generated from this, so they
 * cannot disagree.
 *
 * @returns {{ stemLeft: number[][]; stemRight: number[][]; diagonal: number[][] }}
 */
function letterPolygons() {
  const { x0, x1, y0, y1, stem } = LETTER;
  return {
    stemLeft: [
      [x0, y0],
      [x0 + stem, y0],
      [x0 + stem, y1],
      [x0, y1],
    ],
    stemRight: [
      [x1 - stem, y0],
      [x1, y0],
      [x1, y1],
      [x1 - stem, y1],
    ],
    // Top edge flush with the left stem's inner corner, foot flush with the
    // right stem's, both ends one stem wide ⇒ a perfect parallelogram.
    diagonal: [
      [x0 + stem, y0],
      [x0 + stem * 2, y0],
      [x1, y1],
      [x1 - stem, y1],
    ],
  };
}

/**
 * Point-in-convex-polygon by the sign of the edge cross products. Points
 * exactly on an edge count as inside, which keeps the raster deterministic.
 *
 * @param {number[]} pt `[x, y]`
 * @param {number[][]} poly
 * @returns {boolean}
 */
function insidePolygon(pt, poly) {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const cross = (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]);
    if (cross === 0) continue;
    const s = cross > 0 ? 1 : -1;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

/**
 * True when a master-space point lands on the `N`.
 *
 * @param {number[]} pt `[x, y]`
 */
function insideLetter(pt) {
  const { stemLeft, stemRight, diagonal } = letterPolygons();
  return (
    insidePolygon(pt, stemLeft) ||
    insidePolygon(pt, stemRight) ||
    insidePolygon(pt, diagonal)
  );
}

/** `#rrggbb` → `[r, g, b]`. */
function rgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

/* -------------------------------------------------------------- rasteriser ---- */
/**
 * Draw the mark, supersampled. Every output pixel is classified at S×S
 * sub-positions in master space; the covered samples are averaged, which is a
 * box filter over the shapes and gives proper antialiasing at 16px without a
 * font, a canvas or an image library.
 *
 * @param {object} options
 * @param {number} options.size          output edge in pixels
 * @param {object} options.palette       `{ disc, field, mark }` as `#rrggbb`
 * @param {number} [options.scale]       medallion scale about the centre
 * @param {string|null} [options.background] opaque fill behind the medallion
 * @param {number} [options.supersample] samples per axis
 * @returns {{width:number,height:number,channels:4,data:Buffer}}
 */
function render({
  size,
  palette,
  scale = 1,
  background = null,
  supersample = size <= 48 ? 16 : 8,
}) {
  const disc = rgb(palette.disc);
  const field = rgb(palette.field);
  const mark = rgb(palette.mark);
  const back = background ? rgb(background) : null;

  const data = Buffer.alloc(size * size * 4);
  const unit = VIEWBOX / size; // master units per output pixel
  const inverseScale = 1 / scale;
  const samples = supersample * supersample;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let covered = 0;

      for (let sy = 0; sy < supersample; sy++) {
        for (let sx = 0; sx < supersample; sx++) {
          // Master coordinate of this sub-sample, then pulled back through the
          // medallion scale — the geometry itself is always tested unscaled.
          const mx = (x + (sx + 0.5) / supersample) * unit;
          const my = (y + (sy + 0.5) / supersample) * unit;
          const dx = (mx - CENTER) * inverseScale;
          const dy = (my - CENTER) * inverseScale;
          const radius = Math.sqrt(dx * dx + dy * dy);
          if (radius > DISC_RADIUS) continue;

          const onLetter = insideLetter([CENTER + dx, CENTER + dy]);
          const color = onLetter
            ? mark
            : radius <= FIELD_RADIUS
              ? field
              : disc;
          r += color[0];
          g += color[1];
          b += color[2];
          covered++;
        }
      }

      // The plate behind an opaque icon counts as its own samples, so the
      // average stays a straight box filter over the pixel.
      if (back) {
        r += back[0] * (samples - covered);
        g += back[1] * (samples - covered);
        b += back[2] * (samples - covered);
      }

      const o = (y * size + x) * 4;
      if (covered || back) {
        data[o] = Math.round(r / samples);
        data[o + 1] = Math.round(g / samples);
        data[o + 2] = Math.round(b / samples);
      }
      data[o + 3] = back ? 255 : Math.round((255 * covered) / samples);
    }
  }

  return { width: size, height: size, channels: 4, data };
}

/* ------------------------------------------------------------------ SVG ---- */
/** The `N` as one path: three subpaths, all wound the same way, filled as a union. */
function letterPathData() {
  const toPath = (poly) =>
    poly.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join("") + "Z";
  const { stemLeft, stemRight, diagonal } = letterPolygons();
  return [toPath(stemLeft), toPath(stemRight), toPath(diagonal)].join(" ");
}

/**
 * The square, centre-composed master. Square viewBox, three shapes, flat
 * colours and no metadata — anything else is weight at 16px.
 *
 * `adaptive` adds the `prefers-color-scheme: dark` swap (progressive
 * enhancement: the charcoal medallion is legible on a dark tab anyway).
 *
 * @param {object} palette `{ disc, field, mark }`
 * @param {boolean} adaptive include the dark-scheme swap
 */
function svgDocument(palette, adaptive) {
  const dark = MEDALLION_INVERTED;
  // The fills always ride in the stylesheet — the dark-scheme block is the only
  // conditional part, so the inverted file is a plain static drawing.
  const swap = adaptive
    ? `    @media (prefers-color-scheme:dark){
      .disc{fill:${dark.disc}}
      .field{fill:${dark.field}}
      .mark{fill:${dark.mark}}
    }
`
    : "";
  const style = `  <style>
    .disc{fill:${palette.disc}}
    .field{fill:${palette.field}}
    .mark{fill:${palette.mark}}
${swap}  </style>
`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX}" height="${VIEWBOX}" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" role="img" aria-label="NORSTA">
${style}  <circle class="disc" cx="${CENTER}" cy="${CENTER}" r="${DISC_RADIUS}"/>
  <circle class="field" cx="${CENTER}" cy="${CENTER}" r="${FIELD_RADIUS}"/>
  <path class="mark" fill-rule="nonzero" d="${letterPathData()}"/>
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
  const assets = [
    ["favicon.svg", Buffer.from(svgDocument(MEDALLION, true), "utf8")],
    [
      "favicon-dark.svg",
      Buffer.from(svgDocument(MEDALLION_INVERTED, false), "utf8"),
    ],
  ];

  // The rasters share one render per size: the ICO is packed from the very
  // bytes the standalone PNGs carry, so the two can never differ.
  const rasters = new Map();
  for (const size of PNG_SIZES) {
    rasters.set(size, encodePng(render({ size, palette: MEDALLION })));
    assets.push([`favicon-${size}x${size}.png`, rasters.get(size)]);
  }

  assets.push([
    "favicon.ico",
    encodeIco(ICO_SIZES.map((size) => ({ size, png: rasters.get(size) }))),
  ]);

  assets.push([
    "apple-touch-icon.png",
    encodePng(
      render({
        size: APPLE_ICON.size,
        palette: PLATE_MEDALLION,
        scale: APPLE_ICON.scale,
        background: PALETTE.ink,
      })
    ),
  ]);

  return assets;
}

/** Write every asset and report it. */
function write() {
  mkdirSync(OUT_DIR, { recursive: true });
  const assets = buildAssets();
  for (const [name, bytes] of assets) {
    writeFileSync(join(OUT_DIR, name), bytes);
    console.log(`  ${name.padEnd(20)} ${String(bytes.length).padStart(7)} bytes`);
  }
  console.log(
    `\n  ${assets.length} assets in public/ — ivory rim ${DISC_RADIUS - FIELD_RADIUS} units ` +
      `of a ${DISC_RADIUS * 2}-unit disc, letter ${LETTER.x1 - LETTER.x0}×${
        LETTER.y1 - LETTER.y0
      }, stems ${LETTER.stem}.`
  );
}


/* ----------------------------------------------------------------- verify ---- */
/**
 * Probes for the 16px and 32px rasters, in master coordinates, all landing
 * inside one pixel of the drawing with room to spare. Between them they say the
 * expected things out loud: two stems, an open counter at the foot, a diagonal
 * across the head, a full rim above — i.e. an `N` in a medallion, not a blob.
 */
const PROBES = [
  { at: [184, 240], size: 16, hex: PALETTE.ivory, what: "left stem" },
  { at: [336, 240], size: 16, hex: PALETTE.ivory, what: "right stem" },
  { at: [240, 336], size: 16, hex: PALETTE.ink, what: "counter at the foot" },
  { at: [248, 184], size: 32, hex: PALETTE.ivory, what: "diagonal across the head" },
  { at: [248, 344], size: 32, hex: PALETTE.ink, what: "counter at the foot" },
  { at: [264, 40], size: 32, hex: PALETTE.ivory, what: "rim above the letter" },
];

/** `#rrggbb` plus alpha of the pixel a master-space point falls in. */
function sample(image, point, scale = 1) {
  const unit = VIEWBOX / image.width;
  const x = CENTER + (point[0] - CENTER) * scale;
  const y = CENTER + (point[1] - CENTER) * scale;
  const px = Math.min(image.width - 1, Math.max(0, Math.floor(x / unit)));
  const py = Math.min(image.height - 1, Math.max(0, Math.floor(y / unit)));
  const o = (py * image.width + px) * 4;
  const hex = `#${[0, 1, 2]
    .map((c) => image.data[o + c].toString(16).padStart(2, "0"))
    .join("")}`;
  return { hex, alpha: image.data[o + 3], at: [px, py] };
}

/** Tiny proof sheet: ivory as █, ink as ·, outside the disc as a space. */
function asciiArt(image) {
  const rows = [];
  for (let y = 0; y < image.height; y++) {
    let row = "";
    for (let x = 0; x < image.width; x++) {
      const o = (y * image.width + x) * 4;
      const alpha = image.data[o + 3];
      const light = image.data[o] + image.data[o + 1] + image.data[o + 2];
      row += alpha < 40 ? " " : light > 330 ? "█" : "·";
    }
    rows.push(row);
  }
  return rows.join("\n");
}



/** Read every asset back off disk and check it is the drawing we meant. */
function verify() {
  const failures = [];
  const check = (label, ok, detail = "") => {
    console.log(`  ${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
    if (!ok) failures.push(label);
  };

  const read = (name) => readFileSync(join(OUT_DIR, name));
  const images = new Map();

  for (const [name, bytes] of buildAssets()) {
    try {
      const onDisk = read(name);
      check(
        `${name} matches the current build`,
        onDisk.equals(bytes),
        `${onDisk.length} bytes`
      );
    } catch {
      check(`${name} exists`, false, "missing");
    }
  }

  for (const size of PNG_SIZES) {
    try {
      const image = decodePng(read(`favicon-${size}x${size}.png`));
      images.set(size, image);
      check(
        `favicon-${size}x${size}.png decodes at ${size}×${size}`,
        image.width === size && image.height === size,
        `${image.width}×${image.height}`
      );
    } catch (error) {
      check(`favicon-${size}x${size}.png decodes`, false, String(error.message));
    }
  }

  // Transparency outside the disc: a tab strip must never get a dark square.
  for (const [size, image] of images) {
    const corners = [
      sample(image, [0, 0]),
      sample(image, [VIEWBOX, 0]),
      sample(image, [0, VIEWBOX]),
      sample(image, [VIEWBOX, VIEWBOX]),
    ];
    check(
      `${size}px corners are transparent`,
      corners.every((c) => c.alpha === 0),
      `α ${corners.map((c) => c.alpha).join("/")}`
    );
  }

  for (const probe of PROBES) {
    const image = images.get(probe.size);
    if (!image) continue;
    const got = sample(image, probe.at);
    check(
      `${probe.size}px ${probe.what} is ${probe.hex}`,
      got.hex === probe.hex && got.alpha === 255,
      `${got.hex} α${got.alpha} at ${got.at}`
    );
  }

  /* iOS tile: opaque everywhere, ink plate at the corners, medallion inside. */
  try {
    const apple = decodePng(read("apple-touch-icon.png"));
    check("apple-touch-icon.png is 180×180", apple.width === 180 && apple.height === 180);
    let opaque = true;
    for (let i = 3; i < apple.data.length; i += 4) {
      if (apple.data[i] !== 255) {
        opaque = false;
        break;
      }
    }
    check("apple-touch-icon.png is fully opaque (iOS requires it)", opaque);
    const corner = sample(apple, [0, 0], APPLE_ICON.scale);
    check("apple-touch-icon corner is the ink plate", corner.hex === PALETTE.ink, corner.hex);
    const stem = sample(apple, [184, 256], APPLE_ICON.scale);
    check("apple-touch-icon letter is ivory", stem.hex === PALETTE.ivory, stem.hex);
    const floor = sample(apple, [150, 256], APPLE_ICON.scale);
    check(
      "apple-touch-icon field is the lifted plate tone",
      floor.hex === PALETTE.plate,
      floor.hex
    );
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

  /* SVG: square viewBox, the generated letter, the dark-chrome swap. */
  try {
    const svg = read("favicon.svg").toString("utf8");
    check(
      "favicon.svg has a square viewBox",
      svg.includes(`viewBox="0 0 ${VIEWBOX} ${VIEWBOX}"`)
    );
    check("favicon.svg carries the generated letter", svg.includes(letterPathData()));
    check(
      "favicon.svg is two circles and one path",
      (svg.match(/<circle /g) || []).length === 2 &&
        (svg.match(/<path /g) || []).length === 1
    );
    check(
      "favicon.svg swaps for dark chrome",
      svg.includes("@media (prefers-color-scheme:dark)")
    );
    check("favicon.svg is free of filters and embedded rasters", !/filter|<image|base64/.test(svg));
    const dark = read("favicon-dark.svg").toString("utf8");
    check(
      "favicon-dark.svg is the static inverted medallion",
      dark.includes(MEDALLION_INVERTED.field) && !dark.includes("prefers-color-scheme")
    );
  } catch (error) {
    check("favicon.svg reads", false, String(error.message));
  }

  if (images.has(16)) {
    console.log(
      "\n  16×16, as this script renders it  (█ ivory, · ink, blank transparent):\n"
    );
    console.log(asciiArt(images.get(16)).replace(/^/gm, "    "));
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
 * Inspection sheet. The mark as a browser paints it — the SVG, the PNGs and the
 * ICO — over the four backgrounds a tab strip actually uses, each at true size
 * next to a nearest-neighboured 8× zoom, so the pixel grid survives the review.
 *
 * Written to `_ref/favicon-preview.html` (gitignored, never shipped), with paths
 * relative to `public/`, so it can be reviewed alongside the running site:
 * serve the repo root over HTTP — e.g. `node _ref/favicon-static-server.mjs`, or
 * any static server — and open `/_ref/favicon-preview.html`.
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
  .plate{display:flex;gap:24px;align-items:flex-end;flex-wrap:wrap}
  .plate figure{background:#1d1c18;padding:14px}
  .plate figcaption{color:#f3e9de;opacity:.6}
  .raw{display:flex;gap:28px;align-items:flex-end;padding:24px 28px;background:#dee1e6}
  .note{max-width:64ch;opacity:.7;margin:0 0 24px}
</style>
</head>
<body>
<h1>Norsta mark — inspection sheet</h1>
<p class="note">The SVG at true tab size on the four backgrounds a tab strip uses
(dark scheme emulation swaps it to the ivory medallion), then the 16 and 32px
rasters magnified 8× with nearest-neighbour so the pixel grid shows. Regenerate
with <code>node scripts/make-favicon.mjs --preview</code>.</p>
${sections}
<section>
  <h2>the iOS tile at 180px <span>opaque plate, medallion at 87%</span></h2>
  <div class="plate">
    <figure><img src="${url("apple-touch-icon.png")}" width="180" height="180" alt=""><figcaption>apple-touch-icon.png</figcaption></figure>
    <figure><img src="${url("apple-touch-icon.png")}" width="90" height="90" alt=""><figcaption>90px</figcaption></figure>
    <figure><img src="${url("apple-touch-icon.png")}" width="45" height="45" alt=""><figcaption>45px</figcaption></figure>
  </div>
</section>
<section>
  <h2>the raw files <span>what the browser downloads</span></h2>
  <div class="raw">
    <figure><img src="${url("favicon.ico")}" width="48" height="48" alt=""><figcaption>favicon.ico</figcaption></figure>
    <figure><img src="${url("favicon.svg")}" width="120" height="120" alt=""><figcaption>favicon.svg</figcaption></figure>
    <figure><img src="${url("favicon-dark.svg")}" width="120" height="120" alt=""><figcaption>favicon-dark.svg</figcaption></figure>
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
    console.log("Reading public/ back and checking it against the geometry above:\n");
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
