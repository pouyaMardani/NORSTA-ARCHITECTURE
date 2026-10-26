/*
 * Temporary plate renderer.
 *
 * The studio has not published close-ups of its materials yet, so the sections
 * that hang a picture of a real finish ship with a *plate* instead: a calm, warm
 * tinted surface carrying a hard-to-miss "TEMPORARY PLATE" marking and a fine
 * registration cross, so nobody can mistake one of these for a photograph of the
 * real material.
 *
 * This module is the single implementation of that plate. It was lifted out of
 * `scripts/make-sample-plates.mjs` unchanged — byte for byte, so the plates the
 * material gallery already ships stay identical — and is now shared with
 * `scripts/make-product-plates.mjs` for the product catalogue's plates. The only
 * things parameterised are the seed, the tint and the wording drawn on the face.
 *
 * Everything here is build-time only; nothing is imported by the app. No font
 * file, no native module, no dependency: the marking is drawn with the 5x7
 * bitmap face below, in Latin, because the plates are internal placeholders and
 * the real Persian copy of a section is drawn as HTML *over* a plate, never
 * inside it.
 *
 * The surface is three octaves of wrapped value noise plus a very slow trowel
 * field. Everything is smooth and low-contrast on purpose: it keeps the plates
 * small (they are placeholders, not photographs) and avoids pretending to
 * reproduce the grain of a real finish.
 */
import { encodePng } from "./png.mjs";

/* ------------------------------------------------------------------ noise ---- */
/** FNV-1a, so a plate is seeded by its own seed and never moves between runs. */
export function hashString(value) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Small deterministic PRNG (mulberry32). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One octave: random values on a coarse grid, read back with smooth steps. */
export function makeOctave(rand, cols, rows) {
  const cells = new Float32Array(cols * rows);
  for (let i = 0; i < cells.length; i++) cells[i] = rand();
  return { cols, rows, cells };
}

/** Bilinear value noise, wrapping at the edges so the field has no seam. */
export function sampleOctave({ cols, rows, cells }, u, v) {
  const x = u * cols;
  const y = v * rows;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = x - x0;
  const ty = y - y0;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const xa = ((x0 % cols) + cols) % cols;
  const ya = ((y0 % rows) + rows) % rows;
  const xb = (xa + 1) % cols;
  const yb = (ya + 1) % rows;
  const at = (cx, cy) => cells[cy * cols + cx];
  const top = at(xa, ya) + (at(xb, ya) - at(xa, ya)) * sx;
  const bottom = at(xa, yb) + (at(xb, yb) - at(xa, yb)) * sx;
  return top + (bottom - top) * sy;
}

/* ------------------------------------------------------------------ paint ---- */
export const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);

export function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

/** Alpha-blend one pixel of a 3-channel buffer. */
export function blend(data, width, x, y, r, g, b, alpha) {
  if (x < 0 || y < 0) return;
  const i = (y * width + x) * 3;
  if (i < 0 || i + 2 >= data.length || alpha <= 0) return;
  const a = alpha > 1 ? 1 : alpha;
  data[i] = clamp255(data[i] * (1 - a) + r * a);
  data[i + 1] = clamp255(data[i + 1] * (1 - a) + g * a);
  data[i + 2] = clamp255(data[i + 2] * (1 - a) + b * a);
}

/* ---------------------------------------------------------- the marking ---- */
/*
 * A 5x7 bitmap face, uppercase only. The plate has to *say* what it is — a
 * stand-in — and that sentence is Latin (`TEMPORARY PLATE`), because the real
 * Persian copy of the section is drawn as HTML over these plates, never inside
 * them. Keeping it here means the marking travels with the plate with no font
 * file, no native module and no dependency.
 */
export const GLYPHS = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "/": ["00001", "00001", "00010", "00100", "01000", "10000", "10000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

export const GLYPH_W = 5;
export const GLYPH_H = 7;

/** Pixel width of a line of text, letterspacing included. */
export function textWidth(text, scale, tracking) {
  return text.length * (GLYPH_W * scale + tracking) - tracking;
}

/**
 * Draw a line of uppercase text. The alpha stays low on purpose: the marking has
 * to be unmistakable without turning the plate into a sign.
 */
export function drawText(data, width, text, x, y, scale, ink, alpha, tracking) {
  const gap = tracking ?? Math.round(scale * 1.2);
  let cursor = x;
  for (const rawChar of text.toUpperCase()) {
    const glyph = GLYPHS[rawChar];
    if (!glyph) {
      cursor += GLYPH_W * scale + gap;
      continue;
    }
    for (let row = 0; row < GLYPH_H; row++) {
      for (let col = 0; col < GLYPH_W; col++) {
        if (glyph[row][col] !== "1") continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            blend(
              data,
              width,
              cursor + col * scale + dx,
              y + row * scale + dy,
              ink.r,
              ink.g,
              ink.b,
              alpha
            );
          }
        }
      }
    }
    cursor += GLYPH_W * scale + gap;
  }
}

/** One horizontal hairline. */
export function drawRule(data, width, x0, x1, y, ink, alpha) {
  for (let x = x0; x <= x1; x++) blend(data, width, x, y, ink.r, ink.g, ink.b, alpha);
}

/** The inset hairline, the four corner ticks and the centre cross. */
export function drawRegistration(data, width, height, inset, ink) {
  const thick = Math.max(1, Math.round(width * 0.0022));
  const arm = Math.round(Math.min(width, height) * 0.045);
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);
  const tick = Math.round(inset * 0.5);

  for (let t = 0; t < thick; t++) {
    for (let x = cx - arm; x <= cx + arm; x++) {
      blend(data, width, x, cy + t, ink.r, ink.g, ink.b, 0.13);
    }
    for (let y = cy - arm; y <= cy + arm; y++) {
      blend(data, width, cx + t, y, ink.r, ink.g, ink.b, 0.13);
    }

    for (let x = inset; x < width - inset; x++) {
      blend(data, width, x, inset + t, ink.r, ink.g, ink.b, 0.18);
      blend(data, width, x, height - 1 - inset - t, ink.r, ink.g, ink.b, 0.18);
    }
    for (let y = inset; y < height - inset; y++) {
      blend(data, width, inset + t, y, ink.r, ink.g, ink.b, 0.18);
      blend(data, width, width - 1 - inset - t, y, ink.r, ink.g, ink.b, 0.18);
    }

    for (let i = 0; i <= tick; i++) {
      blend(data, width, inset + i, inset + t, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, inset + t, inset + i, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, width - 1 - inset - i, inset + t, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, width - 1 - inset - t, inset + i, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, inset + i, height - 1 - inset - t, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, inset + t, height - 1 - inset - i, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, width - 1 - inset - i, height - 1 - inset - t, ink.r, ink.g, ink.b, 0.3);
      blend(data, width, width - 1 - inset - t, height - 1 - inset - i, ink.r, ink.g, ink.b, 0.3);
    }
  }
}

/** Largest integer glyph scale that keeps `text` inside `maxWidth`. */
export function fitScale(text, maxWidth, maxScale) {
  for (let scale = maxScale; scale > 2; scale--) {
    if (textWidth(text, scale, Math.round(scale * 1.4)) <= maxWidth) return scale;
  }
  return 2;
}

/* ----------------------------------------------------------------- plate ---- */
/**
 * Draw one plate: the tinted surface, the registration marks and the marking
 * that says the plate is temporary.
 *
 * @param {object} plate
 * @param {string} plate.seed    deterministic seed — normally the record's slug
 * @param {string} plate.tint    `#rrggbb` surface tone, taken from the record
 * @param {{width:number,height:number}} plate.size
 * @param {string} plate.title   the record's own name, set as the large line
 * @param {string} [plate.kicker] small line above the title
 * @param {string} [plate.notice]
 * @param {string} [plate.advice]
 * @returns {Buffer} an encoded PNG
 */
export function renderPlate({
  seed,
  tint,
  size,
  kicker = "NORSTA",
  title,
  notice = "TEMPORARY PLATE",
  advice = "REPLACE WITH A STUDIO PHOTOGRAPH",
}) {
  const { width, height } = size;
  const base = hexToRgb(tint);
  const rand = mulberry32(hashString(seed));
  const octaves = [
    { cols: 4, rows: 5, amp: 1 },
    { cols: 9, rows: 11, amp: 0.46 },
    { cols: 19, rows: 24, amp: 0.2 },
  ].map((octave) => ({ amp: octave.amp, field: makeOctave(rand, octave.cols, octave.rows) }));
  const ampTotal = octaves.reduce((sum, octave) => sum + octave.amp, 0);
  const trowel = makeOctave(rand, 7, 9);
  const ink = { r: 26, g: 19, b: 12 };

  const data = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      let noise = 0;
      for (const octave of octaves) noise += octave.amp * sampleOctave(octave.field, u, v);
      noise /= ampTotal;

      const mottle = noise - 0.5;
      const sweep = sampleOctave(trowel, u, v) - 0.5;
      const falloff = 0.075 * (1 - v) * (1 - v);
      const glow = 0.05 * Math.exp(-(((u - 0.16) ** 2) / 0.16 + ((v - 0.02) ** 2) / 0.06));
      const vignette = -0.06 * Math.max(0, Math.hypot(u - 0.5, v - 0.55) - 0.42);
      const k = 1 + 0.17 * mottle + 0.06 * sweep + falloff + glow + vignette;

      const i = (y * width + x) * 3;
      data[i] = clamp255(base.r * k);
      data[i + 1] = clamp255(base.g * k);
      data[i + 2] = clamp255(base.b * k);
    }
  }

  const centerX = Math.round(width / 2);
  const gap = Math.round(width * 0.017);
  const maxLineWidth = Math.round(width * 0.62);
  let cursorY = Math.round(height * 0.6);

  drawText(data, width, kicker, centerX - Math.round(textWidth(kicker, 3, 6) / 2), cursorY, 3, ink, 0.22, 6);
  cursorY += GLYPH_H * 3 + gap;

  const label = title.toUpperCase();
  const labelScale = fitScale(label, maxLineWidth, 7);
  const labelTracking = Math.round(labelScale * 1.4);
  drawText(
    data,
    width,
    label,
    centerX - Math.round(textWidth(label, labelScale, labelTracking) / 2),
    cursorY,
    labelScale,
    ink,
    0.42,
    labelTracking
  );
  cursorY += GLYPH_H * labelScale + Math.round(gap * 1.4);

  const ruleHalf = Math.round(width * 0.17);
  drawRule(data, width, centerX - ruleHalf, centerX + ruleHalf, cursorY, ink, 0.3);
  cursorY += Math.round(gap * 1.2);

  drawText(data, width, notice, centerX - Math.round(textWidth(notice, 2, 3) / 2), cursorY, 2, ink, 0.34, 3);
  cursorY += GLYPH_H * 2 + Math.round(gap * 0.8);

  drawText(data, width, advice, centerX - Math.round(textWidth(advice, 2, 2) / 2), cursorY, 2, ink, 0.26, 2);

  drawRegistration(data, width, height, Math.round(width * 0.06), ink);

  return encodePng({ width, height, channels: 3, data });
}
