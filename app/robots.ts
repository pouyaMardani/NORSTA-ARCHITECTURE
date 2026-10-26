import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * `/robots.txt`.
 *
 * The whole site is meant to be crawled: there is no account area, no search
 * result page, no cart and no filter that generates an unbounded number of
 * addresses, so nothing needs a `Disallow` rule. What the file does carry is the
 * sitemap's address, which is how a crawler finds every page without
 * having to walk the links.
 *
 * One exception is built in: a Vercel *preview* deployment is served from its own
 * hostname and is not the site, so it asks every crawler to stay out. Otherwise
 * each push would publish a second, complete copy of the site under a
 * deployment URL — the classic way a rebuild turns into duplicate content.
 */
export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === "preview";

  if (isPreview) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
