---
name: core-web-vitals
description: Measure and improve Core Web Vitals, including Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift. Use when diagnosing loading, interaction responsiveness, or visual stability issues.
---

# Core Web Vitals

## Core Metrics

Understand and evaluate these metrics:

- Largest Contentful Paint (LCP): how quickly the main visible content loads.
- Interaction to Next Paint (INP): how responsive the page is to user interactions.
- Cumulative Layout Shift (CLS): how much unexpected visual movement occurs during loading.

Use current official metric definitions and thresholds when evaluating results.

## Measure Before Optimizing

- Establish a baseline before changing code whenever possible.
- Use field data when available to understand real user experience.
- Use Lighthouse and browser DevTools for controlled diagnostic tests.
- Distinguish field measurements from lab measurements.
- Do not assume one local test represents every user, device, or network.
- Do not invent scores or claim that a metric has improved without evidence.

## Largest Contentful Paint

Investigate:

- Slow server responses.
- Delayed discovery of the main image or text.
- Oversized hero images.
- Unnecessary render-blocking resources.
- Excessive client-side JavaScript before primary content appears.
- Incorrect loading priorities.
- Unnecessary third-party scripts.

Prefer targeted fixes:

- Optimize the actual LCP resource.
- Ensure critical images can be discovered early.
- Avoid lazy-loading the LCP image when it should load immediately.
- Use responsive image delivery.
- Reduce unnecessary work before primary content renders.
- Review server response time and rendering behavior.

## Interaction to Next Paint

Investigate:

- Long JavaScript tasks on the main thread.
- Expensive event handlers.
- Excessive rendering after interactions.
- Large client-side bundles.
- Heavy third-party scripts.
- Unnecessary component updates.

Prefer targeted fixes:

- Reduce unnecessary client-side JavaScript.
- Break up expensive work where appropriate.
- Keep event handlers efficient.
- Avoid rendering large parts of the page after minor interactions.
- Preserve correct behavior and accessible feedback.
- Measure real interactions when field data is available.

## Cumulative Layout Shift

Investigate:

- Images without reserved dimensions.
- Fonts that cause major layout changes.
- Dynamically inserted banners or widgets.
- Content that appears above already-rendered content.
- Unstable ad, embed, or media containers.
- Responsive layout changes that cause unexpected movement.

Prefer targeted fixes:

- Reserve space for images and embeds.
- Define stable aspect ratios.
- Avoid inserting content above existing content unexpectedly.
- Use appropriate font-loading strategies.
- Keep loading placeholders close to the final layout.
- Do not disable useful functionality merely to hide layout shifts.

## Next.js and React

- Follow the installed Next.js and React versions.
- Keep Client Components limited to functionality that requires them.
- Use appropriate image optimization and responsive sizing.
- Avoid unnecessary JavaScript and third-party dependencies.
- Use stable component keys and predictable rendering.
- Do not introduce hydration errors while optimizing rendering.
- Validate the production build rather than relying only on development mode.

## Testing Conditions

- Record the device profile, viewport, network settings, and tool used when practical.
- Compare equivalent test conditions before and after changes.
- Check mobile performance, not only desktop performance.
- Repeat unstable measurements when needed.
- Use field data where available to assess real-world results.
- Document when field data is unavailable.

## Verification

- Capture available LCP, INP, and CLS measurements.
- Review diagnostic opportunities and their likely impact.
- Fix high-impact causes before minor issues.
- Re-test after changes.
- Verify that visual quality, accessibility, and functionality remain intact.

## Completion Standard

A page is not considered performance-verified merely because it loads locally. Record the measurements available, the test conditions, the changes made, and any remaining uncertainty.