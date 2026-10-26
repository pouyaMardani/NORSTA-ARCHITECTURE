import type { MetadataRoute } from "next";

import { getAllLessons } from "@/content/academy";
import { getAllArticles } from "@/content/articles";
import { getAllProjects } from "@/content/projects";
import { absoluteUrl } from "@/lib/site";

/**
 * `/sitemap.xml`.
 *
 * The list is generated from the same content modules the pages render, so a new
 * article, lesson or project appears here the moment it appears in the site — no
 * second list to keep in step, and no URL in the sitemap that has no record
 * behind it.
 *
 * Two deliberate omissions:
 *
 *   · `/projects` is not listed. It is a redirect to the home page's gallery
 *     (see `app/projects/page.tsx`), and a sitemap may only hold the canonical
 *     address of a page, never one that answers with a redirect.
 *   · The magazine's category views (`/articles?category=…`) are not listed
 *     separately: they are the same page with a filter, and they declare
 *     `/articles` as their canonical address.
 *
 * `lastModified` is stated only where the content actually dates itself — an
 * article's publication day. Lessons and projects carry no editorially approved
 * revision date, so they are listed without one rather than with a date that
 * would be re-stamped on every build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articleDate = (iso: string): Date | undefined => {
    const date = new Date(`${iso}T00:00:00Z`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/articles"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getAllArticles().map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: articleDate(article.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: absoluteUrl("/academy"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getAllLessons().map((lesson) => ({
      url: absoluteUrl(`/academy/${lesson.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...getAllProjects().map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
