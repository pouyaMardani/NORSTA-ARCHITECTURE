/*
 * Instagram showcase - asset preparation.
 *
 * Derives the single photographic backdrop used by the new Instagram section
 * from the supplied design reference ("Norsta Instagram Architecture
 * Showcase.png"):
 *
 *   public/images/instagram-scene.png
 *
 * One edit is applied to the reference before it is written out: both patches of
 * baked-in Persian copy - the right-hand block with its dark CTA pill, and the
 * invitation repeated over the wall on the left - are inpainted away, because
 * the real section renders that copy as HTML over the plate.
 *
 * Everything else - the phone, its screen, the stone slab, the plaster wall,
 * the diagonal light and every contact shadow - stays photographic.
 *
 * Usage:
 *   node scripts/make-instagram-assets.mjs --probe        # measure + colours
 *   node scripts/make-instagram-assets.mjs --boxes        # silhouette + text boxes
 *   node scripts/make-instagram-assets.mjs --edges        # per-column edge scan
 *   node scripts/make-instagram-assets.mjs --row=y,x0,x1,s  # dump a pixel row
 *   node scripts/make-instagram-assets.mjs --col=x,y0,y1,s  # dump a pixel column
 *   node scripts/make-instagram-assets.mjs --candidates   # exploratory crops
 *   node scripts/make-instagram-assets.mjs --view=x,y,w,h,s [--clean]
 *   node scripts/make-instagram-assets.mjs                # write the asset
 */
import { writeFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { decodePng, encodePng, crop, magnify, averageColor } from "./lib/png.mjs";

const REFERENCE = join(process.cwd(), "Norsta Instagram Architecture Showcase.png");
const OUT_DIR = join(process.cwd(), "public", "images");
const OUT_NAME = "instagram-scene.png";

const image = decodePng(REFERENCE);
const px = (x, y) => {
  const i = (y * image.width + x) * image.channels;
  return [image.data[i], image.data[i + 1], image.data[i + 2]];
};

/* ------------------------------------------------------------- detection ---- */
const isFrame = (r, g, b) => r < 72 && g < 72 && b < 72 && r - b < 22;
/** The screen is near-neutral white; the lit stone is warmer than this. */
const isScreen = (r, g, b) => r > 226 && g > 220 && b > 206 && r - b < 26;

function screenNear(x0, x1, y) {
  for (let x = x0; x <= x1; x++) {
    const [r, g, b] = px(x, y);
    if (isScreen(r, g, b)) return true;
  }
  return false;
}

/**
 * Locate the phone by pairing the two thin black bezel strips that flank the
 * bright screen. The dark, warm shadow beside the slab never forms such a
 * pair, so it is rejected.
 */
function detectPhone() {
  const rows = [];
  for (let y = 70; y <= 785; y += 2) {
    const runs = [];
    let start = -1;
    for (let x = 324; x <= 802; x++) {
      const [r, g, b] = px(x, y);
      if (isFrame(r, g, b)) {
        if (start < 0) start = x;
      } else if (start >= 0) {
        if (x - start <= 40) runs.push([start, x - 1]);
        start = -1;
      }
    }
    const left = runs.find(([, e]) => screenNear(e + 4, e + 16, y));
    const rights = runs.filter(([s]) => screenNear(s - 16, s - 4, y));
    const right = rights.length ? rights[rights.length - 1] : null;
    if (!left || !right) continue;
    const gap = right[0] - left[1];
    if (gap < 150 || gap > 302) continue;
    rows.push([y, left[0], right[1]]);
  }
  if (rows.length < 20) throw new Error(`phone silhouette not found (${rows.length} rows)`);

  const fit = (pick) => {
    let n = 0;
    let sy = 0;
    let sx = 0;
    let syy = 0;
    let sxy = 0;
    for (const row of rows) {
      const y = row[0];
      const x = pick(row);
      n++; sy += y; sx += x; syy += y * y; sxy += x * y;
    }
    const a = (n * sxy - sy * sx) / (n * syy - sy * sy);
    return { a, b: (sx - a * sy) / n };
  };
  const leftEdge = fit((r) => r[1]);
  const rightEdge = fit((r) => r[2]);
  const slope = (leftEdge.a + rightEdge.a) / 2;

  const topY = rows[0][0];
  const bottomY = rows[rows.length - 1][0];
  const at = (y, line) => [slope * y + line.b, y];
  const TL = at(topY, leftEdge);
  const TR = at(topY, rightEdge);
  const BR = at(bottomY, rightEdge);
  const BL = at(bottomY, leftEdge);
  const w = Math.hypot(TR[0] - TL[0], TR[1] - TL[1]);
  const h = Math.hypot(BL[0] - TL[0], BL[1] - TL[1]);
  const center = [(TL[0] + BR[0]) / 2, (TL[1] + BR[1]) / 2];
  return { rows: rows.length, slope, topY, bottomY, w, h, center, TL, TR, BR, BL };
}

/* ------------------------------------------------------------------ probe ---- */
if (process.argv.includes("--probe")) {
  console.log(`reference: ${image.width}x${image.height}, ${image.channels} channels`);
  const samples = [
    ["wall top-left (shadow)", 60, 40, 120, 90],
    ["wall upper-mid", 700, 60, 160, 120],
    ["wall right edge", 1240, 200, 60, 200],
    ["wall lit band", 150, 150, 160, 160],
    ["wall behind copy", 1050, 350, 120, 120],
    ["floor right", 900, 720, 200, 60],
    ["floor mid", 700, 745, 200, 40],
    ["slab lit top", 300, 470, 60, 40],
    ["slab front face", 300, 620, 60, 40],
    ["slab lit edge", 262, 452, 80, 12],
    ["sphere mid", 120, 520, 60, 60],
    ["sphere highlight", 60, 330, 40, 40],
    ["sphere dark limb", 20, 620, 60, 60],
    ["contact shadow", 620, 700, 80, 30],
    ["deep shadow lower left", 40, 730, 120, 50],
  ];
  for (const [label, x, y, w, h] of samples) {
    console.log(`  ${label.padEnd(26)} ${averageColor(image, x, y, w, h)}`);
  }
  process.exit(0);
}

/* ------------------------------------------------------------------ boxes ---- */
const pctOf = (v, total) => ((v / total) * 100).toFixed(3);

if (process.argv.includes("--boxes")) {
  const phone = detectPhone();
  const deg = (-Math.atan(phone.slope) * 180) / Math.PI;
  const r0 = (p) => [Math.round(p[0]), Math.round(p[1])];
  console.log(`silhouette rows: ${phone.rows} (y ${phone.topY}..${phone.bottomY})`);
  console.log(`lean: dx/dy = ${phone.slope.toFixed(4)} -> css rotate(${deg.toFixed(2)}deg)`);
  console.log(`device: ${phone.w.toFixed(1)} x ${phone.h.toFixed(1)}  ratio ${(phone.h / phone.w).toFixed(3)}`);
  console.log(`center: ${JSON.stringify(r0(phone.center))}`);
  console.log(
    `corners: ${JSON.stringify({ TL: r0(phone.TL), TR: r0(phone.TR), BR: r0(phone.BR), BL: r0(phone.BL) })}`
  );
  const left = phone.center[0] - phone.w / 2;
  const top = phone.center[1] - phone.h / 2;
  console.log(
    `full 1312x793:  left ${pctOf(left, 1312)}%  top ${pctOf(top, 793)}%  w ${pctOf(phone.w, 1312)}%  h ${pctOf(
      phone.h,
      793
    )}%`
  );
  console.log(
    `mobile 780x793: left ${pctOf(left, 780)}%  top ${pctOf(top, 793)}%  w ${pctOf(phone.w, 780)}%  h ${pctOf(
      phone.h,
      793
    )}%`
  );

  const isCopy = (x, y) => {
    const [r, g, b] = px(x, y);
    return r < 152 && g < 146 && b < 136;
  };
  const isNote = (x, y) => {
    const [r, g, b] = px(x, y);
    return r < 96 && g < 92 && b < 88;
  };
  const scan = (xFrom, xTo, yFrom, yTo, test, label) => {
    const out = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let y = yFrom; y < yTo; y++) {
      let lo = -1;
      let hi = -1;
      for (let x = xFrom; x < xTo; x++) {
        if (!test(x, y)) continue;
        if (lo < 0) lo = x;
        hi = x;
      }
      if (lo < 0) continue;
      minX = Math.min(minX, lo);
      maxX = Math.max(maxX, hi);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      if (y % 10 === 0) out.push(`${y}:${lo}..${hi}`);
    }
    console.log(`${label} bbox: x ${minX}..${maxX}, y ${minY}..${maxY}`);
    console.log(`${label} rows: ${out.join(" | ")}`);
  };
  scan(830, image.width, 60, 700, isCopy, "right copy");
  scan(40, 300, 40, 260, isNote, "left note");
  process.exit(0);
}

/* --------------------------------------------------------------- inpaint ---- */
/** The baked-in Persian copy on the right of the plate, padded a little. */
const COPY_BOX = { x0: 890, y0: 158, x1: 1236, y1: 582 };

/**
 * The reference repeats the invitation flush left over the wall ("ما را در
 * اینستاگرام دنبال کنید" beside a hairline rule, with the handle underneath).
 * The section says the same thing in its own markup, so the baked-in version
 * goes too.
 */
const INVITE_BOX = { x0: 80, y0: 102, x1: 218, y1: 218 };

/** Paint every baked-in copy region out of the plate. */
function cleanReferenceCopy(image) {
  inpaint(image, COPY_BOX);
  inpaint(image, INVITE_BOX);
  return image;
}

/**
 * Paint a rectangle out of the plate by interpolating each row between the
 * columns that flank it. The wall behind the copy is a smooth vertical
 * gradient, so a per-row blend is indistinguishable from the original, and a
 * short ramp at the box's edge removes any seam.
 */
function inpaint(image, { x0, y0, x1, y1 }, ramp = 8) {
  const ch = image.channels;
  const at = (x, y) => {
    const i = (y * image.width + x) * ch;
    return [image.data[i], image.data[i + 1], image.data[i + 2]];
  };
  const put = (x, y, c) => {
    const i = (y * image.width + x) * ch;
    image.data[i] = c[0];
    image.data[i + 1] = c[1];
    image.data[i + 2] = c[2];
  };
  const avg = (from, to, y) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let x = Math.max(0, from); x <= Math.min(image.width - 1, to); x++) {
      const c = at(x, y);
      r += c[0];
      g += c[1];
      b += c[2];
      n++;
    }
    return [r / n, g / n, b / n];
  };

  for (let y = y0; y <= y1; y++) {
    const left = avg(x0 - 7, x0 - 1, y);
    const right = avg(x1 + 1, x1 + 7, y);
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / (x1 - x0);
      const mixed = [
        left[0] + (right[0] - left[0]) * t,
        left[1] + (right[1] - left[1]) * t,
        left[2] + (right[2] - left[2]) * t,
      ];
      const edge = Math.min(x - x0, x1 - x, y - y0, y1 - y) / ramp;
      const a = Math.min(1, Math.max(0, edge));
      const was = at(x, y);
      put(x, y, [
        was[0] + (mixed[0] - was[0]) * a,
        was[1] + (mixed[1] - was[1]) * a,
        was[2] + (mixed[2] - was[2]) * a,
      ]);
    }
  }
  return image;
}

/* ------------------------------------------------------------------ edges ---- */
if (process.argv.includes("--edges")) {
  const dark = (x, y) => {
    const [r, g, b] = px(x, y);
    return r < 90 && g < 88 && b < 84;
  };
  const bright = (x, y) => {
    const [r, g, b] = px(x, y);
    return r > 226 && g > 220 && b > 206;
  };
  const anyAt = (x, y) => {
    const [r, g, b] = px(x, y);
    return isFrame(r, g, b) || isScreen(r, g, b);
  };
  console.log("x\ttopOuter\ttopBezel\tscreenTop");
  for (let x = 350; x <= 700; x += 10) {
    let topOuter = -1;
    for (let y = 70; y < 260; y++) if (anyAt(x, y)) { topOuter = y; break; }
    let topBezel = -1;
    for (let y = 70; y < 260; y++) if (dark(x, y) && bright(x, y + 34)) { topBezel = y; break; }
    let screenTop = -1;
    for (let y = 70; y < 260; y++) if (bright(x, y)) { screenTop = y; break; }
    console.log(`${x}\t${topOuter}\t${topBezel}\t${screenTop}`);
  }
  console.log("x\tbottomOuter\tbottomBezel\tscreenBottom");
  for (let x = 350; x <= 700; x += 10) {
    let bottomOuter = -1;
    for (let y = 780; y > 500; y--) if (anyAt(x, y)) { bottomOuter = y; break; }
    let bottomBezel = -1;
    for (let y = 780; y > 500; y--) if (dark(x, y) && bright(x, y - 34)) { bottomBezel = y; break; }
    let screenBottom = -1;
    for (let y = 780; y > 500; y--) if (bright(x, y)) { screenBottom = y; break; }
    console.log(`${x}\t${bottomOuter}\t${bottomBezel}\t${screenBottom}`);
  }
  console.log("y\tscreenL\tscreenR\tframeL\tframeR");
  for (let y = 110; y <= 690; y += 20) {
    let screenL = -1;
    let screenR = -1;
    let frameL = -1;
    let frameR = -1;
    for (let x = 330; x <= 700; x++) {
      const [r, g, b] = px(x, y);
      if (isScreen(r, g, b)) {
        if (screenL < 0) screenL = x;
        screenR = x;
      }
    }
    for (let x = 330; x <= 700; x++) {
      const [r, g, b] = px(x, y);
      if (isFrame(r, g, b)) {
        if (frameL < 0) frameL = x;
        frameR = x;
      }
    }
    console.log(`${y}\t${screenL}\t${screenR}\t${frameL}\t${frameR}`);
  }
  process.exit(0);
}

/* -------------------------------------------------------------------- row ---- */
const rowArg = process.argv.find((a) => a.startsWith("--row="));
if (rowArg) {
  const [y, x0, x1, step] = rowArg.slice("--row=".length).split(",").map(Number);
  const parts = [];
  for (let x = x0; x <= x1; x += step || 1) {
    const [r, g, b] = px(x, y);
    parts.push(`${x}:${r},${g},${b}`);
  }
  console.log(`y=${y}\n${parts.join(" ")}`);
  process.exit(0);
}

/* -------------------------------------------------------------------- col ---- */
const colArg = process.argv.find((a) => a.startsWith("--col="));
if (colArg) {
  const [x, y0, y1, step] = colArg.slice("--col=".length).split(",").map(Number);
  const parts = [];
  for (let y = y0; y <= y1; y += step || 1) {
    const [r, g, b] = px(x, y);
    parts.push(`${y}:${r},${g},${b}`);
  }
  console.log(`x=${x}\n${parts.join(" ")}`);
  process.exit(0);
}

/* ------------------------------------------------------------------- view ---- */
const viewArg = process.argv.find((a) => a.startsWith("--view="));
if (viewArg) {
  const [x, y, w, h, s] = viewArg.slice("--view=".length).split(",").map(Number);
  if (process.argv.includes("--clean")) cleanReferenceCopy(image);
  const dir = join(process.cwd(), "_ref", "ig");
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `view-${x}-${y}-${w}-${h}-${s || 1}.png`);
  writeFileSync(out, encodePng(magnify(crop(image, x, y, w, h), s || 1)));
  console.log(`${w}x${h} at ${x},${y} magnified x${s || 1} -> ${out}`);
  process.exit(0);
}

/* ------------------------------------------------------------ candidates ---- */
if (process.argv.includes("--candidates")) {
  const dir = join(process.cwd(), "_ref", "ig");
  mkdirSync(dir, { recursive: true });
  const boxes = {
    "a-left-half": [0, 0, 660, 793],
    "b-sphere-plate": [0, 230, 420, 563],
    "c-slab": [230, 360, 330, 433],
    "d-right-floor": [640, 500, 672, 293],
    "g-wall": [600, 0, 320, 320],
  };
  for (const [name, [x, y, w, h]] of Object.entries(boxes)) {
    const out = join(dir, `${name}.png`);
    writeFileSync(out, encodePng(crop(image, x, y, w, h)));
    console.log(`${name}: ${w}x${h} -> ${out}`);
  }
  process.exit(0);
}

/* ----------------------------------------------------------------- build ---- */
/*
 * Only the reference's baked-in copy is removed - the right-hand block (heading,
 * note and dark CTA pill) and the invitation repeated over the wall on the left.
 * The phone, its screen and its contact shadow stay exactly as rendered, because
 * the section draws its own copy as HTML over the plate rather than re-drawing
 * the device.
 */
cleanReferenceCopy(image);

/** Drop the (fully opaque) alpha channel so the plate ships as a smaller PNG. */
function toRgb(image) {
  const out = Buffer.alloc(image.width * image.height * 3);
  for (let i = 0, o = 0; i < image.data.length; i += image.channels, o += 3) {
    out[o] = image.data[i];
    out[o + 1] = image.data[i + 1];
    out[o + 2] = image.data[i + 2];
  }
  return { width: image.width, height: image.height, channels: 3, data: out };
}

const plate = toRgb(image);
mkdirSync(OUT_DIR, { recursive: true });
const outPath = join(OUT_DIR, OUT_NAME);
writeFileSync(outPath, encodePng(plate));

const wall = averageColor(image, 700, 620, 160, 80);
console.log(`wrote ${outPath}`);
console.log(`  ${plate.width}x${plate.height}, ${(statSync(outPath).size / 1048576).toFixed(2)} MB`);
console.log(`  wall tone behind the copy: ${wall}`);

