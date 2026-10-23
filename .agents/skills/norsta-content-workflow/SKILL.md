---
name: norsta-content-workflow
description: >-
  Organize, create, validate, and maintain Norsta's Persian educational articles
  and website content. Use when adding articles, updating featured content,
  managing article metadata, or connecting educational pages to portfolio
  projects.
---

# Norsta Content Workflow

## Project Content Goals

- Norsta is a portfolio and educational website focused on microcement and artistic patina finishes.
- Explain what microcement is, where it may be used, and what visitors should understand before choosing a finish.
- Use the website to showcase authentic project photography and provide helpful educational information.
- Keep the homepage focused on the brand, selected portfolio work, and important educational content.
- Maintain a dedicated article listing page for the ten main featured educational posts.
- Keep the homepage featured articles connected to the same source of truth as the article listing.
- Do not introduce an admin panel, CMS, or database unless the project owner approves a change.

## Inspect Before Editing

- Read the project roadmap and existing content model.
- Inspect current article data, routes, and reusable components.
- Check which articles and images already exist before creating new entries.
- Preserve existing content unless the task explicitly requires changing it.
- Avoid duplicating content across separate files or components.
- Do not replace real approved content with generic placeholder text.

## Article Structure

- Use a consistent content model for articles.
- Give each published article a unique, stable slug.
- Include a clear title and useful summary.
- Use descriptive headings and a logical heading hierarchy.
- Store publication dates and update dates only when accurate.
- Include a suitable cover image when an approved asset is available.
- Provide meaningful alternative text for informative images.
- Include category, author, and SEO metadata when appropriate and verified.
- Keep optional fields optional when the information is unavailable.

## Educational Accuracy

- Write in natural, professional Persian.
- Explain technical concepts clearly for the intended audience.
- Verify technical claims about materials, preparation, application, durability, waterproofing, maintenance, and limitations when necessary.
- Distinguish general guidance from claims that depend on the specific material system or application.
- Do not promise that microcement is suitable for every surface or environment.
- Do not invent product specifications, certifications, project results, or maintenance guarantees.
- Mark uncertain technical details for review rather than presenting them as facts.
- Do not publish unsupported claims merely to improve SEO.

## Featured Articles

- Keep the ten main featured articles in a clear, maintainable data structure.
- Reuse the same article records on the homepage and article listing page.
- Avoid maintaining separate, manually duplicated article content for each location.
- Keep the featured selection intentional and consistent.
- Do not create ten empty articles just to fill a visual grid.
- If fewer than ten approved articles exist, show the available content or mark missing entries as pending.
- Do not mark draft content as published.

## Article Listing and Detail Pages

- Ensure the article listing links to the correct detail routes.
- Use stable slugs and consistent URL conventions.
- Provide useful not-found behavior for unknown slugs.
- Keep title, summary, cover image, and article content consistent across cards and detail pages.
- Avoid repeating the entire article body in the listing page.
- Use appropriate metadata for each article.
- Keep related article links relevant and functional.

## Homepage Integration

- Feature selected articles without overwhelming the homepage.
- Connect featured article cards to the correct detail pages.
- Use approved article images and accurate summaries.
- Keep featured content synchronized with the article data source.
- Make the route to the full article listing clear.
- Avoid hardcoding duplicate article records into homepage components.

## Portfolio Relationships

- Link articles to relevant portfolio projects when a genuine relationship exists.
- Link projects back to useful educational content when it helps visitors.
- Avoid creating artificial relationships merely to increase internal links.
- Use descriptive link text.
- Ensure every internal link points to an existing destination.

## Content Source and Rendering

- Follow the existing project architecture.
- Prefer typed static data, Markdown, or MDX when appropriate for the current website.
- Keep article content separate from presentation where practical.
- Avoid adding a database or CMS without approval.
- Validate required fields and duplicate slugs.
- Ensure unpublished content is not exposed accidentally.
- Preserve content when changing schemas or rendering components.

## Editorial Review

Before marking an article ready, verify:

- Factual accuracy.
- Natural Persian language.
- Clear title and summary.
- Logical headings.
- Valid internal links.
- Appropriate images and alternative text.
- Accurate metadata.
- Correct RTL rendering.
- Absence of unsupported business or technical claims.

## Verification

- Test the article listing page.
- Test representative article detail pages.
- Check the featured articles on the homepage.
- Verify article routes, links, and missing-slug behavior.
- Check responsive layouts and image loading.
- Run relevant lint, type, test, and production build checks.

## Completion Standard

Norsta's content must be accurate, useful, consistent, and maintainable. The homepage, article listing, and article detail pages must use coherent content data without unnecessary duplication.