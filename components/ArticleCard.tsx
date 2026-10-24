import Image from "next/image";
import Link from "next/link";

import {
  formatArticleDate,
  readingTimeLabel,
  type ArticleDTO,
} from "@/content/articles";

/**
 * One magazine card — the shared unit of the home section, the archive grid and
 * the related-articles block.
 *
 * The card is a photograph with the copy mounted on its lower half over a dark
 * gradient, so a real <Image> and real text are laid out by CSS: nothing is a
 * flattened screenshot.
 *
 * Accessibility: the title is the only link, and its `::after` is stretched over
 * the whole card (see `globals.css`), so the entire plate is clickable while the
 * link's accessible name stays the article title. The arrow is decorative.
 */
type ArticleCardProps = {
  article: ArticleDTO;
  /** Responsive `sizes` hint; defaults to the three-column grid. */
  sizes?: string;
};

export default function ArticleCard({
  article,
  sizes = "(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw",
}: ArticleCardProps) {
  return (
    <article className="art-card">
      <div className="art-card-media">
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
        <span className="art-card-veil" aria-hidden="true" />
      </div>

      <div className="art-card-body">
        <span className="art-card-cat">{article.category}</span>

        <h3 className="art-card-title">
          <Link className="art-card-link" href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        <p className="art-card-excerpt">{article.excerpt}</p>

        <p className="art-card-meta">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt)}
          </time>
          <span className="art-card-sep" aria-hidden="true" />
          <span>{readingTimeLabel(article.readingTime)}</span>
          <span className="art-card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 12h16" />
              <path d="M14 6l6 6-6 6" />
            </svg>
          </span>
        </p>
      </div>
    </article>
  );
}
