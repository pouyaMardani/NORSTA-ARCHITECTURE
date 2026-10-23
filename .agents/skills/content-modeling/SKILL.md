---
name: content-modeling
description: Design maintainable content schemas and data structures for articles, portfolio projects, categories, authors, and other website content. Use when separating content from presentation or managing growing collections of static content.
---

# Content Modeling

## Inspect Before Designing

- Read the existing content files, components, routes, and project roadmap.
- Identify the content types the website actually needs.
- Reuse existing schemas and conventions when appropriate.
- Avoid introducing a database or CMS when static content meets the requirements.
- Do not create unnecessary abstraction for a small content collection.

## Separate Content from Presentation

- Keep reusable content data separate from page layout and styling.
- Avoid duplicating the same article or project information across multiple components.
- Prefer a clear source of truth for each content item.
- Use shared rendering components for content with the same structure.
- Keep page-specific presentation logic out of shared data files when possible.

## Content Types

Model only the content types required by the project.

Common examples include:

- Articles.
- Portfolio projects.
- Categories or tags.
- Author or business information.
- Related content references.

Do not create every possible type by default.

## Schema Design

For each content type, define:

- A stable unique identifier or slug.
- A title or display name.
- Required and optional fields.
- A clear representation of images and other media.
- Publication or visibility status when needed.
- Relationships to categories or other content.
- Optional metadata required for rendering and SEO.

Use consistent field names and data types.

## Articles

An article model may include:

- slug
- title
- excerpt
- body or content blocks
- cover image
- image alternative text
- category
- publication date
- updated date when meaningful
- author reference when known
- SEO metadata when needed
- related article references

Treat this as a flexible example, not a mandatory schema. Choose fields according to the actual content and rendering requirements.

## Portfolio Projects

A portfolio project model may include:

- slug
- title
- short description
- project images
- image alternative text
- project category
- finish or technique when verified
- materials when verified
- project location when approved for publication
- completion date when known
- related content references

Do not require information that the project owner cannot reliably provide.

Never invent client names, project locations, material specifications, or completion dates.

## Static Content Sources

- Use TypeScript, JSON, or Markdown according to the project's content needs.
- Prefer Markdown or MDX for long-form articles when it improves authoring and maintenance.
- Prefer typed TypeScript data when relationships or strict validation are important.
- Use JSON for simple structured data when its limitations are acceptable.
- Avoid adding multiple content formats without a clear benefit.
- Do not introduce a database, CMS, or admin panel unless the project requirements change.

## Validation and Type Safety

- Define explicit TypeScript types for structured content.
- Validate required fields and expected data types.
- Detect duplicate slugs.
- Detect broken references between related content.
- Handle missing optional fields safely.
- Avoid using `any` to bypass meaningful schema errors.
- Provide clear errors when required content is invalid.

## Routing and Content Discovery

- Use stable slugs for public content routes.
- Ensure each published item resolves to the correct page.
- Handle unknown slugs with an appropriate not-found response.
- Generate static parameters when required by the chosen rendering strategy.
- Avoid exposing unpublished or draft content unintentionally.
- Keep internal links consistent with the source data.

## Images and Assets

- Reference existing project assets through a consistent convention.
- Avoid hardcoding the same image path in several unrelated files.
- Preserve original photography where required.
- Ensure each informative image has appropriate alternative text.
- Validate asset paths and handle missing images deliberately.

## Migration and Maintenance

- Before changing a schema, identify every component and route that consumes it.
- Update all dependent code consistently.
- Preserve existing content during migrations.
- Avoid destructive scripts without review and approval.
- Add or update validation when the schema changes.

## Verification

- Validate all existing content records.
- Check for duplicate slugs and broken references.
- Test article and portfolio detail routes.
- Verify missing-field behavior.
- Run the available type checks, tests, and production build.

## Completion Standard

Content models should be understandable, type-safe, maintainable, and proportionate to the project. Content must remain separate from presentation wherever that separation improves consistency and maintainability.