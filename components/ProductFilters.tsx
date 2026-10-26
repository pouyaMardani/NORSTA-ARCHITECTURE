import Link from "next/link";

import {
  PRODUCT_CONFIG,
  getCatalogHref,
  getCategoryCounts,
  getAllProducts,
  toPersianDigits,
  type ProductCategoryId,
} from "@/content/products";

/**
 * Category filter for the catalogue.
 *
 * A filter here is a URL, not state: every chip is a link to
 * `/products?category=...`, the page reads the parameter on the server and the
 * grid is rendered already narrowed. That keeps `/products` a Server Component,
 * adds no client JavaScript for filtering, and makes a filtered view shareable,
 * bookmarkable and correct on a reload — the same contract the magazine's archive
 * already uses, so the catalogue behaves like the rest of the site.
 *
 * `aria-current` is what marks the open shelf, and the count beside each chip is
 * printed from the records, so a chip can never advertise a shelf that is empty:
 * only categories with products are offered at all.
 */
type ProductFiltersProps = {
  /** The category in the address, or `undefined` for the whole catalogue. */
  active?: ProductCategoryId;
};

export default function ProductFilters({ active }: ProductFiltersProps) {
  const { labels } = PRODUCT_CONFIG;
  const counts = getCategoryCounts();
  const total = getAllProducts().length;

  return (
    <nav className="prd-filters" aria-label={labels.filterLabel}>
      <Link
        className={`prd-chip${active ? "" : " is-active"}`}
        href={getCatalogHref(null)}
        aria-current={active ? undefined : "true"}
        scroll={false}
      >
        <span className="prd-chip-name">{labels.filterAll}</span>
        <span className="prd-chip-count">{toPersianDigits(total)}</span>
      </Link>

      {counts.map(({ category, count }) => (
        <Link
          className={`prd-chip${active === category.id ? " is-active" : ""}`}
          key={category.id}
          href={getCatalogHref(category.id)}
          aria-current={active === category.id ? "true" : undefined}
          scroll={false}
        >
          <span className="prd-chip-name">{category.label}</span>
          <span className="prd-chip-count">{toPersianDigits(count)}</span>
        </Link>
      ))}
    </nav>
  );
}
