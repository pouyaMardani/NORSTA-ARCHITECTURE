import Link from "next/link";

import {
  ARTICLE_CONFIG,
  getAllArticles,
  getCategoryCounts,
  toPersianDigits,
  type ArticleCategory,
} from "@/content/articles";

/**
 * Category filter for the archive.
 *
 * A filter here is a URL, not state: every chip is a link to
 * `/articles?category=…`, the archive reads the parameter on the server and the
 * grid is rendered already narrowed. That keeps the page a Server Component, adds
 * no client JavaScript, and makes a filtered view shareable and reload-safe.
 */
type ArticleFiltersProps = {
  active?: ArticleCategory;
};

export default function ArticleFilters({ active }: ArticleFiltersProps) {
  const categories = getCategoryCounts();
  const total = getAllArticles().length;

  return (
    <nav className="art-filters" aria-label={ARTICLE_CONFIG.labels.filterLabel}>
      <Link
        className={`art-chip${active ? "" : " is-active"}`}
        href="/articles"
        aria-current={active ? undefined : "true"}
        scroll={false}
      >
        <span>{ARTICLE_CONFIG.labels.filterAll}</span>
        <span className="art-chip-count">{toPersianDigits(total)}</span>
      </Link>

      {categories.map(({ category, count }) => (
        <Link
          className={`art-chip${active === category ? " is-active" : ""}`}
          key={category}
          href={`/articles?category=${encodeURIComponent(category)}`}
          aria-current={active === category ? "true" : undefined}
          scroll={false}
        >
          <span>{category}</span>
          <span className="art-chip-count">{toPersianDigits(count)}</span>
        </Link>
      ))}
    </nav>
  );
}
