---
name: nextjs-app-router
description: Build Next.js applications using the App Router, Server Components, appropriate client boundaries, routing, metadata, data loading, and framework conventions. Use when implementing or reviewing Next.js applications.
---

# Next.js App Router Best Practices

## Inspect First
- Inspect package.json and the installed Next.js version before using framework APIs.
- Read the existing app structure and project instructions.
- Follow documentation appropriate to the installed version.
- Do not assume APIs from a different Next.js version are available.

## App Router Architecture
- Use the App Router conventions already established by the project.
- Keep routes, layouts, loading states, error boundaries, and not-found handling organized.
- Use route groups and nested layouts when they simplify architecture.
- Avoid unnecessary duplicate layouts or deeply nested route structures.
- Separate shared UI, route-specific UI, and data-access logic appropriately.

## Server and Client Components
- Prefer Server Components when interactivity or browser-only APIs are not required.
- Add the "use client" directive only where client-side functionality is needed.
- Keep client boundaries as narrow as practical.
- Do not access browser-only APIs during server rendering.
- Pass serializable props across Server Component and Client Component boundaries.
- Understand where data fetching and rendering execute before moving logic between server and client.

## Routing and Data
- Use framework-supported navigation and route conventions.
- Choose data-fetching patterns based on the installed Next.js version and actual requirements.
- Handle loading, errors, empty results, and not-found cases.
- Avoid unnecessary client-side fetching when server rendering is more appropriate.
- Use caching and revalidation deliberately; do not assume every request should be cached.
- Never expose server-only secrets or credentials to client code.

## Images, Fonts, and Metadata
- Use next/image appropriately for image optimization.
- Configure allowed remote image sources explicitly when required.
- Prefer next/font or another suitable local font strategy when practical.
- Define meaningful page titles, descriptions, and metadata.
- Add canonical URLs, social metadata, and structured data when justified.
- Ensure metadata accurately reflects the page content.

## Security
- Treat all external input as untrusted.
- Validate data at server boundaries.
- Protect privileged operations and server-only modules.
- Do not mistake hidden UI controls for authorization.
- Avoid unsafe HTML rendering unless content is trusted and properly sanitized.

## Quality and Performance
- Avoid unnecessary client JavaScript.
- Reduce unnecessary layout shifts and expensive rendering.
- Use appropriate loading and error boundaries.
- Inspect bundle impact when adding significant dependencies.
- Respect accessibility, responsive design, and reduced-motion preferences.

## Verification
- Check the installed framework version and official guidance for version-sensitive behavior.
- Run lint, type checks, tests, and a production build when available.
- Inspect browser and terminal errors.
- Do not claim successful deployment without actual deployment evidence.

## Completion Standard
Use Next.js conventions appropriate to the installed version, maintain clear server/client boundaries, and verify the resulting application.
