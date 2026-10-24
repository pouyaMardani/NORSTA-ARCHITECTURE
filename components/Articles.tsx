import Link from "next/link";

import {
  ARTICLE_CONFIG,
  getAllArticles,
  getFeaturedArticles,
  toPersianDigits,
} from "@/content/articles";

import ArticleCard from "./ArticleCard";

/**
 * The magazine section on the home page.
 *
 * It sits directly below `Work` and is deliberately a different register: the
 * site's warm ivory gives way to a deep charcoal ground with warm off-white
 * type and restrained beige accents, so the words read as a separate room while
 * the type scale and the hairlines stay the site's own.
 *
 * Three featured articles are shown (see `getFeaturedArticles`), and the whole
 * section is a Server Component — the only client code on the page is the reveal
 * system that `SiteInteractions` has already mounted.
 */
export default function Articles() {
  const featured = getFeaturedArticles(3);
  const { magazine } = ARTICLE_CONFIG;
  const total = getAllArticles().length;

  return (
    <section id="journal" className="art" dir="rtl">
      <div className="art-head">
        <div className="art-head-title">
          <span className="eyebrow art-eyebrow" data-reveal="fade-up">
            {magazine.eyebrow}
          </span>
          <h2
            className="art-title mask-title"
            data-reveal="mask-line"
            data-delay="120"
          >
            <span className="line">
              <span>{magazine.name}</span>
            </span>
          </h2>
        </div>

        <div className="art-head-copy">
          <p className="art-lede" data-reveal="fade-up" data-delay="200">
            {magazine.intro}
          </p>

          <Link className="art-all" href="/articles" data-reveal="fade-up" data-delay="280">
            <span>{magazine.allArticlesLabel}</span>
            <span className="art-all-count">
              {toPersianDigits(total)} مقاله
            </span>
            <span className="art-all-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M4 12h16" />
                <path d="M14 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="art-grid">
        {featured.map((article, index) => (
          <div
            className="art-grid-item"
            key={article.id}
            data-reveal="fade-up"
            data-delay={String(120 + index * 120)}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {/* Without scripting the section never receives `is-in` and would stay
          hidden; reveal it outright instead. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".art [data-reveal]{opacity:1!important;transform:none!important}" +
              ".art .mask-title .line>span{transform:none!important}",
          }}
        />
      </noscript>
    </section>
  );
}
