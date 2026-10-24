/**
 * The three introductory lessons — the academy's whole content set for now.
 *
 * This is the only file to edit when the academy's lessons change: the
 * promotional block on the home page, the landing page at `/academy` and every
 * `/academy/<slug>` page read directly from here.
 *
 * Conventions
 * ───────────
 * • `slug`     — English keywords, kebab-case. It is the public URL, so it must
 *                stay unique and is never re-used; re-writing a lesson means
 *                editing this record, not minting a second slug.
 * • `order`    — the learning sequence, 1-based. Sorting authority for the list
 *                and for the lesson pages' prev/next.
 * • `access`   — `"free"` for all three. The badge, and nothing else, follows it.
 * • `outline`  — plain strings; the lesson page renders them as the list of what
 *                the lesson covers.
 *
 * Content note: these are proposed lesson topics, not descriptions of finished
 * videos. Each one is written as what the lesson introduces, and no record
 * claims a runtime, a recording date or a delivered outcome.
 *
 * ── Adding a video (and a duration) later ───────────────────────────────────
 * Both fields are simply absent below, which is what makes the lesson pages show
 * their own "coming soon" panel instead of an empty player. When a recording
 * exists, add it to that lesson's record and nothing else has to change:
 *
 *   video: { kind: "file", src: "/videos/lesson-01.mp4" },
 *   // or, for a provider's player page:
 *   // video: { kind: "embed", src: "https://…", title: "…" },
 *   durationMinutes: 12,
 *
 * The duration is printed only when it is set, so no runtime is ever implied for
 * a lesson nobody has timed.
 */

import { ACADEMY_IMAGES } from "./config";
import type { LessonDTO } from "./types";

export const LESSONS: LessonDTO[] = [
  {
    id: 1,
    slug: "what-is-microcement",
    order: 1,
    title: "میکروسمنت چیست؟",
    summary:
      "پوششی معدنی و بسیار نازک که روی سطحهای موجود مینشیند و سطحی یکپارچه و بیدرز میسازد. در این درس، ماهیت متریال و ظرفیتهای بصری آن را میشناسید.",
    description:
      "میکروسمنت یک روکش معدنی نازک است، نه یک ساختار؛ کاری که انجام میدهد این است که سطح را یکپارچه، بیدرز و آرام کند. این درس از همین تعریف شروع میشود و نشان میدهد متریال در عمل چه رفتاری دارد، کجا انتخاب درستی است و چه ظرفیت بصریای در رنگ و بافت پیش پای شما میگذارد.",
    outline: [
      "میکروسمنت چیست و چه تفاوتی با بتن و سیمان تزئینی دارد",
      "ویژگیهای اصلی: ضخامت کم، سطح پیوسته و بیدرز",
      "کاربردها؛ از دیوار و کف تا پله و سطحهای منحنی",
      "ظرفیتهای بصری: رنگ، بافت و پرداخت‌های مختلف",
      "چه انتظاری از این متریال منطقی است و چه انتظاری نیست",
    ],
    coverImage: ACADEMY_IMAGES.microcementDetail,
    access: "free",
    seoTitle: "میکروسمنت چیست؟ درس آغازین آکادمی نورستا",
    seoDescription:
      "درس آغازین آکادمی میکروسمنت نورستا: میکروسمنت چیست، چه ویژگیهایی دارد، کجا به کار می‌آید و چه ظرفیت بصری‌ای در رنگ و بافت سطح می‌سازد.",
  },
  {
    id: 2,
    slug: "tools-and-materials",
    order: 2,
    title: "آشنایی با ابزار و متریال",
    summary:
      "پیش از شروع اجرا، باید بدانید با چه چیزی کار میکنید. این درس ابزارها و متریال رایج کارگاه میکروسمنت را معرفی میکند.",
    description:
      "کیفیت نهایی سطح، پیش از هر چیز به شناخت ابزار و متریال وابسته است. این درس همان فهرست کاربردی کارگاه را پیش میگذارد: ابزارهای پخش و پرداخت، پرایمرها و لایههای پایه، و نقش سیلر در رفتار روزمرهی سطح؛ تا بدانید هر قطعه به چه کاری میآید.",
    outline: [
      "ابزارهای پخش، مالهکشی و پرداخت و کاربرد هرکدام",
      "پرایمر، لایهی پایه و لایههای میانی؛ وظیفهی هر لایه",
      "سیلر و نقش آن در رفتار نهایی سطح",
      "شناخت وسایل ایمنی و آماده نگه داشتن محیط کار",
      "اشتباههای رایج در انتخاب ابزار و متریال",
    ],
    coverImage: ACADEMY_IMAGES.materials,
    access: "free",
    seoTitle: "ابزار و متریال میکروسمنت | درس آغازین آکادمی نورستا",
    seoDescription:
      "معرفی ابزار و متریال میکروسمنت: ابزارهای پخش و پرداخت، پرایمر، لایه‌های پایه و میانی، نقش سیلر و اشتباه‌های رایج در انتخاب آن‌ها.",
  },
  {
    id: 3,
    slug: "substrate-preparation",
    order: 3,
    title: "آمادهسازی زیرکار و شروع اجرا",
    summary:
      "بیشتر نتیجهی نهایی در همین مرحله تعیین میشود. در این درس اهمیت زیرکار سالم و آماده، و نخستین گامهای اجرا را میبینید.",
    description:
      "میکروسمنت درمانگر زیرکار نیست؛ هرچه زیرکار بگوید، سطح بازگو میکند. این درس روی همان مرحلهای تمرکز دارد که بیشترین اثر را بر نتیجهی نهایی دارد: از بازرسی و آمادهسازی بستر و کنترل رطوبت تا گامهای نخست اجرا و ترتیبی که کار را قابل پیشبینی میکند.",
    outline: [
      "بازرسی بستر: ترک، لرزش، تراز و رطوبت",
      "تمیزکاری و آمادهسازی سطح پیش از پرایمر",
      "چرا آمادهسازی زیرکار بیشترین سهم را در نتیجه دارد",
      "نخستین گامهای اجرا و ترتیب کار",
      "شرایطی که باید پیش از شروع، متوقف شد",
    ],
    coverImage: ACADEMY_IMAGES.substrate,
    access: "free",
    seoTitle: "آماده‌سازی زیرکار و شروع اجرا | درس آغازین آکادمی نورستا",
    seoDescription:
      "درس سوم آکادمی میکروسمنت نورستا: بازرسی و آماده‌سازی زیرکار، کنترل رطوبت و تراز، آماده‌سازی سطح پیش از پرایمر و نخستین گام‌های اجرا.",
  },
];
