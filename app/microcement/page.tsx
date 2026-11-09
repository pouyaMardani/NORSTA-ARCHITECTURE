import Image from "next/image";
import Link from "next/link";

import McToolbar from "@/components/microcement/McToolbar";
import NextPageBlock from "@/components/microcement/NextPageBlock";
import { formatProjectDate, getProjectBySlug } from "@/content/projects";

/**
 * The microcement landing page — Jetton's home page, rebuilt with Norsta's
 * own work.
 *
 * Jetton's structure, kept: a type-only hero with a toolbar strip; a studio
 * intro in one huge statement; four selected works as pinned full-viewport
 * images with giant titles gliding over them; a services statement in
 * staggered huge lines; and a next-page block into the Works gallery.
 *
 * Jetton's own copy and imagery are not carried over — the template belongs
 * to a Stockholm fashion studio. Every line here is the studio's own
 * published text (the hero lede, the About sub, the craftsman's bio, the
 * Applications and Process ledes) and every photograph is one of the
 * studio's own stills, through the same `PROJECT_IMAGES` pool the home page
 * uses. The four selected works are the four projects the site published
 * first; the six Tehran entries live in the gallery.
 */
const SELECTED_SLUGS = [
  "minimal-residence",
  "foundry-offices",
  "cultural-center",
  "tea-pavilion",
] as const;

export default function MicrocementPage() {
  const selected = SELECTED_SLUGS.map((slug) => getProjectBySlug(slug)).filter(
    (project): project is NonNullable<typeof project> => project !== undefined,
  );

  return (
    <>
      {/* ── Hero: type only, no image ─────────────────────────────────── */}
      <header className="mc-hero">
        <h1 className="mc-hero-title mc-display">
          <span className="mc-line">میکروسمنت؛</span>
          <span className="mc-line">سطحی یکپارچه</span>
          <span className="mc-line">که با سکوت شکل می‌گیرد</span>
        </h1>
        <div className="mc-hero-foot">
          <p className="mc-mono">
            استودیوی نورستا
            <br />
            تهران — از ۱۴۰۱
          </p>
          <p className="mc-mono">
            سطحی یکپارچه که با سکوت، وزن و گذرِ آرام نور در فضا شکل می‌گیرد.
          </p>
        </div>
        <McToolbar items={["↓ اسکرول کنید", "تیم کوچک، کار بزرگ", "از ۱۴۰۱"]} />
      </header>

      {/* ── Studio intro ──────────────────────────────────────────────── */}
      <section className="mc-intro" aria-labelledby="mc-intro-title">
        <h2 id="mc-intro-title" data-mc-reveal>
          نورستا از سال ۱۴۰۱ با میکروسمنت کار می‌کند و بیش از ۳۰ پروژه را در
          تهران به سرانجام رسانده است؛ به رهبری مهندس افسانه مردانی.
        </h2>
        <p className="mc-lede" data-mc-reveal>
          از سال ۱۴۰۱ اجرای سطح‌های یکپارچه‌ی نورستا را رهبری می‌کند. هر پروژه
          از نمونه تا تحویل با همراهی مستقیم او پیش می‌رود؛ از انتخاب رنگ و
          بافت در نور همان فضا تا آخرین لایه‌ی ماله و سیلر.
        </p>
      </section>

      {/* ── Selected works: pinned images, giant titles gliding over ──── */}
      <section aria-label="پروژه‌های منتخب">
        {selected.map((project, index) => (
          <article key={project.slug} className="mc-pin">
            <div className="mc-pin-media">
              <Image
                src={project.coverImage.src}
                alt={project.coverImage.alt}
                fill
                sizes="100vw"
                priority={index === 0}
              />
            </div>
            <div className="mc-pin-title">
              <h3>{project.title}</h3>
              <p className="mc-mono">
                مطالعه‌ی موردی — {project.category}
                {project.completedAt
                  ? ` — ${formatProjectDate(project.completedAt)}`
                  : ""}
              </p>
            </div>
            <Link
              href={`/microcement/works/${project.slug}`}
              className="mc-pin-link"
            >
              <span>{project.title} — دیدن پروژه</span>
            </Link>
          </article>
        ))}
        <Link href="/microcement/works" className="mc-works-link">
          <span>دیدن همه‌ی آثار</span>
          <span className="mc-works-link-arrow" aria-hidden="true">
            ←
          </span>
        </Link>
      </section>

      {/* ── Services statement ────────────────────────────────────────── */}
      <section className="mc-services" aria-labelledby="mc-services-title">
        <h2 id="mc-services-title" className="mc-services-lines mc-display">
          <span className="mc-line">ساختن</span>
          <span className="mc-line">سطح‌های</span>
          <span className="mc-line">یکپارچه</span>
          <span className="mc-line">که می‌مانند</span>
        </h2>
        <div className="mc-services-body" data-mc-reveal>
          <p className="mc-mono">
            سطحی یکپارچه و بی‌درز که در هر فضایی که آب، رفت‌وآمد و زندگی روزمره
            هست می‌نشیند — از کف آشپزخانه تا دیوار کافه.
          </p>
          <p className="mc-mono">
            از نخستین گفت‌وگو تا تحویل نهایی، هر گام اجرای میکروسمنت را با هم
            و با نمونه‌های واقعی جلو می‌بریم.
          </p>
        </div>
        <Link href="/#process" className="mc-services-cta">
          روند اجرای میکروسمنت ↗
        </Link>
      </section>

      {/* ── Next page: into the Works gallery ─────────────────────────── */}
      <NextPageBlock
        num="۰۲"
        title="آثار میکروسمنت"
        sub="دیدن پروژه‌ها — هر پروژه، هر فضا"
        href="/microcement/works"
        vertical="MICROCEMENT"
        label="رفتن به گالری آثار"
      />
    </>
  );
}
