import Image from "next/image";

/**
 * Master craftsman.
 *
 * The section that introduces the craftsman behind Norsta's microcement and
 * patina work: a layered plate on the left, the person's details on the right.
 * It sits between `Work` and `Contact`, so the finished projects are followed by
 * the hands that made them, and the quiet CTA hands over to the contact block.
 *
 * ── CONTENT ────────────────────────────────────────────────────────────────
 * The name, the role and the biography below are the owner's own facts: the
 * engineer who leads Norsta's microcement and patina work is مهندس افسانه
 * مردانی, and the studio's work in the material runs from ۱۴۰۱. The three
 * figures under the biography are the site's own published numbers (founded
 * ۱۴۰۱, ۳۰+ projects, ۸ finishes), so nothing here is a guess.
 *
 * The only copy that is not a person-specific fact is the material heading and
 * the two material tags. They name microcement and patina in general — the
 * subject of the business, already stated in the Instagram section — and make
 * no claim about a specific person or project.
 *
 * ── IMAGE ──────────────────────────────────────────────────────────────────
 * `CRAFTSMAN.image` is her portrait — مهندس افسانه مردانی outdoors, beside
 * the olive tree — so the alt text names her, and the plate is captioned as
 * her portrait rather than as a material detail. The composition is built from
 * `--craft-radius` and `--craft-offset` in `globals.css` (the plate and the
 * hairline ghost frame behind it share both values), and the photograph is
 * cropped by `object-fit:cover` inside a fixed `4/5` plate, so a different
 * source image lands in exactly the same silhouette.
 *
 * ── MOTION ─────────────────────────────────────────────────────────────────
 * `data-reveal-cycle` marks the section as reversible: `SiteInteractions` adds
 * `is-in` while it overlaps the viewport and removes it again on the way out, so
 * the plate and the copy fade in and back out. `data-reveal-item` marks the
 * blocks that move. All timing values live in the stylesheet, next to the
 * existing `[data-reveal]` contract.
 */

type CraftsmanContent = {
  /** Her professional title, as the owner states it. */
  title: string;
  /** One short paragraph: who she is and how she works. */
  bio: string;
  /** The site's own published numbers, so the section never guesses. */
  metrics: { value: string; label: string }[];
  image: { src: string; alt: string };
  /** Latin micro-label for the plate, set in the same face as the wordmarks. */
  label: string;
  /** Latin material tags under the plate. Decorative — they mirror the heading. */
  tags: string[];
};

const CRAFTSMAN: CraftsmanContent = {
  /** Her role: the engineer who runs Norsta's microcement and patina work. */
  title: "مجری میکروسمنت و پتینه‌ی نورستا",
  /** The introduction, in her own section's voice: the work, and how she
      follows it from the first sample to the last coat. */
  bio: "از سال ۱۴۰۱ اجرای سطح‌های یکپارچه‌ی نورستا را رهبری می‌کند. هر پروژه از نمونه تا تحویل با همراهی مستقیم او پیش می‌رود؛ از انتخاب رنگ و بافت در نور همان فضا تا آخرین لایه‌ی ماله و سیلر.",
  metrics: [
    { value: "۱۴۰۱", label: "آغاز به کار" },
    { value: "۳۰+", label: "پروژه‌ی اجراشده" },
    { value: "۸", label: "نمونه‌ی رنگ و بافت" },
  ],
  image: {
    /** Her portrait, outdoors beside the olive tree. */
    src: "/images/craft.png",
    alt: "پرتره‌ی مهندس افسانه مردانی",
  },
  label: "CRAFT & MATERIAL",
  tags: ["MICROCEMENT", "PATINA"],
};

export default function Craftsman() {
  return (
    <section id="craft" className="craft" data-reveal-cycle>
      {/* The ghost frame is drawn first so the plate stacks over it. */}
      <div className="craft-visual" data-reveal-item>
        <div className="craft-plate">
          <span className="craft-frame" aria-hidden="true" />

          <div className="craft-figure">
            <Image
              src={CRAFTSMAN.image.src}
              alt={CRAFTSMAN.image.alt}
              fill
              sizes="(max-width: 960px) 100vw, 41vw"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Straddles the plate's lower edge, so it reads as a mounted label
              rather than as a caption sitting inside the photograph. It is a
              sibling of the frame, not of the tags, so it measures against the
              plate and never collides with the material rule below. */}
          <span className="craft-badge">
            <i aria-hidden="true" />
            {CRAFTSMAN.label}
          </span>
        </div>

        {/* Material tags repeat the heading in Latin, so they stay decorative. */}
        <p className="craft-tags" aria-hidden="true">
          {CRAFTSMAN.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>
      </div>

      <div className="craft-copy">
        <span className="eyebrow" data-reveal-item>
          استادکار
        </span>

        <h2 className="mask-title" data-reveal-item>
          <span className="line">
            <span>مهندس افسانه</span>
          </span>
          <span className="line">
            <span>مردانی</span>
          </span>
        </h2>

        <p className="craft-role" data-reveal-item>
          {CRAFTSMAN.title}
        </p>
        <p className="craft-bio" data-reveal-item>
          {CRAFTSMAN.bio}
        </p>

        <div className="metrics" data-reveal-item>
          {CRAFTSMAN.metrics.map((metric) => (
            <div key={metric.label}>
              <span className="num">{metric.value}</span>
              <span className="label">{metric.label}</span>
            </div>
          ))}
        </div>

        <a className="link-underline strong" href="#contact" data-reveal-item>
          گفت‌وگو درباره‌ی اجرا &nbsp;←
        </a>
      </div>

      {/* Without scripting the section never receives `is-in`, so it would stay
          hidden; reveal it outright instead. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".craft [data-reveal-item]{opacity:1;transform:none}" +
              ".craft .mask-title .line>span{transform:none}",
          }}
        />
      </noscript>
    </section>
  );
}
