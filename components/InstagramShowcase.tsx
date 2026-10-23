import Image from "next/image";

/**
 * Instagram showcase.
 *
 * The reference composition is a photographic scene — a phone propped against a
 * chiselled stone slab in a plastered studio — with the Persian copy sitting on
 * the wall beside it.
 *
 * `public/images/instagram-scene.png` is that scene with the reference's own
 * baked-in copy and CTA painted out (see `scripts/make-instagram-assets.mjs`),
 * so everything below is real markup drawn over the plate: the copy, the
 * heading and the call to action are text and a link, while the phone, its
 * screen, the contact shadow, the stone and the wall all stay photographic.
 *
 * The plate is never cropped on desktop (`.ig-stage` keeps its 1312x793 aspect
 * ratio), so the percentages in `globals.css` — measured against the reference
 * pixels — land on the wall exactly where the reference put them at any width.
 */
export default function InstagramShowcase() {
  return (
    <section id="instagram" className="ig">
      <div className="ig-copy">
        <span className="eyebrow" data-reveal="fade-up">
          06 &nbsp;&nbsp; اینستاگرام
        </span>

        <h2 className="mask-title" data-reveal="mask-line" data-delay="120">
          <span className="line">
            <span>نگاهی نزدیکتر</span>
          </span>
          <span className="line">
            <span>NORSTA به دنیای</span>
          </span>
        </h2>

        <p className="ig-note" data-reveal="fade-up" data-delay="320">
          در اینستاگرام، نگاهی متفاوت به پروژهها، بافتها و جزئیات اجراهای ما
          داشته باشید؛ تجربهای بصری از فضاهایی که با میکروسمنت و پتینه جان
          گرفتهاند.
        </p>

        <a
          className="ig-cta"
          href="https://www.instagram.com/norsta.studio/"
          target="_blank"
          rel="noopener noreferrer"
          data-reveal="fade-up"
          data-delay="460"
        >
          <svg
            className="ig-cta-glyph"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5.2" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
          </svg>
          <span className="ig-cta-label">مشاهده در اینستاگرام</span>
          <svg
            className="ig-cta-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M7.5 16.5 16.5 7.5" />
            <path d="M9 7.5h7.5V15" />
          </svg>
        </a>
      </div>

      {/* Decorative: the scene carries no information the copy does not. */}
      <div
        className="ig-stage"
        role="img"
        aria-label="گوشیای که پروفایل اینستاگرام نورستا را نشان میدهد و به سکوی سنگی تکیه داده است"
      >
        <div className="ig-plate">
          <Image
            src="/images/instagram-scene.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
