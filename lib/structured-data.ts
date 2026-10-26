import { ARTICLE_CONFIG, type ArticleDTO } from "@/content/articles";
import type { LessonDTO } from "@/content/academy";
import type { ProjectDTO } from "@/content/projects";
import {
  SITE_INSTAGRAM_URL,
  SITE_LANGUAGE_TAG,
  SITE_NAME,
  SITE_URL,
} from "./site";

/**
 * The site's structured data, as plain objects.
 *
 * Everything here is assembled from facts the pages already state in their own
 * HTML: the title, the summary the record carries, the cover photograph, the
 * publication day, the byline, the studio's own Instagram account. Nothing is
 * asserted that the site does not say — no opening hours, no price, no rating,
 * no address and no author invented for the occasion — because structured data
 * that disagrees with the page is worse than none at all.
 *
 * The studio's `email`, `telephone` and `address` are deliberately absent rather
 * than forgotten. The reference studio's Copenhagen address and its e-mail were
 * removed from `components/Contact.tsx` in the same brand pass that removed them
 * from here, and no replacement has been supplied, so nothing stands in their
 * place. An `Organization` node is a claim about a business: it states the name,
 * the domain, the logo and the one profile that answers, and stops there.
 *
 * `components/JsonLd.tsx` writes these out; `lib/site.ts` supplies the origin
 * every URL in them is built from. The shapes are the ones the search engines
 * document for a site, an organisation, an article, a teaching resource and a
 * built work.
 */
type JsonLdNode = Record<string, unknown>;

/** The publisher, and the one profile that leads to the same studio elsewhere. */
export function organizationJsonLd(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    /* The favicon set's largest raster, which is the same mark the tab shows. */
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/apple-touch-icon.png`,
      width: 180,
      height: 180,
    },
    sameAs: [SITE_INSTAGRAM_URL],
  };
}

/** The site itself, so a search engine can attribute the pages to one publisher. */
export function websiteJsonLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: SITE_LANGUAGE_TAG,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Several nodes in one document, cross-referencing each other by `@id`. */
export function graphJsonLd(nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** The magazine's name for the article's `isPartOf`, taken from its own copy. */
function magazineNode(): JsonLdNode {
  return { "@type": "WebPage", name: ARTICLE_CONFIG.magazine.name, url: `${SITE_URL}/articles` };
}

function articleNode(article: ArticleDTO): JsonLdNode {
  return {
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    image: [`${SITE_URL}${article.coverImage.src}`],
    datePublished: article.publishedAt,
    articleSection: article.category,
    /* `readingTime` is already minutes, which is what the ISO duration wants. */
    timeRequired: `PT${article.readingTime}M`,
    inLanguage: SITE_LANGUAGE_TAG,
    author: { "@type": "Organization", name: article.author.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}`,
    },
  };
}

function lessonNode(lesson: LessonDTO): JsonLdNode {
  return {
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.seoDescription,
    image: [`${SITE_URL}${lesson.coverImage.src}`],
    learningResourceType: "lesson",
    inLanguage: SITE_LANGUAGE_TAG,
    /* Three of the lessons are the free introduction; the field is the record's
       own access flag, not a claim about the rest of the collection. */
    isAccessibleForFree: lesson.access === "free",
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/academy/${lesson.slug}`,
    },
  };
}

function projectNode(project: ProjectDTO): JsonLdNode {
  return {
    "@type": "CreativeWork",
    name: project.title,
    description: project.seoDescription,
    image: [
      `${SITE_URL}${project.coverImage.src}`,
      ...project.galleryImages.map((shot) => `${SITE_URL}${shot.src}`),
    ],
    creator: { "@id": `${SITE_URL}/#organization` },
    inLanguage: SITE_LANGUAGE_TAG,
    /* Only what the record states: a location line, a completion date and the
       materials are all optional, and are omitted rather than guessed at. */
    ...(project.location
      ? { contentLocation: { "@type": "Place", name: project.location } }
      : {}),
    ...(project.completedAt ? { dateCreated: project.completedAt } : {}),
    ...(project.materials?.length ? { keywords: project.materials.join("، ") } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/projects/${project.slug}`,
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/** One article page's structured data, cross-referencing the site's own nodes. */
export function articleJsonLd(article: ArticleDTO): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [articleNode(article), magazineNode()],
  };
}

/** One lesson page's structured data. */
export function lessonJsonLd(lesson: LessonDTO): JsonLdNode {
  return { "@context": "https://schema.org", ...lessonNode(lesson) };
}

/** One project page's structured data. */
export function projectJsonLd(project: ProjectDTO): JsonLdNode {
  return { "@context": "https://schema.org", ...projectNode(project) };
}
