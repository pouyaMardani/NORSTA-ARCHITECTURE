import type { Metadata } from "next";
import Link from "next/link";

import ArticleCard from "@/components/ArticleCard";
import ArticleFilters from "@/components/ArticleFilters";
import {
  ARTICLE_CONFIG,
  getAllArticles,
  getArticlesByCategory,
  parseCategory,
  toPersianDigits,
} from "@/content/articles";

/**
 * The magazine archive: every article, three columns by four rows on desktop.
 *
 * Category filtering is done on the URL (`/articles?category=…`) rather than in
 * client state, so the grid arrives already narrowed and the page stays a Server
 * Component. The three-column layout is a desktop arrangement; narrower
 * viewports fall to two columns and then one (see `globals.css`).
 */
export const metadata: Metadata = {
  description:
    "آرشیو مجله NORSTA: مقالات کاربردی درباره‌ی میکروسمنت و پتینه؛ از آماده‌سازی بستر و مراحل اجرا تا انتخاب رنگ، نگهداری سطح و عوامل مؤثر بر هزینه.",
};

type ArchivePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ArticlesArchivePage({
  searchParams,
}: ArchivePageProps) {
  const params = await searchParams;
  const raw = params.category;
  const value = Array.isArray(raw) ? raw[0] : raw;

  const active = parseCategory(value);
  /** A URL that names a category nobody writes in: say so instead of showing all. */
  const unknownCategory = Boolean(value) && !active;

  const articles = unknownCategory
    ? []
    : active
      ? getArticlesByCategory(active)
      : getAllArticles();

  return (
    <div className="art-page" dir="rtl">
      <header className="art-page-head">
        <span className="eyebrow art-eyebrow">{ARTICLE_CONFIG.magazine.eyebrow}</span>
        <h1 className="art-page-title">{ARTICLE_CONFIG.magazine.name}</h1>
        <p className="art-page-lede">{ARTICLE_CONFIG.magazine.archiveIntro}</p>
      </header>

      <ArticleFilters active={active} />

      <p className="art-count">
        {active ? (
          <>
            <span className="art-count-cat">{active}</span>
            {` · ${toPersianDigits(articles.length)} مقاله`}
          </>
        ) : (
          `${toPersianDigits(articles.length)} یادداشت`
        )}
      </p>

      {articles.length > 0 ? (
        /* The archive is the index of everything the studio has written, so its
           cards are deliberately not gated behind the scroll-reveal observer:
           they arrive visible and readable in the HTML, whatever the route
           history or script state. The home section's single row of cards does
           still reveal on scroll. */
        <div className="art-grid">
          {articles.map((article) => (
            <div className="art-grid-item" key={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="art-empty">
          <p>{ARTICLE_CONFIG.labels.empty}</p>
          <Link className="art-empty-link" href="/articles">
            {ARTICLE_CONFIG.labels.emptyReset}
          </Link>
        </div>
      )}
    </div>
  );
}
