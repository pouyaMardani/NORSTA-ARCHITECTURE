import type { Metadata } from "next";
import Link from "next/link";

import { getAllProjects, PROJECT_CONFIG, toPersianDigits } from "@/content/projects";

/**
 * Not-found boundary for the project segment.
 *
 * `notFound()` from `/projects/<unknown-slug>` lands here (HTTP 404) and stays
 * inside the project shell, so a wrong link reads as part of the gallery rather
 * than as the site's bare default error page.
 */
export const metadata: Metadata = {
  title: PROJECT_CONFIG.labels.notFoundTitle,
};

export default function ProjectNotFound() {
  const count = getAllProjects().length;

  return (
    <div className="pj pj-missing" dir="rtl">
      <span className="eyebrow pj-eyebrow">۴۰۴</span>
      <h1 className="pj-missing-title">{PROJECT_CONFIG.labels.notFoundTitle}</h1>
      <p className="pj-missing-lede">
        {PROJECT_CONFIG.labels.notFoundLede}
        {` ${toPersianDigits(count)} `}
        پروژه در این گالری منتشر شده است.
      </p>

      <Link className="pj-missing-link" href="/#work">
        {PROJECT_CONFIG.labels.notFoundAction}
      </Link>
    </div>
  );
}
