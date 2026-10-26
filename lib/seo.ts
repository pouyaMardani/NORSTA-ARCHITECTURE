import type { Metadata } from "next";

import { SITE_LOCALE, SITE_NAME } from "./site";

/**
 * The metadata an article, a lesson and a project page all need, and no one of
 * them should have to remember.
 *
 * Those three routes are the ones a reader arrives at from a link somebody else
 * posted, so they are the ones where a correct canonical address, a share image
 * and a large-format card actually decide how the link looks. The differences
 * between them are confined to two optional fields; everything else — the
 * absolute canonical URL, the OpenGraph address, the site's own name and
 * language, and the card size — is the same on all three.
 *
 * The image is passed as the record's own cover, which is the photograph the
 * page itself opens with: the share card and the page therefore show the same
 * picture. `publishedTime` is only ever passed where the record carries a real
 * publication date.
 */
export type DetailSeo = {
  /** Site-relative address of the page, e.g. `/articles/what-is-microcement`. */
  path: string;
  /** The page's own title — the segment's template appends the section name. */
  title: string;
  description: string;
  image: { src: string; alt: string };
  /** ISO `YYYY-MM-DD`, when the record states one. */
  publishedTime?: string;
};

export function detailMetadata({
  path,
  title,
  description,
  image,
  publishedTime,
}: DetailSeo): Metadata {
  return {
    title,
    description,

    /* A relative canonical is resolved against `metadataBase`, so the served tag
       reads as one absolute address per page — which is what stops the same
       article being counted twice under two spellings of the host. */
    alternates: { canonical: path },

    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: path,
      title,
      description,
      images: [{ url: image.src, alt: image.alt }],
      ...(publishedTime ? { publishedTime } : {}),
    },

    /* Next fills `twitter:image` from the OpenGraph image above, so the card and
       the image only have to be declared once. */
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
