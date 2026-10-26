import Image from "next/image";

import { PROJECT_IMAGES } from "@/content/projects";
import { WHATSAPP_CONFIGURED, WHATSAPP_URL } from "@/lib/contact";
import {
  PRODUCTION_SITE_URL,
  SITE_INSTAGRAM_HANDLE,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
} from "@/lib/site";

/**
 * Norsta Connection — the closing act of the home page.
 *
 * The previous version of this section laid Persian type over a single
 * photographic plate. This one composes its own stage out of the studio's own
 * stills and then states the two ways to reach the studio:
 *
 *   head   — the statement, its standfirst and the studio's own address;
 *   stage  — one architectural photograph with a material chip hung off its
 *            lower corner and a surface study off its upper one, and a phone
 *            holding six frames of the feed;
 *   paths  — the Instagram profile and the WhatsApp line, as two entries in the
 *            composition (hairline, index, title, action) rather than cards.
 *
 * ── THE ANCHOR AND THE DIRECTION ───────────────────────────────────────────
 * `id="instagram"` is kept: the header's link to `#instagram` resolves to this
 * section, and moving it would break that jump. `dir="rtl"` is declared here
 * rather than on the page, the same arrangement `About`, `AcademyPromo`,
 * `Articles` and `MaterialsShowcase` use: the shell stays LTR and this block,
 * which is unmixed Persian prose, sets its own direction.
 *
 * ── THE TWO CHANNELS, AND WHAT EACH ONE IS ALLOWED TO PROMISE ──────────────
 * The Instagram profile is a fact: the handle is named once in `lib/site.ts`
 * and this section reads it, so the link cannot drift from the contact block,
 * the academy's enquiry or the `Organization` node.
 *
 * The WhatsApp line is not published yet. The number is a single constant in
 * `lib/contact.ts`, and `WHATSAPP_URL` is `null` until a real one is set —
 * which is why the entry below renders its quiet "not published yet" state
 * instead of a link: no path here can build a `wa.me` address out of a
 * placeholder, and no invented number is printed anywhere.
 *
 * ── HONESTY ABOUT THE IMAGERY ──────────────────────────────────────────────
 * Every photograph is one of the studio's own published stills, named in
 * `content/projects` and imported from there so no path is spelled twice. The
 * phone is a drawn mockup, not a screenshot: it carries no follower count, no
 * likes and no invented bio, only the studio's mark, its handle and one true
 * line about the practice — so it is marked `role="img"` with a description
 * while its screen is hidden from assistive technology. The two chips keep
 * their real alt text, because they are photographs a reader may want to know
 * about.
 */
export default function InstagramShowcase() {
  /**
   * The frames the phone's grid shows: the studio's nine published stills, then
   * the three newest of them again. A feed posts a series rather than a sample
   * of everything, so the last row repeating the first frames is what a feed
   * looks like — and it is honest where inventing a tenth photograph would not
   * be. Every one of them is named in `content/projects`, cropped to the 4/5
   * measure the site's own plates are cut to.
   */
  const feed = [
    PROJECT_IMAGES.culturalCenter,
    PROJECT_IMAGES.residence,
    PROJECT_IMAGES.headquarters,
    PROJECT_IMAGES.teaPavilion,
    PROJECT_IMAGES.teaPavilionDetail,
    PROJECT_IMAGES.courtyard,
    PROJECT_IMAGES.stairs,
    PROJECT_IMAGES.archDetail,
    PROJECT_IMAGES.villa,
    PROJECT_IMAGES.residence,
    PROJECT_IMAGES.stairs,
    PROJECT_IMAGES.courtyard,
  ];

  /** Three of those frames again, as the strip that closes the Instagram entry. */
  const strip = [PROJECT_IMAGES.residence, PROJECT_IMAGES.stairs, PROJECT_IMAGES.courtyard];

  /** The plate the composition is built around. */
  const plate = PROJECT_IMAGES.culturalCenter;

  /** A chat link, or `null` while `lib/contact.ts` holds no usable number. */
  const whatsApp = WHATSAPP_URL;

  return (
    <section id="instagram" className="conn" dir="rtl" aria-labelledby="conn-title">
      {/* Light on plaster, drawn rather than photographed: two warm washes and
          a hairline striation, all of them under 3% ink. */}
      <div className="conn-ground" aria-hidden="true" />

      <div className="conn-head">
        <div className="conn-head-main">
          <span className="eyebrow conn-eyebrow" data-reveal="fade-up">
            ارتباط نورستا
          </span>

          <h2
            id="conn-title"
            className="conn-title mask-title"
            data-reveal="mask-line"
            data-delay="120"
          >
            <span className="line">
              <span>ارتباطی به وسعت</span>
            </span>
            <span className="line">
              <span>یک فضا</span>
            </span>
          </h2>
        </div>

        <div className="conn-head-aside">
          <p className="conn-lede" data-reveal="fade-up" data-delay="240">
            از جزئیات متریال تا پروژههای اجراشده، همراه نورستا باش؛ برای انتخاب
            متریال، استعلام یا شروع یک همکاری، مستقیم با ما در ارتباط باش.
          </p>

          <p className="conn-domain" data-reveal="fade-up" data-delay="340">
            <span className="conn-domain-label">وبسایت استودیو</span>
            <span className="conn-domain-value">
              {PRODUCTION_SITE_URL.replace(/^https?:\/\//, "")}
            </span>
          </p>
        </div>
      </div>

      <div className="conn-stage">
        <div className="conn-plate" data-reveal="image-reveal">
          {/* The plate's own silhouette, displaced behind it — the studio's
              ghost frame, the device the studio block and the project cards
              use, at this composition's own radius. */}
          <span className="conn-plate-ghost" aria-hidden="true" />

          <div className="conn-plate-matt">
            <figure className="conn-plate-frame">
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="(max-width: 680px) 90vw, (max-width: 1100px) 68vw, 58vw"
                style={{ objectFit: "cover" }}
              />
            </figure>
          </div>

          <span className="conn-plate-caption">
            <span className="conn-plate-label">{plate.caption}</span>
          </span>

          {/* A material chip, hung off the photograph's lower corner. */}
          <div className="conn-tile conn-tile--materials">
            <Image
              src={PROJECT_IMAGES.teaPavilionDetail.src}
              alt={PROJECT_IMAGES.teaPavilionDetail.alt}
              fill
              sizes="(max-width: 680px) 30vw, 12vw"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* A narrow surface study, higher up and further out. */}
          <div className="conn-tile conn-tile--surface">
            <Image
              src={PROJECT_IMAGES.archDetail.src}
              alt={PROJECT_IMAGES.archDetail.alt}
              fill
              sizes="(max-width: 680px) 26vw, 10vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* A drawn mockup: the mark, the handle and one true line — no counts,
            no likes, no invented copy. */}
        <div
          className="conn-phone"
          role="img"
          aria-label="گوشیای که صفحهی اینستاگرام نورستا را نشان میدهد"
          data-reveal="fade-up"
          data-delay="220"
        >
          <div className="conn-phone-body">
            <span className="conn-phone-cam" aria-hidden="true" />

            <div className="conn-phone-screen" aria-hidden="true">
              <p className="conn-screen-head">
                <span className="conn-screen-mark">{SITE_NAME}</span>
                <span className="conn-screen-handle">{`@${SITE_INSTAGRAM_HANDLE}`}</span>
              </p>

              {/* A profile row, drawn rather than copied: the studio's own
                  photograph as the avatar, the name the sections of this site
                  already use, and what the practice is. No follower count, no
                  post count — those are numbers this site does not know. */}
              <p className="conn-screen-id">
                <span className="conn-screen-avatar">
                  <Image
                    src={PROJECT_IMAGES.courtyard.src}
                    alt=""
                    fill
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                  />
                </span>
                <span className="conn-screen-names">
                  <span className="conn-screen-name">نورستا</span>
                  <span className="conn-screen-craft">میکروسمنت و پتینه</span>
                </span>
              </p>

              {/* One tab, named for what the grid below it is. */}
              <p className="conn-screen-tabs">
                <span className="conn-screen-tab">پستها</span>
              </p>

              <div className="conn-screen-grid">
                {feed.map((frame, index) => (
                  <span className="conn-screen-tile" key={`${frame.src}-${index}`}>
                    <Image
                      src={frame.src}
                      alt=""
                      fill
                      sizes="(max-width: 680px) 14vw, 84px"
                      style={{ objectFit: "cover" }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="conn-paths">
        <article className="conn-path conn-path--instagram">
          <span className="conn-path-index" aria-hidden="true">
            ۰۱
          </span>

          <div className="conn-path-main">
            <p className="conn-path-kicker">
              <svg
                className="conn-path-glyph"
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
              اینستاگرام
            </p>

            <h3 className="conn-path-title">دنیای نورستا در اینستاگرام</h3>

            <p className="conn-path-copy">
              پروژهها، جزئیات اجرا و بافت متریالها را همانطور که در کارگاه پیش
              میروند ببین.
            </p>

            <p className="conn-handle">
              {/* One Latin run inside an RTL block: `dir` keeps «@norsta.home» in
                  reading order, the way every Persian block here declares its own
                  direction (the page shell stays LTR). */}
              <span dir="ltr">{`@${SITE_INSTAGRAM_HANDLE}`}</span>
            </p>

            <a
              className="conn-cta conn-cta--solid"
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="conn-cta-label">مشاهده صفحه اینستاگرام</span>
              <svg
                className="conn-cta-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M16.5 16.5 7.5 7.5" />
                <path d="M7.5 15V7.5H15" />
              </svg>
            </a>
          </div>

          {/* The same three frames the phone opens with: a rhyme, not a second
              piece of information, so it is hidden from assistive technology. */}
          <div className="conn-strip" aria-hidden="true">
            {strip.map((frame) => (
              <span className="conn-strip-frame" key={frame.src}>
                <Image
                  src={frame.src}
                  alt=""
                  fill
                  sizes="(max-width: 680px) 26vw, 78px"
                  style={{ objectFit: "cover" }}
                />
              </span>
            ))}
          </div>
        </article>

        <article className="conn-path conn-path--whatsapp">
          <span className="conn-path-index" aria-hidden="true">
            ۰۲
          </span>

          <div className="conn-path-panel">
            <p className="conn-path-kicker">
              <svg
                className="conn-path-glyph"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M20.5 12.1c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.43L4.2 20.6l1.32-3.62A7 7 0 0 1 3.5 12.1C3.5 8.1 7.3 5 12 5s8.5 3.1 8.5 7.1Z" />
                <circle cx="8.6" cy="12.1" r=".95" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12.1" r=".95" fill="currentColor" stroke="none" />
                <circle cx="15.4" cy="12.1" r=".95" fill="currentColor" stroke="none" />
              </svg>
              واتساپ
              <span className="conn-status">
                {WHATSAPP_CONFIGURED ? "آمادهی گفتوگو" : "بهزودی"}
              </span>
            </p>

            <h3 className="conn-path-title">مستقیم با ما در ارتباط باش</h3>

            <p className="conn-path-copy">
              برای انتخاب متریال، سفارش محصولات یا هماهنگی دربارهی پروژهات پیام
              بده تا در کوتاهترین زمان پاسخ بگیری.
            </p>

            {whatsApp ? (
              <a
                className="conn-cta conn-cta--outline"
                href={whatsApp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="conn-cta-label">گفتوگو در واتساپ</span>
                <svg
                  className="conn-cta-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path d="M16.5 16.5 7.5 7.5" />
                  <path d="M7.5 15V7.5H15" />
                </svg>
              </a>
            ) : (
              /* The line is not open yet, so this is not a button with nothing
                 behind it: it is the slot the number will be published in, with
                 the live route named beside it. */
              <p className="conn-pending">
                شمارهی واتساپ استودیو هنوز منتشر نشده است؛ تا آن زمان، از طریق
                اینستاگرام در دسترس ما هستی.
              </p>
            )}
          </div>
        </article>
      </div>

      {/* Without scripting the section never receives `is-in` and would stay
          hidden; reveal it outright instead. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".conn [data-reveal]{opacity:1!important;transform:none!important}" +
              ".conn .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </section>
  );
}
