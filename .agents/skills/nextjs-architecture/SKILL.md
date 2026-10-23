---
name: nextjs-architecture
description: Design maintainable Next.js applications using App Router conventions, clear feature boundaries, reusable components, server and client component separation, and appropriate data-loading patterns.
---

# Next.js Architecture

## Inspect Before Changing

- Read the project roadmap and current architecture before implementing changes.
- Inspect package.json and identify the installed Next.js and React versions.
- Review the existing App Router structure, shared layouts, components, and content sources.
- Preserve working conventions unless there is a clear reason to change them.
- Explain significant architectural decisions before making large changes.
- Avoid unnecessary rewrites and premature abstraction.

## App Router Structure

- Follow the conventions supported by the installed Next.js version.
- Use the app directory for routes, layouts, loading states, error boundaries, and not-found pages where appropriate.
- Keep route files focused on their routing and page responsibilities.
- Use nested layouts when multiple routes share a meaningful interface.
- Avoid deeply nested directories without a clear organizational benefit.
- Keep route naming and URL conventions consistent.
- Do not introduce the Pages Router into an App Router project without an explicit requirement.

## Component Architecture

- Separate reusable UI components from route-specific page composition.
- Keep components focused on a clear responsibility.
- Extract repeated patterns when doing so improves maintainability.
- Avoid creating abstractions for components that are unlikely to be reused.
- Keep visual styling consistent through shared tokens and component variants.
- Avoid duplicating large blocks of markup across pages.
- Do not create excessively large components that are difficult to review or test.

## Server and Client Components

- Prefer Server Components when client-side interactivity is unnecessary.
- Use Client Components for features that require browser APIs, state, event handlers, or client-side effects.
- Keep client boundaries as small as practical.
- Avoid adding "use client" to an entire page or layout when only one small component needs it.
- Pass serializable props across server and client component boundaries where required.
- Do not access browser-only APIs during server rendering.
- Avoid hydration errors and inconsistent server/client output.

## Data and Content

- Keep content retrieval separate from visual presentation where practical.
- Use the simplest reliable data source that meets the requirements.
- For a static content-driven website, consider typed TypeScript data, JSON, Markdown, or MDX before adding a database.
- Avoid adding a backend, authentication, CMS, or admin panel unless requirements justify it.
- Validate content before rendering when malformed data could break a page.
- Handle missing content using appropriate not-found behavior.
- Avoid unnecessary duplicate fetching and repeated transformations.

## Routing and Metadata

- Use stable, descriptive URLs.
- Keep article and portfolio routes consistent.
- Implement dynamic routes according to the project's content model.
- Generate static parameters when appropriate for the rendering strategy.
- Provide route-specific metadata when needed.
- Keep canonical URLs and production-domain configuration accurate.
- Avoid duplicate or conflicting metadata.

## Styling and Design Systems

- Follow the project's existing Tailwind CSS version and conventions.
- Reuse shared design tokens and components.
- Prefer CSS logical properties when supporting RTL layouts.
- Avoid scattered global styles and conflicting overrides.
- Keep responsive behavior consistent across related pages.
- Avoid adding a second styling system without a clear reason.

## Error and Loading States

- Provide meaningful loading, error, and not-found behavior where appropriate.
- Avoid blank screens when an expected failure can be handled clearly.
- Keep error messages useful without exposing sensitive implementation details.
- Ensure error boundaries follow the installed Next.js conventions.
- Do not introduce loading indicators for static content when they provide no meaningful value.

## Dependencies and Security

- Prefer existing dependencies when they meet the requirement.
- Review package size, maintenance, and compatibility before adding new packages.
- Keep secrets and private configuration out of client-side code.
- Use environment variables appropriately.
- Never expose API keys or server-only credentials through public environment variables.
- Avoid unsafe HTML rendering and untrusted dynamic content.

## Maintainability

- Use clear file names and consistent exports.
- Avoid circular dependencies.
- Keep configuration centralized where appropriate.
- Remove obsolete code only after confirming it is unused.
- Update related documentation when architecture changes materially.
- Keep the architecture proportional to the project's actual complexity.

## Verification

- Run available lint and TypeScript checks.
- Run relevant tests.
- Build the application for production.
- Check representative routes and dynamic content pages.
- Inspect browser console errors and hydration warnings.
- Verify responsive layouts and RTL behavior after structural changes.

## Completion Standard

The architecture should be easy to understand, aligned with the installed framework version, and flexible enough to support future pages without unnecessary complexity.