---
name: frontend-testing
description: Validate frontend functionality, responsive layouts, accessibility, navigation, browser behavior, and production builds. Use when implementing features, fixing bugs, or reviewing frontend changes.
---

# Frontend Testing

## Inspect Before Testing

- Read the project structure, package scripts, installed testing tools, and existing tests.
- Follow the testing conventions already established in the repository.
- Prefer extending existing test infrastructure over adding redundant frameworks.
- Do not replace configuration or dependencies without a clear reason.
- Identify the expected behavior before writing or running tests.

## Test Pyramid

Use appropriate levels of testing:

- Unit tests for isolated logic and utilities.
- Component tests for meaningful component behavior.
- Integration tests for connected application features.
- End-to-end tests for important user journeys.
- Manual browser checks for visual behavior and responsive layouts.

Do not introduce every test type when the project does not need it.

## Functional Testing

Verify relevant behaviors such as:

- Navigation links and route transitions.
- Mobile menu open and close behavior.
- Buttons and interactive controls.
- Forms and validation messages.
- Gallery navigation and lightbox behavior.
- Theme switching when implemented.
- Article links and dynamic routes.
- Loading, empty, error, and success states where applicable.

Test both expected behavior and important failure cases.

## Responsive Testing

Inspect representative narrow, medium, and wide viewports.

Verify:

- No unintended horizontal overflow.
- Navigation remains usable.
- Text and headings do not clip.
- Images retain their intended proportions.
- Buttons and controls remain accessible.
- Dialogs and overlays fit within the viewport.
- RTL layouts work correctly when required.

Do not claim responsive validation if the rendered page was not inspected at multiple widths.

## Accessibility Testing

- Check semantic structure and heading order.
- Verify keyboard navigation and visible focus.
- Check form labels and accessible names.
- Inspect image alternative text.
- Review contrast and reduced-motion behavior.
- Use automated accessibility checks when available.
- Treat automated results as a supplement to manual testing.

## Browser and Runtime Checks

- Inspect the browser console for relevant errors and warnings.
- Check failed network requests.
- Look for React hydration errors.
- Verify that interactive controls behave correctly.
- Check for missing images, broken links, and unexpected runtime exceptions.
- Avoid dismissing errors without understanding their impact.

## Build and Static Checks

- Run the project's available lint command.
- Run the type checker when configured.
- Run relevant unit or integration tests.
- Run the production build.
- Use the package manager and scripts defined by the repository.
- Do not assume a script exists without inspecting package.json.
- Do not claim a check passed unless it actually completed successfully.
- If a command cannot run because of the environment, report that limitation clearly.

## Visual Regression and Browser Automation

- Reuse installed browser automation or visual testing tools where available.
- Add new testing dependencies only when their value justifies the setup cost.
- Capture screenshots when they help compare a design before and after changes.
- Test critical user journeys in a real browser when possible.
- Do not treat a screenshot alone as proof that interactions work.

## Bug Fix Workflow

1. Reproduce the problem.
2. Identify the likely cause.
3. Implement the smallest suitable fix.
4. Add or update a regression test when practical.
5. Re-run the relevant tests.
6. Inspect related functionality for regressions.
7. Report the result and any remaining limitations.

## Completion Report

After completing a task, summarize:

- What changed.
- Which checks were executed.
- Which checks passed or failed.
- Whether the production build succeeded.
- Whether responsive behavior was verified.
- Any remaining issues or untested areas.

## Completion Standard

Never mark a task fully verified solely because the code was written. Run the applicable checks, inspect the actual behavior, and clearly report anything that could not be tested.