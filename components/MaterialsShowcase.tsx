import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

import InstagramCta from "@/components/InstagramCta";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONFIG,
  formatProductCount,
  formatProductNumber,
  getCatalogHref,
  getCategoryCounts,
  getAllProducts,
  toPersianDigits,
} from "@/content/products";

/**
 * The catalogue's block on the home page.
 *
 * An index of what the studio actually offers for application — materials,
 * tools, practice kits and sample panels — presented as four wide plates with
 * their own copy, and one way out: into the catalogue at `/products`. It reads as
 * a room of the site rather than a shop window, which is why it stays on the warm
 * ivory ground the studio and the selected work already use.
 *
 * ── WHY THE CARDS ARE SHELVES, NOT PRODUCTS ────────────────────────────────
 * Four products picked off the shelves would be an arbitrary edit. The four
 * shelves are the real structure of the catalogue, they never go stale as stock
 * changes, and each one links to its own filtered view
 * (`/products?category=...`) — so the block is a table of contents, and the count
 * on each card is the live number of products behind it.
 *
 * ── WHAT IT DOES NOT DO ────────────────────────────────────────────────────
 * No prices, no "buy now", no badge claiming a discount. The section's commercial
 * action is one Instagram button and one plain sentence saying that availability
 * and ordering are handled in a direct message — the same honest route the
 * academy's collection already takes.
 *
 * The section is a Server Component and stays one: nothing in it is interactive,
 * so it ships no JavaScript of its own and the reveal system the home page has
 * already mounted does the rest.
 *
 * ── WHY `dir="rtl"` IS DECLARED HERE ───────────────────────────────────────
 * The document stays LTR — that is the site's own convention, carried over from
 * the reference — and every block of unmixed Persian prose declares its own
 * direction, exactly as the magazine's and the academy's sections do. This
 * section is such a block, so its paragraphs align to the right and its rows (the
 * two actions, the four shelves) read from the right, which is the order the copy
 * is written in.
 */
export default function MaterialsShowcase() {
  const { section, labels } = PRODUCT_CONFIG;
  const total = getAllProducts().length;
  const counts = getCategoryCounts();
  const countOf = (id: string) => counts.find((entry) => entry.category.id === id)?.count ?? 0;

  return (
    <section id="products" className="mats" dir="rtl" aria-labelledby="mats-title">
      <div className="mats-inner">
        <div className="mats-head">
          <div className="mats-head-title">
            <span className="eyebrow mats-eyebrow" data-reveal="fade-up">
              {section.eyebrow}
            </span>

            <h2
              className="mats-title mask-title"
              id="mats-title"
              data-reveal="mask-line"
              data-delay="120"
            >
              <span className="line">
                <span>{section.title}</span>
              </span>
            </h2>

            {/* The Latin shelf names, set as an ornament rather than as a claim:
                they repeat the heading in the trade's own language. */}
            <p className="mats-latin" aria-hidden="true">
              {section.latinNote}
            </p>
          </div>

          <div className="mats-head-copy">
            <p className="mats-lede" data-reveal="fade-up" data-delay="200">
              {section.intro.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </p>

            <div className="mats-actions" data-reveal="fade-up" data-delay="280">
              <Link className="mats-all" href="/products">
                <span>{section.ctaLabel}</span>
                <span className="mats-all-count">{formatProductCount(total)}</span>
                <span className="mats-all-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M4 12h16" />
                    <path d="M14 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>

              <InstagramCta label={section.instagramCtaLabel} className="prd-btn prd-btn-ghost" />
            </div>

            <p className="mats-note" data-reveal="fade-up" data-delay="340">
              {section.instagramNote}
            </p>
          </div>
        </div>

        <ul className="mats-grid" aria-label={section.name}>
          {PRODUCT_CATEGORIES.map((category, index) => (
            <li
              className="mats-card"
              key={category.id}
              data-reveal="fade-up"
              data-delay={String(120 + index * 90)}
            >
              <div className="mats-card-media">
                <Image
                  src={category.image.src}
                  alt={category.image.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 960px) 48vw, 55vw"
                  style={{ objectFit: "cover" }}
                />
                <span className="mats-card-veil" aria-hidden="true" />

                {category.image.placeholder ? (
                  <span className="mats-card-badge">{labels.placeholder}</span>
                ) : null}

                <span className="mats-card-no" aria-hidden="true">
                  {formatProductNumber(index)}
                </span>
              </div>

              <div className="mats-card-body">
                <h3 className="mats-card-title">{category.title}</h3>
                <p className="mats-card-desc">{category.description}</p>

                <Link
                  className="mats-card-link"
                  href={getCatalogHref(category.id)}
                  aria-label={`${section.browseLabel} — ${category.title}`}
                >
                  <span className="mats-card-link-label">{section.browseLabel}</span>
                  <span className="mats-card-count" aria-hidden="true">
                    {toPersianDigits(countOf(category.id))}
                  </span>
                  <span className="mats-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M4 12h16" />
                      <path d="M14 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Without scripting the section never receives `is-in` and would stay
          hidden; reveal it outright instead. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".mats [data-reveal]{opacity:1!important;transform:none!important}" +
              ".mats .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </section>
  );
}
