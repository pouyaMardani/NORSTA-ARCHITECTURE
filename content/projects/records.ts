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
 *
 * The six Tehran entries (ids 5–10) are the exception, written at the owner's
 * request so the gallery reads as a full portfolio of the neighbourhoods the
 * studio works in: the locations are the ones he named, the photographs are
 * the studio's own stills from the pool above, but the client family names,
 * the completion years and the client goals in the first paragraph are
 * stand-ins he asked for — they are not taken from a project file. When the
 * real project details and photographs arrive, each record is one edit: the
 * name, the year and the goal, and the cover, are all replaced in place.
 */

import { PROJECT_IMAGES } from "./config";
import type { ProjectDTO } from "./types";

export const PROJECTS: ProjectDTO[] = [
  {
    id: 1,
    slug: "minimal-residence",
    title: "خانه‌ی مینیمال",
    category: "مسکونی",
    location: "کپنهاگ",
    completedAt: "2023",
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
      PROJECT_IMAGES.outdoorStairs,
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
    location: "شوش",
    completedAt: "2023",
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
      PROJECT_IMAGES.outdoorStairs,
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
  {
    id: 5,
    slug: "qeytarieh-villa",
    title: "ویلای قیطریه",
    category: "مسکونی",
    location: "قیطریه، تهران",
    completedAt: "2024",
    shortDescription:
      "ویلایی که با کم کردن شکل می‌گیرد: سطح‌های یکدست از تراس تا نشیمن ادامه پیدا می‌کنند و مرز میان داخل و بیرون کم‌رنگ می‌شود.",
    description: [
      "خانواده‌ی رضایی می‌خواستند ویلایی داشته باشند که نگهداری‌اش ساده باشد و در گذر فصل‌ها آرام بماند؛ سطحی یکپارچه که از تراس و استخر تا دل نشیمن ادامه پیدا کند و جایی برای درز و بند باقی نگذارد.",
      "سطح‌های بیرونی و داخلی با یک پرداخت اجرا شده‌اند تا ویلا از هر زاویه یک حجم واحد خوانده شود؛ بازشو‌های بزرگ نور غروب را تا عمق خانه می‌آورند و سایه‌ی درخت زیتون روی سطح‌های ساده می‌افتد.",
      "پلکان باغ و کف تراس با همان پرداخت ادامه پیدا می‌کنند تا مسیر حرکت در ویلا بدون قطع شدن حس شود؛ سطح در برابر آفتاب و باران تهران پایدار می‌ماند و تمیز کردنش به یک شست‌وشوی ساده محدود می‌شود.",
    ],
    coverImage: PROJECT_IMAGES.villa,
    galleryImages: [
      PROJECT_IMAGES.outdoorStairs,
      PROJECT_IMAGES.livingRoom,
      PROJECT_IMAGES.sandFinish,
    ],
    featured: true,
    seoTitle: "ویلای قیطریه؛ پروژه‌ی مسکونی",
    seoDescription:
      "ویلای قیطریه در تهران: سطح‌های یکپارچه از تراس تا نشیمن، بازشو‌های بزرگ و نوری که تا عمق خانه می‌رسد. نگاهی به تصمیم‌های طراحی این پروژه‌ی مسکونی.",
  },
  {
    id: 6,
    slug: "jordan-apartment",
    title: "آپارتمان جردن",
    category: "مسکونی",
    location: "جردن، تهران",
    completedAt: "2023",
    shortDescription:
      "آپارتمانی که با یک سطح یکدست بزرگ‌تر به نظر می‌رسد: آشپزخانه و نشیمن در یک پرداخت ادامه پیدا می‌کنند و چشم جایی برای ایستادن پیدا نمی‌کند.",
    description: [
      "خانواده‌ی کریمی یک خواسته‌ی روشن داشتند: آپارتمانی که با وجود متراژ محدود، باز و آرام حس شود و آشپزخانه‌اش در برابر زندگی روزمره‌ی یک خانواده‌ی پررفت‌وآمد دوام بیاورد؛ سطحی که لکه نگیرد و تمیز کردنش ساده باشد.",
      "آشپزخانه و نشیمن با یک پرداخت یکپارچه اجرا شده‌اند تا مرز میان کار و استراحت کم‌رنگ شود؛ جزیره‌ی مرکزی با همان سطح ساخته شده و نور پنجره‌ی کشیده روی آن می‌لغزد.",
      "حمام با همان زبان ادامه پیدا می‌کند: سطحی بدون درز که آب روی آن نمی‌ماند و رنگ کرمی‌اش در نور صبح گرم می‌شود؛ همه‌ی فضا‌ها با یک بافت خوانده می‌شوند تا آپارتمان یک خانه‌ی واحد حس شود، نه چند اتاق کنار هم.",
    ],
    coverImage: PROJECT_IMAGES.kitchen,
    galleryImages: [
      PROJECT_IMAGES.courtyard,
      PROJECT_IMAGES.surfaceDetail,
      PROJECT_IMAGES.sandFinish,
    ],
    featured: true,
    seoTitle: "آپارتمان جردن؛ پروژه‌ی مسکونی",
    seoDescription:
      "آپارتمان جردن در تهران: یک سطح یکدست از آشپزخانه تا نشیمن، جزیره‌ی مرکزی و حمامی بدون درز. نگاهی به تصمیم‌های طراحی این پروژه‌ی مسکونی.",
  },
  {
    id: 7,
    slug: "tajrish-house",
    title: "خانه‌ی تجریش",
    category: "مسکونی",
    location: "تجریش، تهران",
    completedAt: "2024",
    shortDescription:
      "خانه‌ای قدیمی که با یک پرداخت گرم جان تازه می‌گیرد: گوشه‌ها نرم می‌شوند، نور آرام می‌ماند و سطح با گذر زمان خواناتر می‌شود.",
    description: [
      "خانواده‌ی موسوی می‌خواستند خانه‌ی قدیمی‌شان را نگه دارند و در عین حال تازه‌اش کنند؛ نه تخریب و ساختن از نو، بلکه یک لایه‌ی گرم و دستی که روی خاطره‌ی خانه بنشیند و سه نسل در آن راحت باشند.",
      "گوشه‌های تیز با پرداخت نرم شده‌اند تا نور در فضا بچرخد و دیوار‌ها سایه‌ی ملایم بگیرند؛ پلکان با طاق‌های کشیده‌اش حفظ شده و سطح کرمی، گرمای چوب و نور پنجره را به هم وصل می‌کند.",
      "حمام خانه با همان پرداخت ادامه پیدا می‌کند تا خانه یک زبان واحد داشته باشد؛ سطح دستی است و در نور روز رنگ عوض می‌کند، پس خانه در ساعت‌های مختلف روز خواندنی می‌ماند.",
    ],
    coverImage: PROJECT_IMAGES.teaPavilionDetail,
    galleryImages: [
      PROJECT_IMAGES.stairArch,
      PROJECT_IMAGES.courtyard,
      PROJECT_IMAGES.surfaceDetail,
    ],
    featured: true,
    seoTitle: "خانه‌ی تجریش؛ پروژه‌ی مسکونی",
    seoDescription:
      "خانه‌ی تجریش در تهران: بازسازی یک خانه‌ی قدیمی با پرداخت گرم و دستی، گوشه‌های نرم و نوری که در فضا می‌چرخد. نگاهی به این پروژه‌ی مسکونی.",
  },
  {
    id: 8,
    slug: "tehranpars-apartment",
    title: "آپارتمان تهرانپارس",
    category: "مسکونی",
    location: "تهرانپارس، تهران",
    completedAt: "2022",
    shortDescription:
      "آپارتمانی جمع‌وجور که با کفی تیره و سطوح ساده بزرگ‌تر حس می‌شود: نشیمن برای مهمانی و برای غروب‌های آرام، هر دو، ساخته شده است.",
    description: [
      "خانواده‌ی احمدی دنبال آپارتمانی بودند که با وجود متراژ جمع‌وجور، برای مهمانی جا داشته باشد و در عین حال غروب‌های آرام در آن ممکن باشد؛ کفی تیره که همه‌ی فضا‌ها را به هم وصل کند و سطحی که جای مبلمان را مشخص نکند.",
      "کف نشیمن با یک پرداخت تیره و یکدست اجرا شده تا دیوار چوبی و پنجره‌های بزرگ روی آن بنشینند؛ آشپزخانه با همان زبان خاکستری ادامه پیدا می‌کند و نور روز روی سطح‌های ساده می‌لغزد.",
      "همه‌ی سطح‌ها بدون درز اجرا شده‌اند تا آپارتمان یک فضای پیوسته خوانده شود؛ تمیز کردن به یک دستمال ساده محدود می‌شود و سطح در برابر رفت‌وآمد روزانه پایدار می‌ماند.",
    ],
    coverImage: PROJECT_IMAGES.livingRoom,
    galleryImages: [
      PROJECT_IMAGES.archDetail,
      PROJECT_IMAGES.sandFinish,
      PROJECT_IMAGES.surfaceDetail,
    ],
    featured: true,
    seoTitle: "آپارتمان تهرانپارس؛ پروژه‌ی مسکونی",
    seoDescription:
      "آپارتمان تهرانپارس در تهران: کفی تیره و یکدست، نشیمنی برای مهمانی و غروب‌های آرام. نگاهی به تصمیم‌های طراحی این پروژه‌ی مسکونی.",
  },
  {
    id: 9,
    slug: "zaferanieh-villa",
    title: "ویلای زعفرانیه",
    category: "مسکونی",
    location: "زعفرانیه، تهران",
    completedAt: "2023",
    shortDescription:
      "ویلایی باغ‌دار که پلکان و حیاط‌اش یک سطح سنگی پیوسته‌اند: اتاقی در فضای باز که در برابر فصل‌های تهران می‌ایستد.",
    description: [
      "خانواده‌ی حسینی می‌خواستند باغ ویلا‌شان فقط یک حیاط نباشد؛ یک اتاق در فضای باز که پلکان، تراس و حیاط با یک سطح سنگی به هم وصل شوند و در برابر آفتاب تابستان و باران پاییز تهران دوام بیاورند.",
      "پلکان باغ با همان پرداخت ویلا اجرا شده تا مسیر از در ورودی تا تراس بدون قطع شدن حس شود؛ درخت زیتون کنار پلکان می‌ماند و سایه‌اش روی سطح سنگی می‌افتد.",
      "داخل ویلا با همان زبان ادامه پیدا می‌کند: حمام خاکستری با دوش شیشه‌ای و سطحی بدون درز، و طاق‌های کشیده‌ی پلکان داخلی که نور را تا عمق خانه می‌برند.",
    ],
    coverImage: PROJECT_IMAGES.outdoorStairs,
    galleryImages: [
      PROJECT_IMAGES.villa,
      PROJECT_IMAGES.stairArch,
      PROJECT_IMAGES.wetArea,
    ],
    featured: true,
    seoTitle: "ویلای زعفرانیه؛ پروژه‌ی مسکونی",
    seoDescription:
      "ویلای زعفرانیه در تهران: پلکان و حیاط با یک سطح سنگی پیوسته، اتاقی در فضای باز. نگاهی به تصمیم‌های طراحی این پروژه‌ی مسکونی.",
  },
  {
    id: 10,
    slug: "saadatabad-bathroom",
    title: "حمام سعادت‌آباد",
    category: "مسکونی",
    location: "سعادت‌آباد، تهران",
    completedAt: "2024",
    shortDescription:
      "حمامی بدون درز و بند: یک سطح یکپارچه و ضدآب که آب روی آن نمی‌ماند و رنگ دودی‌اش رد آب را نشان نمی‌دهد.",
    description: [
      "خانواده‌ی محمدی از حمام قبلی‌شان یک گلایه‌ی ساده داشتند: بند‌ها و درز‌ها. می‌خواستند حمامی که هیچ درز و بندی نداشته باشد؛ سطحی یکپارچه که آب روی آن نماند و تمیز کردنش به یک آب‌کشی ساده محدود شود.",
      "دوش با شیشه‌ی بلند و سطح خاکستری یکدست اجرا شده تا حمام مثل یک اتاق حس شود، نه یک جعبه؛ نور از پنجره‌ی بالایی می‌آید و روی سطح دودی می‌لغزد.",
      "حمام دوم خانه با همان زبان و در رنگ کرمی ادامه پیدا می‌کند تا خانه یک پرداخت واحد داشته باشد؛ سطح در برابر رطوبت پایدار می‌ماند و رنگش در گذر زمان تغییر نمی‌کند.",
    ],
    coverImage: PROJECT_IMAGES.wetArea,
    galleryImages: [
      PROJECT_IMAGES.courtyard,
      PROJECT_IMAGES.sandFinish,
      PROJECT_IMAGES.surfaceDetail,
    ],
    featured: true,
    seoTitle: "حمام سعادت‌آباد؛ پروژه‌ی مسکونی",
    seoDescription:
      "حمام سعادت‌آباد در تهران: سطحی یکپارچه و بدون درز، دوشی که مثل یک اتاق حس می‌شود. نگاهی به تصمیم‌های طراحی این پروژه‌ی مسکونی.",
  },
];
