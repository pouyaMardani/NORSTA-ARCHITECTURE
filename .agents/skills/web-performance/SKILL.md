---
name: web-performance
description: Analyze and improve frontend performance, loading speed, rendering efficiency, JavaScript execution, caching, and runtime behavior. Use when building, reviewing, or optimizing web applications.
---

# Web Performance

## Inspect Before Changing

- Inspect the existing project structure, framework version, dependencies, and build configuration.
- Establish a baseline before making performance changes whenever practical.
- Identify the actual bottleneck before optimizing.
- Avoid rewriting working code without evidence that the change improves performance.
- Preserve existing functionality, accessibility, and visual quality.

## Performance Priorities

- Prioritize the initial page load and the content users see first.
- Avoid unnecessary JavaScript, dependencies, and third-party scripts.
- Prefer browser-native capabilities when they provide a suitable solution.
- Avoid expensive rendering work and unnecessary component updates.
- Keep layouts stable while content loads.
- Avoid blocking the main thread with unnecessary computation.

## Next.js Best Practices

- Follow the project's installed Next.js version and App Router conventions.
- Prefer Server Components when client-side interactivity is not required.
- Add "use client" only where client-side behavior is necessary.
- Keep Client Component boundaries as small as practical.
- Avoid moving large parts of a page to the client without a clear reason.
- Use dynamic imports for appropriate heavy, non-critical client components.
- Avoid unnecessary data fetching and duplicate requests.
- Use framework-supported caching and rendering strategies according to the project's requirements.
- Never assume a caching option behaves identically across Next.js versions.

## JavaScript and Dependencies

- Inspect bundle size when a page includes heavy dependencies.
- Avoid installing packages for functionality that can be implemented simply and safely.
- Remove unused dependencies only after confirming they are not required elsewhere.
- Avoid unnecessary effects, repeated calculations, and duplicate state.
- Use memoization only when it addresses a real performance problem or a clear computational cost.
- Avoid long-running synchronous tasks on the main thread.
- Do not sacrifice maintainability for insignificant micro-optimizations.

## Loading Strategy

- Prioritize essential above-the-fold content.
- Load non-critical features only when appropriate.
- Avoid eagerly loading every gallery image on a long page.
- Use lazy loading for appropriate below-the-fold images and components.
- Do not lazy-load the main LCP image without a justified reason.
- Reserve space for images, embeds, and dynamically loaded content.
- Avoid unnecessary redirects and repeated network requests.

## Third-Party Resources

- Audit analytics, social widgets, embedded content, and external scripts.
- Load third-party resources only when needed.
- Avoid adding scripts that delay critical rendering.
- Confirm the purpose and cost of each new third-party dependency.
- Do not remove required integrations without approval.

## Measurement

- Use browser DevTools, production builds, and appropriate performance tools.
- Compare before-and-after results where possible.
- Separate local development measurements from production performance.
- Check network requests, JavaScript execution, layout shifts, and rendering delays.
- Never invent benchmark scores or claim an improvement that was not measured.

## Verification

- Run the available lint, type-check, and production build commands.
- Test the actual rendered page after optimization.
- Verify that responsive behavior and interactive features still work.
- Document any remaining bottlenecks and measurement limitations.

## Completion Standard

Performance improvements must be evidence-based, preserve required functionality, and avoid introducing unnecessary complexity or visual regressions.