---
name: technical-seo
description: Implement and audit technical SEO, including crawlability, indexability, canonical URLs, XML sitemaps, robots directives, redirects, HTTP status codes, and search engine discoverability.
---

# Technical SEO

## Inspect Before Changing

- Inspect the routing structure, rendering strategy, metadata configuration, and deployment setup.
- Check the installed Next.js version before using framework-specific APIs.
- Identify the verified production domain before configuring absolute URLs.
- Preserve existing URL conventions unless a migration is required.
- Avoid changing indexing directives without understanding their impact.

## Crawlability and Indexability

- Ensure intended public pages can be discovered through crawlable links.
- Identify pages that should be indexed and pages that should not.
- Use robots directives deliberately.
- Understand that robots.txt restrictions and noindex directives serve different purposes.
- Do not block important public pages or assets needed to render them.
- Never assume that adding a sitemap guarantees indexing.
- Avoid exposing private or sensitive content through public routes.

## URL Design

- Prefer readable, stable, descriptive URLs.
- Use consistent conventions for articles, categories, and portfolio projects.
- Avoid unnecessary query parameters and duplicate URL variants.
- Preserve established URLs where practical.
- When changing a public URL, identify whether a permanent redirect is required.
- Avoid redirect chains and redirect loops.
- Verify destination URLs and response status codes.

## Canonical URLs

- Configure canonical URLs when duplicate or equivalent page variants require consolidation.
- Use the verified preferred production URL.
- Ensure canonical targets are valid and relevant.
- Avoid pointing unrelated pages to the same canonical URL.
- Check consistency between canonical URLs, internal links, and sitemap entries.
- Do not invent the production domain.

## XML Sitemap

- Include intended canonical public URLs.
- Exclude private, temporary, and irrelevant routes.
- Avoid duplicate URLs and invalid destinations.
- Update the sitemap strategy when new content types or dynamic routes are introduced.
- Follow the installed Next.js conventions for sitemap generation.
- Do not include staging URLs in a production sitemap.
- Do not claim that search engines have indexed a page merely because it appears in the sitemap.

## robots.txt

- Configure crawler access according to the project's requirements.
- Ensure important public pages remain crawlable.
- Include the sitemap location when appropriate and when the production URL is verified.
- Avoid disallowing broad route patterns without reviewing their effect.
- Validate the generated robots.txt output.

## Rendering and Discovery

- Ensure important page content is available to search engines through an appropriate rendering strategy.
- Prefer server-rendered or statically generated content when suitable for the project.
- Avoid making essential content dependent on unnecessary client-side JavaScript.
- Ensure dynamic routes produce valid pages and metadata.
- Check that internal navigation exposes important content.

## Internationalization and RTL

- Set the document language correctly for each supported language.
- Configure text direction independently from language where appropriate.
- If multiple language versions are introduced, implement a consistent URL and hreflang strategy.
- Do not add hreflang annotations when alternate language pages do not exist.
- Ensure canonical and alternate-language URLs are valid.

## Next.js Considerations

- Use the metadata API and routing conventions supported by the installed version.
- Review metadata inheritance across layouts and pages.
- Ensure dynamic metadata resolves correctly for real content.
- Test sitemap and robots routes in the production build.
- Avoid conflicting metadata definitions.

## Verification

- Check representative routes and HTTP status codes.
- Inspect canonical URLs and indexing directives.
- Validate sitemap and robots output.
- Review internal links and redirect behavior.
- Check production URLs after deployment when access is available.
- Clearly distinguish local code verification from actual search engine indexing.

## Completion Standard

Technical SEO should make intended public content discoverable, canonical, accessible, and correctly represented. Never claim successful indexing or rankings without supporting evidence.