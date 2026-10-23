---
name: seo-best-practices
description: Implement technical and on-page SEO, semantic HTML, metadata, canonical URLs, structured data, and crawlable navigation. Use when creating or reviewing public-facing website pages.
---

# SEO Best Practices

## Inspect First

- Read the project brief, routing structure, content model, and existing SEO configuration.
- Identify the primary purpose and intended audience of each page.
- Follow the project's existing URL and content conventions.
- Avoid changing established URLs without a clear reason.
- Never promise search rankings or guaranteed traffic improvements.

## Metadata

- Give each important page a meaningful, unique title.
- Provide a useful meta description when appropriate.
- Use the project's Next.js metadata APIs according to the installed version.
- Define a consistent site title template when useful.
- Configure canonical URLs using the verified production domain.
- Do not invent the production domain, social profiles, business address, or contact details.
- Keep metadata accurate and relevant to the page content.
- Avoid keyword stuffing and duplicate metadata.

## Semantic Content

- Use a logical heading hierarchy.
- Ensure every page has a clear main topic.
- Use semantic HTML elements appropriately.
- Write useful, original content for people rather than search engines alone.
- Keep headings descriptive and specific.
- Avoid hiding important text inside images.
- Do not generate fake project details, reviews, credentials, or factual claims.

## Internal Linking and URLs

- Use descriptive, stable, readable URLs.
- Keep route names consistent with the site's information architecture.
- Link related articles and portfolio projects where useful.
- Use descriptive link text instead of vague labels when practical.
- Avoid broken internal links.
- Avoid unnecessary redirects and duplicate URL variants.
- Preserve existing routes unless a planned migration requires changes.

## Images and Social Sharing

- Use meaningful alt text for informative images.
- Optimize image dimensions and delivery.
- Add Open Graph metadata when appropriate.
- Configure social preview images only when suitable assets are available.
- Do not use portfolio images without the required permission.
- Verify that social preview URLs point to accessible assets.

## Structured Data

- Add structured data only when the page qualifies for the relevant schema.
- Use accurate, verifiable business and content details.
- Never invent ratings, reviews, addresses, opening hours, or credentials.
- Ensure structured data agrees with visible page content.
- Validate the output using appropriate structured-data testing tools when available.
- Do not add schema merely to increase the amount of markup.

## Indexing and Technical SEO

- Review robots.txt and sitemap requirements.
- Include only appropriate canonical public pages in the sitemap.
- Avoid intentionally indexing private, temporary, or irrelevant routes.
- Do not block important assets or pages required for crawling.
- Configure redirects carefully when URLs change.
- Check status codes and ensure important pages return the expected response.
- Treat indexing and ranking as outcomes that cannot be guaranteed by code alone.

## Next.js Requirements

- Use the installed Next.js metadata and routing APIs.
- Generate metadata for dynamic routes using the supported framework patterns.
- Ensure public content is available to search crawlers.
- Avoid client-only rendering for essential content when a suitable server-rendered approach is available.
- Verify sitemap, robots, and metadata routes in the production build.
- Avoid duplicate metadata definitions across layouts and pages.

## Verification

- Inspect titles, descriptions, canonical URLs, headings, and internal links.
- Check sitemap and robots output when implemented.
- Test representative pages and dynamic routes.
- Verify social preview metadata where relevant.
- Record any domain, indexing, or deployment configuration that still needs attention.

## Completion Standard

SEO implementation should be accurate, crawlable, maintainable, and aligned with visible content. Do not claim SEO success based only on the presence of metadata.