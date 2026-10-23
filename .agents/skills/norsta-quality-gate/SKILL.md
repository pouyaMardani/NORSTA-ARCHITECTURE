---
name: norsta-quality-gate
description: Apply Norsta's project-specific completion checklist before marking roadmap tasks complete. Verify functionality, responsiveness, Persian RTL, image quality, accessibility, performance, SEO, and production build status.
---

# Norsta Quality Gate

## Project Rules

- Treat the Norsta roadmap as the source of truth for implementation progress.
- Inspect the existing project and relevant task requirements before making changes.
- Preserve the agreed stack unless the project owner approves a change.
- Use the installed Next.js App Router, React, TypeScript, and Tailwind CSS versions.
- Do not introduce a Python backend, database, CMS, authentication, or admin panel unless explicitly approved.
- Prioritize professional design, fast loading, responsive behavior, and authentic portfolio content.
- Do not claim that an untested feature works.

## Before Implementation

- Identify the exact task and its acceptance criteria.
- Inspect the files and components related to the task.
- Identify dependencies and potential regressions.
- Reuse existing components and utilities where appropriate.
- Avoid changing unrelated parts of the application.
- If requirements conflict or essential information is missing, explain the issue before making a risky assumption.

## Functional Quality

Verify the relevant requirements for the task:

- Navigation links lead to the intended pages.
- Buttons and interactive controls work.
- Mobile navigation opens and closes correctly.
- Article cards link to the correct article routes.
- Portfolio cards link to the correct project routes when detail pages exist.
- Galleries and lightboxes behave correctly when implemented.
- Theme switching works if both themes are part of the approved design.
- Missing content and invalid routes have appropriate behavior.
- No required feature is silently replaced with a nonfunctional placeholder.

## Responsive Quality

Inspect the actual rendered page at representative viewport widths.

At minimum, consider:

- Narrow mobile around 320–375 CSS pixels.
- Typical mobile around 390–430 CSS pixels.
- Tablet or compact laptop.
- Desktop around 1280 CSS pixels or wider.

Check:

- Horizontal overflow.
- Navigation and menu behavior.
- Heading and paragraph wrapping.
- Button and control usability.
- Gallery layout and image crops.
- Footer and section alignment.
- Dialogs and overlays.
- RTL alignment and mixed Persian/English text.

Do not mark responsive testing complete if only the source code was reviewed.

## Persian and RTL Quality

- Verify the correct document language and text direction.
- Test actual Persian content in the browser.
- Check typography, line height, punctuation, numbers, and mixed-direction text.
- Verify navigation, cards, buttons, and article layouts in RTL.
- Check that icons and directional controls behave appropriately.
- Ensure content remains readable on mobile screens.

## Portfolio and Image Quality

- Use authentic, approved Norsta project photography.
- Never present generated or stock imagery as completed Norsta work.
- Check that referenced image files exist.
- Verify meaningful alternative text for informative images.
- Inspect image quality and crops at different viewport sizes.
- Check image sizing, loading behavior, and layout stability.
- Avoid loading all large gallery assets immediately when unnecessary.
- Do not alter images in ways that misrepresent the actual work.

## Performance Quality

- Run a production build when appropriate.
- Inspect unnecessarily large dependencies and client-side components when relevant.
- Check image optimization and responsive delivery.
- Verify that the main content is not delayed by unnecessary scripts or rendering work.
- Avoid adding libraries or animations without a clear benefit.
- Use browser DevTools or Lighthouse when available.
- Record actual measurements when performance testing is performed.
- Do not invent performance scores or claim measured improvements without evidence.

## Accessibility Quality

- Use semantic HTML.
- Check heading hierarchy and accessible names.
- Verify keyboard navigation and visible focus indicators.
- Review image alternative text.
- Check form labels and validation messages where applicable.
- Inspect contrast and reduced-motion behavior.
- Use automated accessibility tools when available, supplemented by manual checks.

## SEO and Content Quality

- Verify page titles and metadata where applicable.
- Check canonical URLs and production-domain assumptions.
- Inspect internal links and dynamic routes.
- Verify sitemap and robots behavior when implemented.
- Ensure content is accurate and written in natural Persian.
- Avoid unsupported claims, fake testimonials, invented project details, and keyword stuffing.
- Do not claim search engine indexing or ranking success without evidence.

## Required Technical Checks

Inspect package.json before deciding which commands are available.

Run applicable checks, such as:

- Lint.
- TypeScript type checking.
- Relevant automated tests.
- Production build.

Use the project's existing scripts and tools.

- Do not assume a script exists without inspecting the repository.
- Do not claim a check passed unless it completed successfully.
- If a command fails, investigate and report the failure.
- If a check cannot run because of an environment limitation, state that limitation explicitly.
- Fix regressions caused by the current task before declaring completion.

## Roadmap Discipline

- Review the task's acceptance criteria before marking it complete.
- Mark a task complete only when its required implementation and verification are finished.
- Do not mark a task complete merely because code was generated.
- If implementation is complete but testing is pending, leave the task incomplete or explicitly mark verification as pending using the roadmap's existing convention.
- Preserve existing task descriptions and unrelated progress.
- Do not mark future or unrelated tasks as complete.
- Update the roadmap only after reviewing the actual changes and test results.

## Completion Report

For each significant task, report:

1. What was implemented.
2. Which files were changed.
3. Which tests or checks were executed.
4. Which checks passed or failed.
5. Whether responsiveness was inspected.
6. Whether performance was measured or only reviewed.
7. Any unresolved issues or required owner approval.

## Completion Standard

A task may be marked complete only when its acceptance criteria are satisfied and the applicable checks have been executed successfully. Report untested areas honestly and never confuse implementation with verification.