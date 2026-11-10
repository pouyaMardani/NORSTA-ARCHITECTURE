import Image from "next/image";

import { PROJECT_IMAGES } from "@/content/projects";

/**
 * The applications — where microcement goes — rebuilt as a calm,
 * compositor-only stack:
 *
 *   · No scroll JavaScript at all. The old stack drove every card's tilt,
 *     scale, brightness and halo from a rAF scroll sync (`--cover`,
 *     `--arrive`, `--fill`), which read layout on every frame and composited
 *     3D transforms, a brightness filter and a 90px-blur glow over five
 *     full-viewport cards — the lag this rebuild removes. The new stack is
 *     pure CSS: `position: sticky` pins each card while the next slides over
 *     it, and the browser composites that with no script. This is a server
 *     component; the only motion is the site's one-time `[data-reveal]`
 *     entrance.
 *   · The boxes are a muted warm stone (`--bg-3`), clearly darker than the
 *     ivory ground but without the mustard cast the old `--bg-3` carried —
 *     a stone, not a tan — so the warm photographs sit on it rather than
 *     fight it. Each card keeps its full height (`min-height: 100svh`), so
 *     the stack still reads as a deck of full screens.
 *   · The title is plain ink now — the scroll-filled gradient went with the
 *     scroll script.
 *
 * The copy and photographs are unchanged: five places a visitor can picture
 * microcement living — cafés and restaurants, private homes and villas,
 * bathrooms, shops and complexes, kitchens — each with the surfaces it
 * covers and a few lines on why the material belongs there. The photographs
 * are the repo's own stills, each captioned for what it shows rather than
 * for a project it does not depict.
 */
type Application = {
  num: string;
  title: string;
  /** The surfaces microcement covers in this kind of space. */
  tag: string;
  /** Why the material belongs here, in a few lines. */
  desc: string;
  img: string;
  alt: string;
};

const AREAS: Application[] = [
  {
    num: "۰۱",
    title: "کافه‌ها و رستوران‌ها",
    tag: "پیشخوان، کف و دیوار",
    desc: "سطحی یکپارچه که نه درز دارد نه بند؛ روی پیشخوان و کف و دیوار می‌نشیند و با رفت‌وآمد و شست‌وشوی هر روزه کنار می‌آید. گرما و لکه را می‌پذیرد و همان می‌ماند که بود.",
    img: PROJECT_IMAGES.teaPavilion.src,
    alt: PROJECT_IMAGES.teaPavilion.alt,
  },
  {
    num: "۰۲",
    title: "خانه‌های شخصی و ویلاها",
    tag: "کف، دیوار و پله",
    desc: "از کف نشیمن تا دیوار حمام، یک سطح پیوسته که خانه را آرام و یکدست می‌کند؛ بی‌درز، بی‌صدا، و هم‌نشین چوب و سنگ و نور.",
    img: PROJECT_IMAGES.villa.src,
    alt: PROJECT_IMAGES.villa.alt,
  },
  {
    num: "۰۳",
    title: "سرویس‌های بهداشتی",
    tag: "دیوار، کف و دوش",
    desc: "جایی که آب هر روز می‌نشیند، میکروسمنت با سیلر مناسب یک سطح یکپارچه می‌سازد؛ بدون بند کاشی، بدون جایی برای نشستن رطوبت.",
    img: PROJECT_IMAGES.wetArea.src,
    alt: PROJECT_IMAGES.wetArea.alt,
  },
  {
    num: "۰۴",
    title: "فروشگاه‌ها و مجتمع‌ها",
    tag: "کف، ویترین و راهرو",
    desc: "فضاهای پررفت‌وآمد که سطحشان باید هم زیبا بماند و هم دوام بیاورد؛ میکروسمنت روی کف و دیوار، یکدست و مقاوم، با کمترین توقف برای اجرا.",
    img: PROJECT_IMAGES.livingRoom.src,
    alt: PROJECT_IMAGES.livingRoom.alt,
  },
  {
    num: "۰۵",
    title: "آشپزخانه‌ها",
    tag: "جزیره، پیشخوان و دیوار",
    desc: "سطح کار آشپزخانه که هر روز با آب و حرارت و لکه سروکار دارد؛ میکروسمنت روی جزیره و پیشخوان و دیوار یکدست می‌نشیند و تمیز کردنش یک دستمال است.",
    img: PROJECT_IMAGES.kitchen.src,
    alt: PROJECT_IMAGES.kitchen.alt,
  },
];

export default function Applications() {
  return (
    <section
      id="applications"
      className="applications"
      dir="rtl"
      aria-labelledby="applications-title"
    >
      <div className="app-head">
        <div>
          <span className="eyebrow" data-reveal="fade-up">
            کاربردهای میکروسمنت
          </span>
          <h2
            id="applications-title"
            className="app-title"
            data-reveal="fade-up"
          >
            میکروسمنت، همه‌جا
          </h2>
        </div>
        <p className="app-lede" data-reveal="fade-up" data-delay="120">
          سطحی یکپارچه و بی‌درز که در هر فضایی که آب، رفت‌وآمد و زندگی روزمره
          هست می‌نشیند — از کف آشپزخانه تا دیوار کافه.
        </p>
      </div>

      <div className="app-stack">
        {AREAS.map((area, i) => (
          <article
            key={area.num}
            className="app-item"
            style={{ zIndex: i + 1 } as React.CSSProperties}
            aria-label={`${area.num}: ${area.title}`}
          >
            <div className="app-card" data-reveal="fade-up">
              <div className="app-media">
                <Image
                  src={area.img}
                  alt={area.alt}
                  fill
                  sizes="(max-width: 680px) 100vw, 42vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="app-content">
                <span className="app-num" aria-hidden="true">
                  {area.num}
                </span>
                <h3 className="app-card-title">{area.title}</h3>
                <p className="app-tag">{area.tag}</p>
                <p className="app-desc">{area.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
