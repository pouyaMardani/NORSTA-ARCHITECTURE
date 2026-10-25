/**
 * The material library's records.
 *
 * This is the only file that describes a sample. Add one entry and the wall grows
 * a frame; change `sortOrder` and the wall re-orders; delete an entry and the
 * grid closes the gap on its own — the gallery, the filter row, the frame
 * variants and the zoom viewer all read this list and nothing else.
 *
 * ── THE STARTER LABELS ─────────────────────────────────────────────────────
 * The names, finishes and colours below are the studio's *editable starters*:
 * short, descriptive, Persian words chosen so the library reads as a real
 * material wall from the first minute. They are not product names and they
 * describe an appearance only — no record states a technical property of the
 * material, because the studio has not published any yet. Replace them
 * word-for-word with the studio's own names whenever they exist.
 *
 * ── THE PHOTOGRAPHS ────────────────────────────────────────────────────────
 * Real close-ups of these finishes do not exist in the repository yet, so every
 * record points at a temporary plate built by `placeholderImage()` — a tinted
 * image that says «تصویر موقت» on its face. To publish a real photograph: add it
 * under `public/images/samples/`, then replace the record's `image` with
 *
 *   image: { src: "/images/samples/sand-light.png", width: 1600, height: 2000,
 *            alt: "سطح ماسه‌ای روشن با بافت ریز" },
 *
 * No component or stylesheet change is needed — the frame, its 4/5 crop and the
 * zoom viewer take whatever image the record names.
 *
 * ── THE FRAMES ─────────────────────────────────────────────────────────────
 * `wood` and `mount` are the curator's knobs: they vary the frame the sample
 * hangs in without touching the grid, which is how the wall reads as a
 * collection rather than as a row of equal tiles. Both are optional — a record
 * that omits them simply gets the oak-and-slim default.
 */

import { placeholderImage } from "./config";

import type { SampleDTO } from "./types";

export const SAMPLES: SampleDTO[] = [
  {
    id: 1,
    slug: "sand-light",
    name: "ماسه‌ی روشن",
    category: "مات",
    finish: "مات مخملی",
    color: "ماسه‌ای روشن",
    colorHex: "#cfc0a8",
    description:
      "پرداختی کم‌رنگ با دانه‌بندی ریز؛ زمینه‌ای آرام برای دیوارهایی که باید در سایه بمانند.",
    image: placeholderImage("sand-light", "نمونه‌ی موقت سطح ماسه‌ای روشن"),
    featured: true,
    sortOrder: 10,
    wood: "oak",
    mount: "slim",
  },
  {
    id: 2,
    slug: "almond-matte",
    name: "بادامِ مات",
    category: "مات",
    finish: "مات نرم",
    color: "بادامی گرم",
    colorHex: "#cbb094",
    description:
      "تُنی گرم و مات با بازتابِ کم؛ سطحی که نور را در خود نگه می‌دارد و آن را بازنمی‌گرداند.",
    image: placeholderImage("almond-matte", "نمونه‌ی موقت سطح بادامی گرم"),
    featured: true,
    sortOrder: 20,
    wood: "walnut",
    mount: "wide",
  },
  {
    id: 3,
    slug: "chalk-white",
    name: "سفید گچی",
    category: "نیمه‌صیقلی",
    finish: "نیمه‌صیقلی ری‌زدانه",
    color: "سفید گچی",
    colorHex: "#e2dccf",
    description:
      "روشن‌ترین نمونه‌ی گالری؛ سطحی یک‌دست با پرداختی نیمه‌مات و لکه‌های بسیار کم‌رنگ.",
    image: placeholderImage("chalk-white", "نمونه‌ی موقت سطح سفید گچی"),
    featured: true,
    sortOrder: 30,
    wood: "smoked",
    mount: "slim",
  },
  {
    id: 4,
    slug: "smoke-grey",
    name: "دودِ خاکستری",
    category: "صیقلی",
    finish: "صیقلی نرم",
    color: "دودی خاکستری",
    colorHex: "#9d9891",
    description:
      "خاکستریِ دودی با بازتابِ ملایم؛ رگه‌های محو حرکت ماله در آن خوانده می‌شود.",
    image: placeholderImage("smoke-grey", "نمونه‌ی موقت سطح دودی خاکستری"),
    sortOrder: 40,
    wood: "walnut",
    mount: "wide",
  },
  {
    id: 5,
    slug: "raw-earth",
    name: "خاکِ خام",
    category: "مات",
    finish: "مات خشن",
    color: "خاکی گرم",
    colorHex: "#a9927a",
    description:
      "خاکیِ گرم با بافتِ محسوس و لبه‌های آرام؛ نزدیک‌ترین نمونه‌ی گالری به خاکِ خام.",
    image: placeholderImage("raw-earth", "نمونه‌ی موقت سطح خاکی گرم"),
    sortOrder: 50,
    wood: "oak",
    mount: "double",
  },
  {
    id: 6,
    slug: "olive-stone",
    name: "سنگِ زیتونی",
    category: "پتینه",
    finish: "پتینه‌ی کهنه",
    color: "زیتونی تیره",
    colorHex: "#7d7b62",
    description:
      "زیتونیِ تیره با سایه‌روشنِ کهنه؛ پرداختی که گذرِ زمان در آن خوانده می‌شود.",
    image: placeholderImage("olive-stone", "نمونه‌ی موقت سطح زیتونی تیره"),
    featured: true,
    sortOrder: 60,
    wood: "smoked",
    mount: "wide",
  },
  {
    id: 7,
    slug: "walnut-brown",
    name: "قهوه‌ای گردویی",
    category: "پتینه",
    finish: "پتینه‌ی دودی",
    color: "قهوه‌ای گردویی",
    colorHex: "#6d4d35",
    description:
      "قهوه‌ایِ گردویی با عمقِ تیره و لکه‌های دودی؛ سطحی گرم برای نورِ کم.",
    image: placeholderImage("walnut-brown", "نمونه‌ی موقت سطح قهوه‌ای گردویی"),
    sortOrder: 70,
    wood: "walnut",
    mount: "double",
  },
  {
    id: 8,
    slug: "travertine-cream",
    name: "تراورتنِ کرم",
    category: "نیمه‌صیقلی",
    finish: "نیمه‌صیقلی مات",
    color: "کرمِ روشن",
    colorHex: "#ddd2bd",
    description:
      "کرمِ روشن با بافتِ سنگی و رگه‌های کم‌رنگ؛ ایستاده میان سفید و خاکی.",
    image: placeholderImage("travertine-cream", "نمونه‌ی موقت سطح کرم روشن"),
    sortOrder: 80,
    wood: "oak",
    mount: "slim",
  },
];
