import type { Metadata } from "next";
import Link from "next/link";

import { ACADEMY_CONFIG } from "@/content/academy";

/**
 * Not-found boundary for the academy segment.
 *
 * `notFound()` from `/academy/<unknown-slug>` lands here (HTTP 404) and stays
 * inside the academy shell, so a wrong link reads as part of the academy rather
 * than as the site's bare default error page.
 */
export const metadata: Metadata = {
  title: ACADEMY_CONFIG.labels.notFoundTitle,
};

export default function AcademyNotFound() {
  const { labels } = ACADEMY_CONFIG;

  return (
    <div className="aca-missing" dir="rtl">
      <span className="eyebrow aca-eyebrow">۴۰۴</span>
      <h1 className="aca-page-title">{labels.notFoundTitle}</h1>
      <p className="aca-page-lede">{labels.notFoundLede}</p>

      <Link className="aca-empty-link" href="/academy">
        {labels.notFoundAction}
      </Link>
    </div>
  );
}
