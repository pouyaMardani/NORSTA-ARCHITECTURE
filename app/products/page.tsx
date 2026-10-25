import Image from "next/image";
import Link from "next/link";

import InstagramCta from "@/components/InstagramCta";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONFIG,
  formatProductCount,
  formatProductNumber,
  getAllProducts,
  getCategory,
  getProductsByCategory,
  parseProductCategory,
} from "@/content/products";

/**
 * The catalogue.
 *
 * Three bands, in the order a visitor actually needs them:
 *
 *   A. the hero      — what is on these shelves, and the one way to order;
 *   B. the catalogue — the filter row and the grid, which is the page's content;
 *   C. the help band — one plain offer to talk before ordering.
 *
 * ── FILTERING ──────────────────────────────────────────────────────────────
 * The category lives in the URL (`/products?category=tools`), not in client
 * state: the grid arrives already narrowed, the page stays a Server Component,
 * and a filtered shelf is shareable, bookmarkable and correct on reload — the
 * same contract the magazine's archive uses. A parameter that names no shelf the
 * catalogue stocks is treated as an unknown address and says so, rather than
 * quietly showing everything.
 *
 * ── THE HERO'S COMPOSITION ─────────────────────────────────────────────────
 * The four shelves' plates, set as a mosaic beside the copy: the catalogue's own
 * structure, drawn from the same records the grid below it uses, so it cannot
 * fall out of step with what is actually on the page.
 *
 * ── WHAT IS NOT HERE ───────────────────────────────────────────────────────
 * No cart, no checkout, no payment form, no price, no stock figure. The catalogue
 * ends in a conversation, and both of the page's buttons say exactly that.
 */
type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const raw = params.category;
  const value = Array.isArray(raw) ? raw[0] : raw;

  const active = parseProductCategory(value);
  /** A URL that names a shelf nobody stocks: say so instead of showing all. */
  const unknownCategory = Boolean(value) && !active;

  const products = unknownCategory
    ? []
    : active
      ? getProductsByCategory(active)
      : getAllProducts();

  const { page, labels } = PRODUCT_CONFIG;

  /**
   * What the grid is called, as opposed to what the section is called.
   *
   * The section's heading is the catalogue's name; giving the list the same words
   * would make a screen reader hear the name twice in a row. Naming the list by
   * what it currently holds says something instead.
   */
  const gridLabel = active ? `${page.name} — ${getCategory(active).label}` : page.name;

  return (
    <div className="prd-page" dir="rtl">
      <header className="prd-hero">
        <div className="prd-hero-copy">
          <span className="eyebrow prd-eyebrow" data-reveal="fade-up">
            {page.eyebrow}
          </span>

          <h1 className="prd-hero-title mask-title" data-reveal="mask-line" data-delay="120">
            {page.titleLines.map((line) => (
              <span className="line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <p className="prd-hero-lede" data-reveal="fade-up" data-delay="240">
            {page.lede}
          </p>

          <div className="prd-hero-actions" data-reveal="fade-up" data-delay="330">
            <InstagramCta label={labels.inquiry} />

            <a className="prd-btn prd-btn-ghost" href="#catalog">
              {labels.filterAll}
            </a>
          </div>

          <p className="prd-hero-note" data-reveal="fade-up" data-delay="420">
            {page.orderNote}
          </p>
        </div>

        {/* The catalogue's own four shelves, in the catalogue's own order. */}
        <ul className="prd-hero-mosaic" aria-hidden="true">
          {PRODUCT_CATEGORIES.map((category, index) => (
            <li className="prd-hero-plate" key={category.id}>
              <Image
                src={category.image.src}
                alt=""
                fill
                priority={index === 0}
                sizes="(max-width: 860px) 46vw, 26vw"
                style={{ objectFit: "cover" }}
              />
              <span className="prd-hero-plate-no">{formatProductNumber(index)}</span>
            </li>
          ))}
        </ul>
      </header>

      <section className="prd-catalog" id="catalog" aria-labelledby="prd-catalog-title">
        <header className="prd-catalog-head">
          <span className="eyebrow prd-eyebrow" data-reveal="fade-up">
            {page.catalogEyebrow}
          </span>

          <h2
            className="prd-catalog-title mask-title"
            id="prd-catalog-title"
            data-reveal="mask-line"
            data-delay="120"
          >
            <span className="line">
              <span>{page.name}</span>
            </span>
          </h2>
        </header>

        <ProductFilters active={active} />

        <p className="prd-count">
          {active ? (
            <>
              <span className="prd-count-cat">{getCategory(active).label}</span>
              {` · ${formatProductCount(products.length)}`}
            </>
          ) : (
            formatProductCount(products.length)
          )}
        </p>

        {products.length > 0 ? (
          <ProductGrid products={products} label={gridLabel} />
        ) : (
          <div className="prd-empty">
            <p>{labels.empty}</p>
            <Link className="prd-empty-link" href="/products">
              {labels.emptyReset}
            </Link>
          </div>
        )}
      </section>

      <section className="prd-help" aria-labelledby="prd-help-title">
        <div className="prd-help-copy">
          <span className="eyebrow prd-eyebrow" data-reveal="fade-up">
            {page.helpEyebrow}
          </span>

          <h2
            className="prd-help-title mask-title"
            id="prd-help-title"
            data-reveal="mask-line"
            data-delay="120"
          >
            <span className="line">
              <span>{page.helpTitle}</span>
            </span>
          </h2>

          <p className="prd-help-body" data-reveal="fade-up" data-delay="200">
            {page.helpBody}
          </p>
        </div>

        <div className="prd-help-action" data-reveal="fade-up" data-delay="280">
          <InstagramCta label={labels.inquiry} />
        </div>
      </section>
    </div>
  );
}
