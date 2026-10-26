/*
 * The Norsta mark — the monogram master, and every favicon asset cut from it.
 *
 * ---------------------------------------------------------------------------
 * The design: a carved `N` on a warm-stone plaque
 * ---------------------------------------------------------------------------
 * One idea, in the studio's own two colours (`--ink` #1d1c18 and `--bg`
 * #f3e9de, lifted straight out of `app/globals.css`): a full-bleed square of
 * warm stone carrying a deep charcoal `N`. The two vertical piers are the
 * architectural planes — flat, equal, absolutely square — and the spine is one
 * curved wall, a 26-unit bow across a 407-unit span, the way a plastered reveal
 * curves rather than breaks. Nothing else: no rim, no outline, no gradient, no
 * second idea.
 *
 * Why a plaque rather than the disc-with-a-rim this replaced: a tab strip is
 * the one place a mark is always tiny and always on someone else's background.
 * A full-bleed stone tile answers that with polarity instead of with a
 * boundary — on a light tab the tile dissolves into the strip and the charcoal
 * `N` carries the recognition, on a dark tab the tile itself is the shape you
 * see. The rasters therefore stay stone with a charcoal mark, and
 * `public/favicon.svg` inverts to the charcoal plaque under
 * `prefers-color-scheme: dark`, which keeps a dark tab quiet.
 *
 * The letter is drawn, not typed. It is exactly three shapes: two 72 × 380
 * piers and one band between two concentric arcs.
 *
 *      (110,66)┌────┐(254,66)              piers    72 wide, 380 tall — 14% of
 *             │    ╰───╮                     the tile, i.e. 2.25px at 16×16,
 *             │        ╰───╮                 where the previous mark's stems
 *             │            ╰───╮             measured 1.7px
 *             │                ╰───╮        cap bar  144 wide: the pier plus the
 *             │                    ╰──╮       band's head, which is flush with
 *             └──╮                    ╰──╮    the cap line, as a stencil `N` is
 *                ╰──╮                   ╰──╮ spine    67 units across the stroke
 *                   ╰─────────────────────┘  — 93% of a pier's 72, which is how
 *      (110,446)                    (402,446) a type designer stops a diagonal
 *                                                from looking heavier than a stem
 *
 *     (a sketch, not to scale — every coordinate below is the real one)
 *
 * `N` is the studio's initial in the Latin wordmark only — the page itself is
 * Persian — so the mark stays a letterform, never a word.
 *
 * Why a script: the SVG and the rasters must be the same drawing. The geometry
 * below is the single source of truth, rasterised analytically (supersampled
 * point-in-shape tests — no font, no canvas, no image library), so the SVG
 * favicon Chrome uses, the ICO Safari uses and the 180px iOS tile can never
 * drift apart. Re-run this after touching any constant.
 *
 * Every variant carries the same drawing: the iOS tile needs no inset, because
 * the plaque *is* the square it is masked in, so the squircle crops the tile's
 * own corners and never the letter.
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

/** The plate is the whole tile: full bleed, square corners, no radius. */
const PLATE = { x: 0, y: 0, w: VIEWBOX, h: VIEWBOX };

/**
 * The letter: a cap-height box of 292 × 380, centred on the plate, with 72-unit
 * piers. Against the previous mark (54-unit stems inside a 512 disc) that is a
 * third more ink in a smaller silhouette — which is the whole difference at
 * 16px, where the stems now measure 2.25 pixels instead of 1.7.
 */
const LETTER = {
  x0: 110,
  x1: 402,
  y0: 66,
  y1: 446,
  stem: 72,
};

/**
 * The spine's curvature: a 26-unit bow toward the upper right, sampled as a
 * 20-segment polyline. The polyline leaves the true arc by 0.09 units — three
 * hundredths of a pixel at 16px — so one point list can serve as both the SVG
 * path and the rasteriser's shape without either drifting from the other.
 */
const SPINE = { bow: 26, segments: 20 };

/**
 * Brand colours, taken from the site's own tokens in `app/globals.css`:
 * `--bg: #f3e9de` (warm stone) and `--ink: #1d1c18` (deep warm charcoal).
 */
const PALETTE = {
  ink: "#1d1c18",
  ivory: "#f3e9de",
};

/**
 * The plaque in light chrome: the warm-stone plane with the charcoal monogram.
 * Every raster asset carries this one, and so does `/favicon.svg` by default.
 */
const PLAQUE = {
  plate: PALETTE.ivory,
  mark: PALETTE.ink,
};

/** The same drawing inverted, for dark chrome (and the `-dark` SVG). */
const PLAQUE_INVERTED = {
  plate: PALETTE.ink,
  mark: PALETTE.ivory,
};

/** The sizes every browser, taskbar and iOS home screen can ask for. */
const PNG_SIZES = [16, 32, 48];
const ICO_SIZES = [16, 32, 48];
const APPLE_ICON_SIZE = 180;

/* ------------------------------------------------------------ letterform ---- */
/** Decimal places kept on a sampled arc point; 0.01 units is 3e-5 of a pixel. */
function round2(value) {
  return Math.round(value * 100) / 100;
}

/**
 * The band's two long edges, as `[from, to]` chord pairs in master coordinates.
 * Both run from the cap line to the baseline with the same direction, so they
 * stay parallel and the band measures a constant 67 units across the stroke.
 *
 *   right — the cap bar's outer corner down to the right pier's outer foot
 *   left  — the left pier's inner cap corner down to the band's own foot, which
 *           is the right pier's footprint exactly, so the union is seamless
 *
 * @returns {{ right: number[][]; left: number[][] }}
 */
function spineChords() {
  const { x0, x1, y0, y1, stem } = LETTER;
  return {
    right: [
      [x0 + 2 * stem, y0],
      [x1, y1],
    ],
    left: [
      [x0 + stem, y0],
      [x1 - stem, y1],
    ],
  };
}

/**
 * The bow direction: the chord's normal, always to the right and up, so both
 * long edges warp to the same side and the band keeps its width.
 *
 * @returns {number[]} `[x, y]`, a unit vector
 */
function spineNormal() {
  const dx = LETTER.x1 - LETTER.x0 - 2 * LETTER.stem;
  const dy = LETTER.y1 - LETTER.y0;
  const length = Math.hypot(dx, dy);
  return [dy / length, -dx / length];
}

/**
 * A circular arc from `from` to `to`, bulging `bow` units along `spineNormal()`.
 *
 * The arc is sampled in two angular sweeps that meet at the apex — the point
 * furthest along the normal — and every angle is unwrapped against the apex
 * first, so a chord that straddles the angle origin (−180°/+180°) still walks
 * the minor arc instead of lapsing into the major one. Both ends are exact,
 * which is what keeps the joints with the piers flush.
 *
 * @param {number[]} from
 * @param {number[]} to
 * @param {{ bow: number; segments: number }} curve
 * @returns {number[][]} `segments + 1` points, `from` and `to` included
 */
function arcPoints(from, to, curve) {
  const { bow, segments } = curve;
  const half = Math.hypot(to[0] - from[0], to[1] - from[1]) / 2;
  const radius = (bow * bow + half * half) / (2 * bow);
  const [nx, ny] = spineNormal();
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const centre = [mid[0] - nx * (radius - bow), mid[1] - ny * (radius - bow)];
  const apex = [mid[0] + nx * bow, mid[1] + ny * bow];

  const angleOf = (pt) => Math.atan2(pt[1] - centre[1], pt[0] - centre[0]);
  const unwrap = (angle, reference) => {
    let delta = angle - reference;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    return reference + delta;
  };
  const atApex = angleOf(apex);
  const atFrom = unwrap(angleOf(from), atApex);
  const atTo = unwrap(angleOf(to), atApex);

  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle =
      t <= 0.5 ? atFrom + (atApex - atFrom) * (t * 2) : atApex + (atTo - atApex) * (t * 2 - 1);
    points.push([
      round2(centre[0] + radius * Math.cos(angle)),
      round2(centre[1] + radius * Math.sin(angle)),
    ]);
  }
  points[0] = from;
  points[segments] = to;
  return points;
}

/** Twice the signed area of a polygon; opposite signs mean opposite winds. */
function signedArea(poly) {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i];
    const [bx, by] = poly[(i + 1) % poly.length];
    sum += ax * by - bx * ay;
  }
  return sum;
}

/**
 * The three polygons the `N` is made of, in master coordinates, as `[x, y]`
 * pairs. The rasteriser and the SVG path are both generated from this, so they
 * cannot disagree.
 *
 * They are re-wound to a common direction because the SVG fills them with
 * `fill-rule="nonzero"`: three subpaths turning the same way add up to their
 * union, which is exactly what the rasteriser's `some(...)` says.
 *
 * @returns {number[][][]}
 */
function letterPolygons() {
  const { x0, x1, y0, y1, stem } = LETTER;
  const { right, left } = spineChords();
  const shapes = [
    // The left pier: a plane, square on all four sides.
    [
      [x0, y0],
      [x0 + stem, y0],
      [x0 + stem, y1],
      [x0, y1],
    ],
    // The right pier, its mirror.
    [
      [x1 - stem, y0],
      [x1, y0],
      [x1, y1],
      [x1 - stem, y1],
    ],
    // The curved wall: head flush with the cap line, foot flush with the right
    // pier's footprint, both long edges bowed to the same side.
    [
      left[0],
      right[0],
      ...arcPoints(right[0], right[1], SPINE).slice(1),
      left[1],
      ...arcPoints(left[1], left[0], SPINE).slice(1, -1),
    ],
  ];
  return shapes.map((poly) => (signedArea(poly) < 0 ? [...poly].reverse() : poly));
}

/**
 * Point-in-polygon by the crossing number. The curved wall is concave, so the
 * convex wedge test the previous mark could rely on is not enough here. A point
 * exactly on an edge may fall either way, but it falls the same way for the
 * raster and for the vector path, because both are built from this one list.
 *
 * @param {number[]} pt `[x, y]`
 * @param {number[][]} poly
 * @returns {boolean}
 */
function insidePolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * True when a master-space point lands on the `N`.
 *
 * @param {number[]} pt `[x, y]`
 * @param {number[][][]} [shapes] pre-built polygons, for the raster's hot loop
 * @returns {boolean}
 */
function insideLetter(pt, shapes = letterPolygons()) {
  return shapes.some((poly) => insidePolygon(pt, poly));
}

/** `#rrggbb` → `[r, g, b]`. */
function rgb(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/* -------------------------------------------------------------- rasteriser ---- */
/**
 * Draw the plaque, supersampled. Every output pixel is classified at S×S
 * sub-positions in master space; the covered samples are averaged, which is a
 * box filter over the two flat tones and gives proper antialiasing at 16px
 * without a font, a canvas or an image library. The plate covers the tile, so
 * every pixel is opaque and there is no alpha to reason about.
 *
 * @param {object} options
 * @param {number} options.size          output edge in pixels
 * @param {{ plate: string; mark: string }} options.palette
 * @param {number} [options.supersample] samples per axis
 * @returns {{width:number,height:number,channels:4,data:Buffer}}
 */
function render({ size, palette, supersample = size <= 48 ? 16 : 8 }) {
  const plate = rgb(palette.plate);
  const mark = rgb(palette.mark);
  const shapes = letterPolygons();
  const { x0, x1, y0, y1 } = LETTER;

  const data = Buffer.alloc(size * size * 4);
  const unit = VIEWBOX / size; // master units per output pixel
  const samples = supersample * supersample;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let sy = 0; sy < supersample; sy++) {
        for (let sx = 0; sx < supersample; sx++) {
          const mx = (x + (sx + 0.5) / supersample) * unit;
          const my = (y + (sy + 0.5) / supersample) * unit;
          // The box test first: 59% of the tile is bare plate, and at 180px
          // that ratio is the difference between instant and interminable.
          const onMark =
            mx >= x0 && mx <= x1 && my >= y0 && my <= y1 && insideLetter([mx, my], shapes);
          const color = onMark ? mark : plate;
          r += color[0];
          g += color[1];
          b += color[2];
        }
      }

      const o = (y * size + x) * 4;
      data[o] = Math.round(r / samples);
      data[o + 1] = Math.round(g / samples);
      data[o + 2] = Math.round(b / samples);
      data[o + 3] = 255;
    }
  }

  return { width: size, height: size, channels: 4, data };
}

/* ------------------------------------------------------------------ SVG ---- */
/** The `N` as one path: three subpaths, all wound the same way, filled as a union. */
function letterPathData() {
  const toPath = (poly) =>
    poly.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join("") + "Z";
  return letterPolygons().map(toPath).join(" ");
}

/**
 * `#rrggbb` for a palette entry, as an `<style>` rule — the two flat fills, and
 * the plate rect and the mark path that carry them.
 *
 * @param {{ plate: string; mark: string }} palette
 */
function styleBlock(palette, swap) {
  return `  <style>
    .plate{fill:${palette.plate}}
    .mark{fill:${palette.mark}}
${swap}  </style>
`;
}

/**
 * The square, full-bleed tile: a rect and one path, flat colours and no
 * metadata — anything else is weight at 16px.
 *
 * `adaptive` adds the `prefers-color-scheme: dark` swap (progressive
 * enhancement: the stone plaque is legible on a dark tab anyway, but the
 * inverted one sits quietly in it).
 *
 * @param {{ plate: string; mark: string }} palette
 * @param {boolean} adaptive include the dark-scheme swap
 */
function svgDocument(palette, adaptive) {
  const dark = PLAQUE_INVERTED;
  const swap = adaptive
    ? `    @media (prefers-color-scheme:dark){
      .plate{fill:${dark.plate}}
      .mark{fill:${dark.mark}}
    }
`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX}" height="${VIEWBOX}" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" role="img" aria-label="NORSTA">
${styleBlock(palette, swap)}  <rect class="plate" x="${PLATE.x}" y="${PLATE.y}" width="${PLATE.w}" height="${PLATE.h}"/>
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
    ["favicon.svg", Buffer.from(svgDocument(PLAQUE, true), "utf8")],
    ["favicon-dark.svg", Buffer.from(svgDocument(PLAQUE_INVERTED, false), "utf8")],
  ];

  // The rasters share one render per size: the ICO is packed from the very
  // bytes the standalone PNGs carry, so the two can never differ.
  const rasters = new Map();
  for (const size of PNG_SIZES) {
    rasters.set(size, encodePng(render({ size, palette: PLAQUE })));
    assets.push([`favicon-${size}x${size}.png`, rasters.get(size)]);
  }

  assets.push([
    "favicon.ico",
    encodeIco(ICO_SIZES.map((size) => ({ size, png: rasters.get(size) }))),
  ]);

  assets.push([
    "apple-touch-icon.png",
    encodePng(render({ size: APPLE_ICON_SIZE, palette: PLAQUE })),
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
  const chords = spineChords();
  const chord = [
    chords.right[1][0] - chords.right[0][0],
    chords.right[1][1] - chords.right[0][1],
  ];
  const spine = (LETTER.stem * Math.abs(chord[1])) / Math.hypot(chord[0], chord[1]);
  console.log(
    `\n  ${assets.length} assets in public/ — plate ${PLATE.w}×${PLATE.h} square, ` +
      `letter ${LETTER.x1 - LETTER.x0}×${LETTER.y1 - LETTER.y0}, piers ${LETTER.stem},\n` +
      `  spine ${spine.toFixed(1)} across the stroke with a ${SPINE.bow}-unit bow ` +
      `(${SPINE.segments} segments).`
  );
}

/* ----------------------------------------------------------------- verify ---- */
/**
 * The thinnest ink (and the thinnest stone slit) in the mark, in master units
 * and in 16px pixels. A tab strip is the smallest place the drawing ever lands,
 * so the number that matters is how wide the narrowest feature is once it gets
 * there: under two pixels, a feature stops being a shape and becomes a smudge.
 *
 * @returns {{ units: number; pixels: number }}
 */
function smallestFeature() {
  const { x0, x1, stem } = LETTER;
  const chords = spineChords();
  const chord = [
    chords.right[1][0] - chords.right[0][0],
    chords.right[1][1] - chords.right[0][1],
  ];
  const units = Math.min(
    stem, // a pier
    x1 - x0 - 3 * stem, // the stone the cap bar leaves open beside itself
    (stem * Math.abs(chord[1])) / Math.hypot(chord[0], chord[1]) // the spine
  );
  return { units, pixels: units / (VIEWBOX / 16) };
}

/**
 * Probes for the 16px and 32px rasters, in master coordinates, each landing
 * inside one output pixel that is a single flat colour. Between them they say
 * the expected things out loud: stone at the tile's corner, two piers, the
 * bowed spine across the middle, the foot bar reaching the baseline, and the
 * stone the letter leaves open beside the cap bar and under the spine — i.e. an
 * `N` carved into a plaque, not a blob.
 *
 * The 16px probes are limited to the features that survive at 32 units to a
 * pixel: the spine is only 2.25px wide there and no whole pixel of it is one
 * colour, so its turn comes at 32px, where it is 4.5px across.
 */
const PROBES = [
  { size: 16, at: [16, 16], hex: PALETTE.ivory, what: "plate at the tile's corner" },
  { size: 16, at: [144, 176], hex: PALETTE.ink, what: "left pier" },
  { size: 16, at: [368, 400], hex: PALETTE.ink, what: "the letter's right foot" },
  {
    size: 16,
    at: [208, 424],
    hex: PALETTE.ivory,
    what: "the stone the spine leaves open at the foot",
  },
  { size: 32, at: [296, 88], hex: PALETTE.ivory, what: "the stone beside the cap bar" },
  { size: 32, at: [328, 312], hex: PALETTE.ink, what: "the bowed spine across the middle" },
  { size: 32, at: [376, 200], hex: PALETTE.ink, what: "right pier" },
  { size: 32, at: [256, 40], hex: PALETTE.ivory, what: "plate above the cap bar" },
];

/** `#rrggbb` plus alpha of the pixel a master-space point falls in. */
function sample(image, point) {
  const unit = VIEWBOX / image.width;
  const px = Math.min(image.width - 1, Math.max(0, Math.floor(point[0] / unit)));
  const py = Math.min(image.height - 1, Math.max(0, Math.floor(point[1] / unit)));
  const o = (py * image.width + px) * 4;
  const hex = `#${[0, 1, 2]
    .map((c) => image.data[o + c].toString(16).padStart(2, "0"))
    .join("")}`;
  return { hex, alpha: image.data[o + 3], at: [px, py] };
}

/** Tiny proof sheet: the charcoal mark as █, the stone plate as ·. */
function asciiArt(image) {
  const rows = [];
  for (let y = 0; y < image.height; y++) {
    let row = "";
    for (let x = 0; x < image.width; x++) {
      const o = (y * image.width + x) * 4;
      const light = image.data[o] + image.data[o + 1] + image.data[o + 2];
      row += light > 330 ? "·" : "█";
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
      check(`${name} matches the current build`, onDisk.equals(bytes), `${onDisk.length} bytes`);
    } catch {
      check(`${name} exists`, false, "missing");
    }
  }

  /* Geometry first: the letter box is centred on the plate, and nothing in the
     drawing is thin enough to disappear in a tab strip. */
  const { x0, x1, y0, y1 } = LETTER;
  check(
    `the letter box is centred on the plate — ${x0}/${VIEWBOX - x1} beside, ` +
      `${y0}/${VIEWBOX - y1} above and below`,
    x0 + x1 === 2 * CENTER && y0 + y1 === 2 * CENTER
  );
  const feature = smallestFeature();
  check(
    `the narrowest feature is ${feature.units.toFixed(1)} units — ` +
      `${feature.pixels.toFixed(2)}px at 16×16`,
    feature.pixels >= 2
  );

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

  /* The plate reaches the tile's corners and nothing is transparent: a tab strip
     must be given the whole plaque, not a hole in it. */
  for (const [size, image] of images) {
    const corners = [
      sample(image, [0, 0]),
      sample(image, [VIEWBOX, 0]),
      sample(image, [0, VIEWBOX]),
      sample(image, [VIEWBOX, VIEWBOX]),
    ];
    check(
      `${size}px corners are the stone plate`,
      corners.every((c) => c.hex === PALETTE.ivory && c.alpha === 255),
      corners.map((c) => c.hex).join("/")
    );
    let opaque = true;
    for (let i = 3; i < image.data.length; i += 4) {
      if (image.data[i] !== 255) {
        opaque = false;
        break;
      }
    }
    check(`${size}px has no transparent pixel`, opaque);
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

  /* The 180px iOS tile: the same drawing at the same full bleed, opaque, with
     its own corner, pier and opening probes. */
  try {
    const apple = decodePng(read("apple-touch-icon.png"));
    check(
      `apple-touch-icon.png is ${APPLE_ICON_SIZE}×${APPLE_ICON_SIZE}`,
      apple.width === APPLE_ICON_SIZE && apple.height === APPLE_ICON_SIZE
    );
    let opaque = true;
    for (let i = 3; i < apple.data.length; i += 4) {
      if (apple.data[i] !== 255) {
        opaque = false;
        break;
      }
    }
    check("apple-touch-icon.png is fully opaque (iOS requires it)", opaque);
    const corner = sample(apple, [4, 4]);
    check("apple-touch-icon corner is the stone plate", corner.hex === PALETTE.ivory, corner.hex);
    const pier = sample(apple, [146, 256]);
    check("apple-touch-icon left pier is charcoal", pier.hex === PALETTE.ink, pier.hex);
    const opening = sample(apple, [256, 424]);
    check("apple-touch-icon foot opening is stone", opening.hex === PALETTE.ivory, opening.hex);
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

  /* SVG: square viewBox, the plate rect, the generated letter, the dark swap. */
  try {
    const svg = read("favicon.svg").toString("utf8");
    check("favicon.svg has a square viewBox", svg.includes(`viewBox="0 0 ${VIEWBOX} ${VIEWBOX}"`));
    check(
      "favicon.svg is one full-bleed plate and one path",
      svg.includes(
        `<rect class="plate" x="${PLATE.x}" y="${PLATE.y}" width="${PLATE.w}" height="${PLATE.h}"/>`
      ) && (svg.match(/<path /g) || []).length === 1
    );
    check("favicon.svg carries the generated letter", svg.includes(letterPathData()));
    check(
      "favicon.svg's path is a plain polyline — no arc or curve command",
      !/[A-Z]/.test(letterPathData().replace(/[MLZ]/g, ""))
    );
    check(
      "favicon.svg swaps for dark chrome",
      svg.includes("@media (prefers-color-scheme:dark)")
    );
    check(
      "favicon.svg is free of filters and embedded rasters",
      !/filter|<image|base64/.test(svg)
    );
    const dark = read("favicon-dark.svg").toString("utf8");
    check(
      "favicon-dark.svg is the static inverted plaque",
      dark.includes(PLAQUE_INVERTED.plate) &&
        dark.includes(PLAQUE_INVERTED.mark) &&
        !dark.includes("prefers-color-scheme")
    );
  } catch (error) {
    check("favicon.svg reads", false, String(error.message));
  }

  if (images.has(16)) {
    console.log("\n  16×16, as this script renders it  (█ charcoal mark, · stone plate):\n");
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
  .raw{display:flex;gap:28px;align-items:flex-end;padding:24px 28px;background:#dee1e6}
  .note{max-width:64ch;opacity:.7;margin:0 0 24px}
</style>
</head>
<body>
<h1>Norsta mark — inspection sheet</h1>
<p class="note">A carved <code>N</code> on a full-bleed stone plaque: two square piers and one
curved spine. The SVG at true tab size on the four backgrounds a tab strip uses
(dark scheme emulation swaps it to the charcoal plaque), then the 16 and 32px
rasters magnified 8× with nearest-neighbour so the pixel grid shows. Regenerate
with <code>node scripts/make-favicon.mjs --preview</code>.</p>
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
