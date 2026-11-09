/**
 * The material library's records.
 *
 * This is the only file that describes a sample. Add one entry and the wall grows
 * a frame; change `sortOrder` and the wall re-orders; delete an entry and the
 * grid closes the gap on its own — the gallery, the filter row, the frame
 * variants and the zoom viewer all read this list and nothing else.
 *
 * ── THE NAMES ──────────────────────────────────────────────────────────────
 * The names below are the studio's own finish names, given by the owner:
 * بامبو، کرمی، جزیره، پوست پرتقالی، طلایی — plus خاکِ خام، سنگِ زیتونی and
 * دودِ خاکستری kept from the library to round out the wall. Each one describes
 * an appearance only — no record states a technical property of the material,
 * because the studio has not published any yet. Replace a name word-for-word
 * with the studio's own whenever it changes.
 *
 * ── THE PHOTOGRAPHS ────────────────────────────────────────────────────────
 * Every record points at a real close-up photograph, hotlinked from Pexels
 * (free licence) through `pexelsPhoto()` in `config.ts` — the studio's own
 * close-ups of these finishes do not exist in the repository yet, and a binary
 * cannot be added through the usual push, so the wall's photographs come from
 * Pexels' CDN instead of `public/`. Each one is already cut to the frame's 4/5
 * at 1600px wide, which is the size the zoom viewer needs; `next/image` then
 * optimises it further (WebP, sized per screen) under the `images.pexels.com`
 * allow-list in `next.config.ts`. To publish the studio's own photograph for a
 * sample: add it under `public/images/samples/`, then replace that record's
 * `image` with
 *
 *   image: { src: "/images/samples/bamboo.png", width: 1600, height: 2000,
 *            alt: "بافتِ بافته‌شده‌ی بامبو با نوارهای روشن" },
 *
 * No component or stylesheet change is needed — the frame, its 4/5 crop and the
 * zoom viewer take whatever image the record names. A sample with no photograph
 * at all falls back to a temporary plate via `placeholderImage()` in
 * `config.ts`, which prints «تصویر موقت» on its face.
 *
 * ── THE FRAMES ─────────────────────────────────────────────────────────────
 * `wood` and `mount` are the curator's knobs: they vary the frame the sample
 * hangs in without touching the grid, which is how the wall reads as a
 * collection rather than as a row of equal tiles. Both are optional — a record
 * that omits them simply gets the oak-and-slim default.
 */

import { pexelsPhoto } from "./config";

import type { SampleDTO } from "./types";

export const SAMPLES: SampleDTO[] = [
  {
    id: 1,
    slug: "bamboo",
    name: "بامبو",
    category: "مات",
    finish: "بافتِ خطیِ بافته",
    color: "کاهیِ روشن",
    colorHex: "#d6cba9",
    description:
      "نوارهای بافته‌شده‌ی بامبو؛ خط‌های باریک که نور را می‌شکنند و سطحی گرم و زنده می‌سازند.",
    image: pexelsPhoto(36165506, "بافتِ بافته‌شده‌ی بامبو با نوارهای روشن"),
    featured: true,
    sortOrder: 10,
    wood: "oak",
    mount: "slim",
  },
  {
    id: 2,
    slug: "cream",
    name: "کرمی",
    category: "نیمه‌صیقلی",
    finish: "نیمه‌صیقلیِ نرم",
    color: "کرمِ گرم",
    colorHex: "#dec39b",
    description:
      "کرمیِ گرم با دانه‌بندیِ ریز؛ سطحی یک‌دست و آرام که نور را نرم پخش می‌کند.",
    image: pexelsPhoto(4913801, "سطحِ کرمیِ گرم با دانه‌بندیِ ریز"),
    featured: true,
    sortOrder: 20,
    wood: "walnut",
    mount: "wide",
  },
  {
    id: 3,
    slug: "island",
    name: "جزیره",
    category: "مات",
    finish: "ماتِ دانه‌ریز",
    color: "شنیِ طلایی",
    colorHex: "#c4a26d",
    description:
      "دانه‌های ریزِ شنِ طلایی؛ یادِ ساحل و جزیره — سطحی یک‌دست که زیر نور گرم می‌درخشد.",
    image: pexelsPhoto(34208459, "دانه‌های ریزِ شنِ طلایی"),
    featured: true,
    sortOrder: 30,
    wood: "smoked",
    mount: "slim",
  },
  {
    id: 4,
    slug: "orange-peel",
    name: "پوست پرتقالی",
    category: "مات",
    finish: "ماتِ حفره‌دار",
    color: "سفیدِ سرد",
    colorHex: "#d9dde0",
    description:
      "سطحی حفره‌دار و برجسته، چون پوستِ پرتقال؛ برآمدگی‌های ریز که با حرکتِ نور سایه‌روشن می‌سازند.",
    image: pexelsPhoto(5497877, "سطحِ سفیدِ حفره‌دار چون پوستِ پرتقال"),
    sortOrder: 40,
    wood: "walnut",
    mount: "wide",
  },
  {
    id: 5,
    slug: "golden",
    name: "طلایی",
    category: "صیقلی",
    finish: "صیقلیِ فلزی",
    color: "طلاییِ براق",
    colorHex: "#d9a441",
    description:
      "طلاییِ براق با چین‌و‌تای فلزی؛ سطحی که نور را می‌گیرد و به‌صورتِ لکه‌های گرم برمی‌گرداند.",
    image: pexelsPhoto(7430598, "ورقِ طلاییِ چین‌خورده با بازتابِ فلزی"),
    featured: true,
    sortOrder: 50,
    wood: "oak",
    mount: "double",
  },
  {
    id: 6,
    slug: "raw-earth",
    name: "خاکِ خام",
    category: "مات",
    finish: "ماتِ خشن",
    color: "خاکِ رسیِ سرخ",
    colorHex: "#a05a36",
    description:
      "خاکِ رسیِ سرخ با دانه‌بندیِ محسوس؛ نزدیک‌ترین نمونه‌ی گالری به خاکِ خام.",
    image: pexelsPhoto(6104931, "خاکِ رسیِ سرخ با بافتِ دانه‌ای", 1700, true),
    sortOrder: 60,
    wood: "smoked",
    mount: "wide",
  },
  {
    id: 7,
    slug: "olive-stone",
    name: "سنگِ زیتونی",
    category: "پتینه",
    finish: "پتینه‌ی کهنه",
    color: "زیتونیِ تیره",
    colorHex: "#3d5a43",
    description:
      "زیتونیِ تیره با سایه‌روشنِ کهنه؛ پرداختی که گذرِ زمان در آن خوانده می‌شود.",
    image: pexelsPhoto(6127318, "دیوارِ سبزِ کهنه با لکه‌های روشنِ پتینه"),
    sortOrder: 70,
    wood: "walnut",
    mount: "double",
  },
  {
    id: 8,
    slug: "smoke-grey",
    name: "دودِ خاکستری",
    category: "صیقلی",
    finish: "صیقلیِ نرم",
    color: "دودیِ خاکستری",
    colorHex: "#8e8982",
    description:
      "خاکستریِ دودی با بازتابِ ملایم؛ رگه‌های محو حرکت ماله در آن خوانده می‌شود.",
    image: pexelsPhoto(6788341, "دیوارِ بتنیِ خاکستری با ترک‌ها و خراش‌های ظریف"),
    sortOrder: 80,
    wood: "oak",
    mount: "slim",
  },
];
