/**
 * The projects.
 *
 * This is the only file to edit when the gallery changes: the horizontal track
 * on the home page, every `/projects/<slug>` page and the related-projects row
 * read directly from here.
 *
 * Conventions
 * ───────────
 * • `slug`     — English keywords, kebab-case. It is the public URL, so it must
 *                stay unique and is never re-used; re-writing a project keeps
 *                its slug.
 * • `category` — must be one of `PROJECT_CATEGORIES` in `types.ts`.
 * • `coverImage` / `galleryImages` — point at `PROJECT_IMAGES` entries in
 *                `config.ts` rather than repeating a path. The cover is the
 *                card's still and the project page's hero; the gallery is the
 *                page's own sequence and does not repeat the cover.
 * • `description` — plain paragraphs, in order. No markup, no styling.
 * • `featured` — the projects the home-page gallery shows.
 *
 * Content note: only the information this project already published is kept —
 * the titles, the two locations and the years below were on the site before and
 * are carried over unchanged. Everything that was *not* available (an exact
 * completion date, a material list, a client, a measure) is left out on purpose
 * rather than guessed: `location`, `completedAt` and `materials` are optional,
 * and a project page simply omits the rows a record does not set. The
 * description paragraphs therefore stay on the level of design intent — volume,
 * light, surface and finish — and make no claim that has not been confirmed.
 * The photographs are the studio's own stills, the same ones the magazine uses,
 * because the repository ships one image per project.
 */

import { PROJECT_IMAGES } from "./config";
import type { ProjectDTO } from "./types";

export const PROJECTS: ProjectDTO[] = [
  {
    id: 1,
    slug: "minimal-residence",
    title: "خانه‌ی مینیمال",
    category: "مسکونی",
    shortDescription:
      "خانه‌ای که با کم کردن شکل می‌گیرد: سطح‌های یکدست، بازشو‌های کشیده و نوری که آرام در فضا می‌گردد.",
    description: [
      "این خانه از یک تصمیم ساده شروع می‌شود: هرچه می‌تواند ساده‌تر بماند، ساده‌تر بماند. حجم‌ها و مصالح تا آنجا کم شده‌اند که تنها سطح، نور و آستانه باقی بمانند.",
      "سطح‌های داخلی یکپارچه اجرا شده‌اند تا چشم جایی برای ایستادن روی درز‌ها پیدا نکند؛ تفکیک فضا‌ها به‌جای نقش و رنگ، با بافت و نسبت‌های حجمی انجام می‌شود.",
      "بازشو‌ها کشیده و کم‌ارتفاع گرفته شده‌اند تا نور روز نرم و بی‌واسطه تا عمق خانه برسد و مرز میان داخل و بیرون کم‌رنگ شود.",
    ],
    coverImage: PROJECT_IMAGES.residence,
    galleryImages: [
      PROJECT_IMAGES.courtyard,
      PROJECT_IMAGES.villa,
      PROJECT_IMAGES.archDetail,
    ],
    featured: true,
    seoTitle: "خانه‌ی مینیمال؛ پروژه‌ی مسکونی",
    seoDescription:
      "خانه‌ی مینیمال: سطح‌های یکپارچه، بازشو‌های کشیده و نوری که در فضا می‌گردد. نگاهی به تصمیم‌های طراحی و جزئیات اجرای این پروژه‌ی مسکونی.",
  },
  {
    id: 2,
    slug: "foundry-offices",
    title: "دفاتر ریخته‌گری",
    category: "اداری",
    location: "کپنهاگ",
    completedAt: "2023",
    shortDescription:
      "دفتری با سطوح بتنی و حجم ساده؛ فضایی که تمرکز را بر تراز‌ها، نور و کارِ روزانه می‌گذارد.",
    description: [
      "این دفتر با کمترین حرکت اضافی ساخته می‌شود: حجم ساده، نمای آرام و پلانی روشن که خودش را به رخ نمی‌کشد.",
      "سطوح بتنی و پرداخت‌های خنثی در فضای داخلی ادامه پیدا می‌کنند؛ نور از بازشو‌های بزرگ می‌آید و سایه‌ها مرز فضا‌ها را می‌سازند.",
      "لبه‌ها و اتصال‌ها ساده نگه داشته شده‌اند تا سطوح در گذر زمان خوانا بمانند و نگهداری آن‌ها ساده باشد.",
    ],
    coverImage: PROJECT_IMAGES.headquarters,
    galleryImages: [
      PROJECT_IMAGES.stairs,
      PROJECT_IMAGES.archDetail,
      PROJECT_IMAGES.courtyard,
    ],
    featured: true,
    seoTitle: "دفاتر ریخته‌گری؛ پروژه‌ی اداری",
    seoDescription:
      "دفاتر ریخته‌گری در کپنهاگ: حجم ساده، نمای آرام و سطوح بتنی. نگاهی به تصمیم‌های طراحی و جزئیات اجرای این پروژه‌ی اداری در نورستا.",
  },
  {
    id: 3,
    slug: "cultural-center",
    title: "مرکز فرهنگی",
    category: "فرهنگی",
    shortDescription:
      "حجمی سفید و کم‌حرف که با نور روز کار می‌کند: سطح‌های ساده و آستانه‌های روشن برای یک فضای عمومی.",
    description: [
      "مرکز فرهنگی از دو خواسته شکل می‌گیرد: فضایی که در طول روز روشن و آرام بماند، و حجمی که به سیمای پیرامون چیزی اضافه نکند.",
      "سطح‌های بیرونی ساده و کم‌رنگ گرفته شده‌اند تا حجم، سایه‌ی خودش را در نور نشان بدهد؛ در داخل، فضا با توالی آستانه‌ها و نور طبیعی هدایت می‌شود.",
      "بازشو‌ها و ورودی‌ها چنان چیده شده‌اند که مسیر حرکت در ساختمان بدون نشانه‌های اجباری قابل درک باشد.",
    ],
    coverImage: PROJECT_IMAGES.culturalCenter,
    galleryImages: [
      PROJECT_IMAGES.courtyard,
      PROJECT_IMAGES.stairs,
      PROJECT_IMAGES.archDetail,
    ],
    featured: true,
    seoTitle: "مرکز فرهنگی؛ پروژه‌ی عمومی",
    seoDescription:
      "مرکز فرهنگی با حجم سفید و سطح‌های ساده: فضایی عمومی که با نور روز، توالی آستانه‌ها و مسیر روشن حرکت ساخته می‌شود.",
  },
  {
    id: 4,
    slug: "tea-pavilion",
    title: "پاویون چای",
    category: "پاویون",
    location: "کیوتو",
    completedAt: "2023",
    shortDescription:
      "پاویونی سبک با بازشو‌های کشیده و جزئیات چوبی؛ فضایی برای ایستادن، نشستن و گذرِ آرام.",
    description: [
      "پاویون برای مکث ساخته شده است: فضایی کوچک که در آن نشستن، تماشای بیرون و همراهی با گذرِ آرام یک مراسم ممکن باشد.",
      "بازشو‌های کشیده ارتفاع فضا را به بیرون وصل می‌کنند و جزئیات چوبی، سطح‌های صاف مصالح را سنجیده نگه می‌دارند.",
      "پرداخت نهایی سطح‌ها دستی انجام شده تا رنگ در نور عوض شود و پاویون در ساعت‌های مختلف روز خواندنی بماند.",
    ],
    coverImage: PROJECT_IMAGES.teaPavilion,
    galleryImages: [
      PROJECT_IMAGES.teaPavilionDetail,
      PROJECT_IMAGES.courtyard,
      PROJECT_IMAGES.archDetail,
    ],
    featured: true,
    seoTitle: "پاویون چای؛ پروژه‌ی پاویون",
    seoDescription:
      "پاویون چای در کیوتو: پاویونی سبک با بازشو‌های کشیده و جزئیات چوبی؛ فضایی برای نشستن، تماشای بیرون و مکث در مسیر روز.",
  },
];
