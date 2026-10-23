---
name: structured-data
description: Implement and validate appropriate Schema.org structured data for articles, organizations, websites, and other eligible content. Use when adding or reviewing JSON-LD and search engine structured data.
---

# Structured Data

## Understand the Page First

- Inspect the page content, purpose, and existing metadata.
- Identify whether structured data is appropriate for the page.
- Consult current Schema.org definitions and the target search engine's official documentation when needed.
- Follow the project's existing metadata and rendering conventions.
- Do not add structured data merely to increase markup volume.

## Data Accuracy

- Use only information that is verified and appropriate for publication.
- Ensure structured data accurately reflects visible page content.
- Never invent ratings, reviews, credentials, addresses, prices, or business claims.
- Do not include information that contradicts the visible page.
- Avoid marking up hidden or misleading content to manipulate search results.
- Omit optional properties when the required information is unavailable.

## JSON-LD

- Prefer JSON-LD when it suits the implementation and search engine requirements.
- Keep structured data generation separate from unrelated UI presentation logic.
- Use valid JSON serialization rather than manually concatenating untrusted strings.
- Escape and handle content safely.
- Avoid inserting untrusted HTML into script elements.
- Prevent duplicate or conflicting schema blocks.
- Reuse validated content data where appropriate.

## Common Schema Types

Choose schema types according to the actual page and current eligibility requirements.

Possible examples include:

- Organization or an appropriate business-related type.
- WebSite.
- WebPage.
- Article or BlogPosting.
- BreadcrumbList.
- Person, when an actual person is represented and the information is verified.

These are examples, not a requirement to add every type to every page.

Do not assume that a business qualifies for a specific rich result simply because a schema type exists.

## Articles

When appropriate, include verified properties such as:

- headline
- description
- image
- datePublished
- dateModified
- author
- publisher
- mainEntityOfPage

Requirements vary by schema type and search engine. Include only accurate properties supported by the content and current guidance.

Do not invent publication dates or author credentials.

## Business and Brand Information

- Use the correct verified brand or business name.
- Include a URL only when the correct public URL is known.
- Include contact details or a physical address only when verified and approved for publication.
- Use an appropriate business type rather than choosing a more specific type without evidence.
- Do not invent geographic service areas or business locations.
- Avoid creating duplicate business entities with inconsistent information.

## Breadcrumbs

- Add breadcrumb structured data when the page hierarchy supports it.
- Ensure breadcrumb labels match the actual navigation hierarchy.
- Use valid destination URLs.
- Do not generate breadcrumbs for nonexistent or unrelated pages.
- Keep breadcrumb markup consistent with the visible interface where applicable.

## Next.js Implementation

- Follow the installed Next.js version and current rendering conventions.
- Generate structured data from trusted, validated content.
- Use a consistent implementation for repeated content types.
- Avoid duplicating structured data across nested layouts and pages.
- Ensure the final rendered HTML contains valid JSON-LD when required.
- Do not assume that code compiling guarantees valid structured data.

## Validation

- Validate JSON syntax.
- Inspect the rendered page source or browser output.
- Use Schema.org validation tools when appropriate.
- Use Google's Rich Results Test when checking eligibility for supported Google rich results.
- Resolve critical validation errors.
- Distinguish schema validity from eligibility for rich results.
- Do not promise rich results, rankings, or indexing.

## Maintenance

- Update structured data when the underlying content changes.
- Keep shared organization details consistent across relevant pages.
- Remove obsolete or inaccurate properties.
- Revalidate important templates after schema or routing changes.
- Document any fields that require business-owner confirmation.

## Completion Standard

Structured data must be valid, truthful, relevant to the page, and consistent with visible content. Report validation results accurately and never guarantee a search engine display outcome.