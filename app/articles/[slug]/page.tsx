import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleBody from "@/components/ArticleBody";
import ArticleCard from "@/components/ArticleCard";
import {
  ARTICLE_CONFIG,
  formatArticleDate,
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
  readingTimeLabel,
} from "@/content/articles";

/**
 * One article.
 *
 * The route is `/articles/<slug>` for all twelve pieces: one dynamic page, twelve
 * URLs, no duplicated implementation. Unknown slugs fall through to
 * `notFound()`, which renders `app/articles/not-found.tsx` with a 404 status
 * rather than an empty article.
 *
 * Metadata is per article (`seoTitle` / `seoDescription`); the magazine's name is
 * appended by the segment's layout template.
 */
type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

/** Pre-render every article at build time. */
export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "مقاله پیدا نشد" };
  }

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    openGraph: {
      type: "article",
      title: article.seoTitle,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(article, 3);
  const { labels } = ARTICLE_CONFIG;

  return (
    <article className="post" dir="rtl">
      <header className="post-head">
        <div className="post-cover" data-reveal="image-reveal">
          <Image
            src={article.coverImage.src}
            alt={article.coverImage.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <span className="post-cover-veil" aria-hidden="true" />
        </div>

        <div className="post-head-inner">
          <Link className="post-back" href="/articles">
            <span className="post-back-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M20 12H4" />
                <path d="M10 6l-6 6 6 6" />
              </svg>
            </span>
            {labels.back}
          </Link>

          <div className="post-head-title" data-reveal="fade-up" data-delay="160">
            <span className="post-cat">{article.category}</span>
            <h1 className="post-title">{article.title}</h1>
          </div>

          <p className="post-meta" data-reveal="fade-up" data-delay="280">
            <span className="post-author">
              {labels.by} {article.author.name}
              {article.author.role ? (
                <span className="post-author-role">{article.author.role}</span>
              ) : null}
            </span>
            <span className="post-sep" aria-hidden="true" />
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            <span className="post-sep" aria-hidden="true" />
            <span>{readingTimeLabel(article.readingTime)}</span>
          </p>
        </div>
      </header>

      <div className="post-wrap">
        <p className="post-lede">{article.excerpt}</p>
        <ArticleBody blocks={article.content} />
      </div>

      {related.length > 0 ? (
        <section className="post-related" aria-labelledby="post-related-title">
          <h2
            className="post-related-title"
            id="post-related-title"
            data-reveal="fade-up"
          >
            {labels.related}
          </h2>

          <div className="art-grid">
            {related.map((item, index) => (
              <div
                className="art-grid-item"
                key={item.id}
                data-reveal="fade-up"
                data-delay={String(index * 110)}
              >
                <ArticleCard article={item} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
