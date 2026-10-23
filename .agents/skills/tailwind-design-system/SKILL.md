---
name: tailwind-design-system
description: Create consistent, responsive, maintainable interfaces with Tailwind CSS design tokens, reusable patterns, accessible states, and project-specific styling conventions. Use when styling components or establishing a design system.
---

# Tailwind Design System

## Inspect the Existing Setup
- Inspect package.json and the installed Tailwind CSS version.
- Read the existing Tailwind and PostCSS configuration where applicable.
- Follow conventions supported by the installed version.
- Do not mix configuration patterns from incompatible Tailwind versions.
- Preserve existing design tokens and styling conventions.

## Design Tokens
- Define consistent colors, spacing, typography, borders, radii, and shadows.
- Prefer reusable tokens over repeatedly inventing similar values.
- Use semantic color names where appropriate.
- Keep light and dark themes consistent when both are supported.
- Avoid arbitrary values when an existing token or utility already satisfies the requirement.
- Use arbitrary values when genuinely needed.

## Component Styling
- Prefer readable utility combinations.
- Extract shared patterns when doing so improves consistency or maintainability.
- Avoid excessive conditional class logic.
- Use a consistent strategy for class composition and variants.
- Do not add a component library unless requirements justify it.
- Avoid overriding the same style in multiple conflicting places.

## Responsive Design
- Use mobile-first responsive techniques.
- Test narrow, medium, and wide viewport layouts.
- Prevent horizontal overflow and clipped content.
- Ensure text, controls, grids, and images adapt appropriately.
- Avoid relying on a single viewport width.

## Interaction States
- Provide appropriate visual states for hover, keyboard focus, active interaction, disabled controls, and loading or error states where relevant.
- Do not rely on color alone to communicate meaning.

## Accessibility
- Preserve semantic HTML.
- Maintain readable contrast.
- Use visible keyboard focus.
- Respect reduced-motion preferences.
- Ensure interactive targets are usable on touch screens.

## Maintainability
- Avoid duplicating long, nearly identical class strings unnecessarily.
- Keep global CSS limited to genuine global concerns.
- Do not use !important as a routine styling solution.
- Avoid arbitrary z-index values without a coherent layering strategy.
- Do not use CSS tricks that conceal structural or accessibility problems.

## Verification
- Check the rendered interface at relevant viewport sizes.
- Inspect layout, overflow, typography, and interaction states.
- Run available lint, type, and build checks.
- Do not claim responsive correctness without testing.

## Completion Standard
The interface must be visually consistent, responsive, accessible, and maintainable within the project's installed Tailwind version.
