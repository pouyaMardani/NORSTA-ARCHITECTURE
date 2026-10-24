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
 * This repository contains no verifiable information about a real person (no
 * name, biography, years of practice, qualifications, certifications or awards),
 * and Norsta's brand rules forbid inventing any of it. Every factual field below
 * is therefore a bracketed placeholder: replace the strings in `CRAFTSMAN`, not
 * the markup.
 *
 * The only copy that is not a placeholder is the material heading and the two
 * material tags. They name microcement and patina in general — the subject of
 * the business, already stated in the Instagram section — and make no claim
 * about a specific person or project.
 *
 * ── IMAGE ──────────────────────────────────────────────────────────────────
 * `CRAFTSMAN.image` is a stand-in plate: an authentic Norsta microcement detail
 * (`project-minimal-residence.png`, currently unused elsewhere on the page).
 * It is deliberately *not* captioned as a portrait, and its alt text describes
 * what the photograph actually shows.
 *
 * Swap the `src` for an approved photograph when one exists — no styling change
 * is needed. The composition is built from `--craft-radius` and `--craft-offset`
 * in `globals.css` (the plate and the hairline ghost frame behind it share both
 * values), and the photograph is cropped by `object-fit:cover` inside a fixed
 * `4/5` plate, so a different source image lands in exactly the same silhouette.
 *
 * ── MOTION ─────────────────────────────────────────────────────────────────
 * `data-reveal-cycle` marks the section as reversible: `SiteInteractions` adds
 * `is-in` while it overlaps the viewport and removes it again on the way out, so
 * the plate and the copy fade in and back out. `data-reveal-item` marks the
 * blocks that move. All timing values live in the stylesheet, next to the
 * existing `[data-reveal]` contract.
 */

type CraftsmanContent = {
  name: string;
  title: string;
  experience: string;
  experienceLabel: string;
  bio: string;
  image: { src: string; alt: string };
  /** Latin micro-label for the plate, set in the same face as the wordmarks. */
  label: string;
  /** Latin material tags under the plate. Decorative — they mirror the heading. */
  tags: string[];
};

const CRAFTSMAN: CraftsmanContent = {
  /** ⚠ PLACEHOLDER — the craftsman's real name. */
  name: "[نام استادکار]",
  /** ⚠ PLACEHOLDER — the craftsman's real professional title. The craft named
      here is the subject of the business, but the wording still needs the
      owner's confirmation. */
  title: "استادکار میکروسمنت و پتینه",
  /** ⚠ PLACEHOLDER — the real figure (e.g. "۱۸"). Left as a dash so that no
      number is ever implied. */
  experience: "[—]",
  experienceLabel: "سال تجربه",
  /** ⚠ PLACEHOLDER — replace with the approved biography. */
  bio: "[معرفی کوتاه: مسیر حرفه‌ای، سال‌های همکاری و رویکرد این استادکار در اجرای میکروسمنت و پتینه.]",
  image: {
    /** ⚠ PLACEHOLDER plate — swap for approved photography of the craftsman. */
    src: "/images/project-minimal-residence.png",
    alt: "جزئیات اجرای میکروسمنت در یک فضای مرطوب",
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
            <span>میکروسمنت</span>
          </span>
          <span className="line">
            <span>و پتینه</span>
          </span>
        </h2>

        <p className="craft-name" data-reveal-item>
          {CRAFTSMAN.name}
        </p>
        <p className="craft-role" data-reveal-item>
          {CRAFTSMAN.title}
        </p>
        <p className="craft-bio" data-reveal-item>
          {CRAFTSMAN.bio}
        </p>

        <div className="metrics" data-reveal-item>
          <div>
            <span className="num">{CRAFTSMAN.experience}</span>
            <span className="label">{CRAFTSMAN.experienceLabel}</span>
          </div>
        </div>

        <a className="link-underline strong" href="#contact" data-reveal-item>
          گفت‌وگو درباره‌ی اجرا &nbsp;→
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
