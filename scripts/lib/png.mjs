/*
 * Minimal, dependency-free PNG reader/writer + crop/downscale helpers.
 *
 * The project ships no image tooling (no `sharp`, no native modules), but the
 * Instagram showcase needs a few real stone crops taken out of the supplied
 * design reference, so this module implements just enough of the PNG spec:
 *
 *   - 8-bit, non-interlaced, greyscale / RGB / RGBA (colour types 0, 2, 4, 6)
 *   - all five scanline filters on decode (0–4)
 *   - filter-0 encoding with zlib deflate on write
 *
 * Everything here is build-time only; nothing is imported by the app.
 */
import { readFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CHANNELS_BY_COLOR_TYPE = { 0: 1, 2: 3, 4: 2, 6: 4 };

/* ------------------------------------------------------------------ CRC ---- */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/* ---------------------------------------------------------------- decode ---- */
/**
 * @param {string|Buffer} input path or raw bytes of a PNG file
 * @returns {{width:number,height:number,channels:number,bitDepth:number,data:Buffer}}
 *          `data` holds tightly packed per-channel bytes.
 */
export function decodePng(input) {
  const buf = Buffer.isBuffer(input) ? input : readFileSync(input);
  if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("not a PNG file (bad signature)");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  let interlace = 0;
  const idat = [];

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }

  if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`);
  if (interlace !== 0) throw new Error("interlaced PNGs are not supported");
  const channels = CHANNELS_BY_COLOR_TYPE[colorType];
  if (!channels) throw new Error(`unsupported colour type ${colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);

  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    const cur = out.subarray(y * stride, (y + 1) * stride);

    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= channels ? prev[i - channels] : 0;
      let v = line[i];
      switch (filter) {
        case 0: break;
        case 1: v = (v + a) & 0xff; break;
        case 2: v = (v + b) & 0xff; break;
        case 3: v = (v + ((a + b) >> 1)) & 0xff; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
          break;
        }
        default:
          throw new Error(`unknown scanline filter ${filter} on row ${y}`);
      }
      cur[i] = v;
    }
  }

  return { width, height, channels, bitDepth, data: out };
}

/* ---------------------------------------------------------------- encode ---- */
function chunk(type, data) {
  const out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

/** Encode an image ({width,height,channels,data}) back to PNG bytes. */
export function encodePng(image) {
  const { width, height, channels, data } = image;
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = channels === 4 ? 6 : channels === 3 ? 2 : 1;
  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------ operations ---- */
/** Crop a rectangle, always returning RGBA. */
export function crop(image, x0, y0, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = y0 + y;
    for (let x = 0; x < w; x++) {
      const sx = x0 + x;
      const o = (y * w + x) * 4;
      if (sx < 0 || sy < 0 || sx >= image.width || sy >= image.height) {
        out[o + 3] = 0;
        continue;
      }
      const i = (sy * image.width + sx) * image.channels;
      const wide = image.channels > 2;
      out[o] = image.data[i];
      out[o + 1] = image.data[i + (wide ? 1 : 0)];
      out[o + 2] = image.data[i + (wide ? 2 : 0)];
      out[o + 3] = image.channels === 4 ? image.data[i + 3] : 255;
    }
  }
  return { width: w, height: h, channels: 4, data: out };
}

/** Box-filter downscale — cheap, and clean for integer-ish ratios. */
export function scale(image, targetW) {
  if (targetW >= image.width) return image;
  const factor = image.width / targetW;
  const targetH = Math.max(1, Math.round(image.height / factor));
  const box = Math.max(1, Math.floor(factor));
  const out = Buffer.alloc(targetW * targetH * 4);

  for (let y = 0; y < targetH; y++) {
    const sy0 = Math.floor(y * factor);
    const sy1 = Math.min(image.height, sy0 + box);
    for (let x = 0; x < targetW; x++) {
      const sx0 = Math.floor(x * factor);
      const sx1 = Math.min(image.width, sx0 + box);
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        for (let sx = sx0; sx < sx1; sx++) {
          const i = (sy * image.width + sx) * 4;
          r += image.data[i];
          g += image.data[i + 1];
          b += image.data[i + 2];
          n++;
        }
      }
      const o = (y * targetW + x) * 4;
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n);
      out[o + 3] = 255;
    }
  }
  return { width: targetW, height: targetH, channels: 4, data: out };
}

/**
 * Nearest-neighbour magnification, for inspection zooms. Keeps pixel edges
 * crisp so a crop can be judged without the artefact of an interpolating
 * upscale.
 */
export function magnify(image, factor) {
  const f = Math.max(1, Math.round(factor));
  if (f === 1) return image;
  const width = image.width * f;
  const height = image.height * f;
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const sy = Math.floor(y / f);
    for (let x = 0; x < width; x++) {
      const sx = Math.floor(x / f);
      const i = (sy * image.width + sx) * 4;
      const o = (y * width + x) * 4;
      out[o] = image.data[i];
      out[o + 1] = image.data[i + 1];
      out[o + 2] = image.data[i + 2];
      out[o + 3] = image.channels === 4 ? image.data[i + 3] : 255;
    }
  }
  return { width, height, channels: 4, data: out };
}

/**
 * Feather the alpha channel inwards from the edges so a crop can be layered
 * over the CSS gradient backdrop without revealing a seam.
 */
export function feather(image, { left = 0, right = 0, top = 0, bottom = 0 } = {}) {
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      let a = 1;
      if (left) a = Math.min(a, x / left);
      if (right) a = Math.min(a, (image.width - 1 - x) / right);
      if (top) a = Math.min(a, y / top);
      if (bottom) a = Math.min(a, (image.height - 1 - y) / bottom);
      if (a >= 1) continue;
      const o = (y * image.width + x) * 4;
      image.data[o + 3] = Math.round(image.data[o + 3] * Math.max(0, a) ** 1.4);
    }
  }
  return image;
}

const hex = (v) => Math.round(v).toString(16).padStart(2, "0");

/** Average colour of a rectangle as `#rrggbb`. */
export function averageColor(image, x0, y0, w, h) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const ch = image.channels;
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const i = (y * image.width + x) * ch;
      r += image.data[i];
      g += image.data[i + (ch > 2 ? 1 : 0)];
      b += image.data[i + (ch > 2 ? 2 : 0)];
      n++;
    }
  }
  return `#${hex(r / n)}${hex(g / n)}${hex(b / n)}`;
}

/** `#rrggbb` of one pixel. */
export function pixelAt(image, x, y) {
  const i = (y * image.width + x) * image.channels;
  const ch = image.channels;
  return `#${hex(image.data[i])}${hex(image.data[i + (ch > 2 ? 1 : 0)])}${hex(
    image.data[i + (ch > 2 ? 2 : 0)]
  )}`;
}
