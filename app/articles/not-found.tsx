import type { Metadata } from "next";
import Link from "next/link";

import { ARTICLE_CONFIG, getAllArticles, toPersianDigits } from "@/content/articles";

/**
 * Not-found boundary for the magazine segment.
 *
 * `notFound()` from `/articles/<unknown-slug>` lands here (HTTP 404) and stays
 * inside the article shell, so a wrong link reads as part of the magazine rather
 * than as the site's bare default error page.
 */
export const metadata: Metadata = {
  title: "مقاله پیدا نشد",
};

export default function ArticleNotFound() {
  const count = getAllArticles().length;

  return (
    <div className="art-page art-missing" dir="rtl">
      <span className="eyebrow art-eyebrow">۴۰۴</span>
      <h1 className="art-page-title">این یادداشت پیدا نشد</h1>
      <p className="art-page-lede">
        نشانی‌ای که باز کرده‌اید به مقاله‌ای در مجله NORSTA اشاره نمی‌کند؛ ممکن
        است جابه‌جا شده باشد یا هنوز منتشر نشده باشد. آرشیو مجله
        {` ${toPersianDigits(count)} `}
        یادداشت منتشرشده دارد.
      </p>

      <Link className="art-empty-link" href="/articles">
        {ARTICLE_CONFIG.labels.emptyReset}
      </Link>
    </div>
  );
}
