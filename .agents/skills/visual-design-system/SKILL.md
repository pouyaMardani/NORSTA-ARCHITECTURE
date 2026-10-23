---
name: visual-design-system
description: Establish a coherent visual language with reusable color, spacing, typography, surface, border, and component rules. Use when creating or refining a frontend design system.
---

# Visual Design System

## Inspect First

- Review the brand brief, existing UI, CSS, and installed styling tools.
- Identify the intended mood and audience before choosing visual treatments.
- Reuse an existing design system when it meets the requirements.
- Avoid introducing a component library or design dependency without a concrete benefit.

## Design Foundations

Define consistent rules for:

- Brand and semantic colors.
- Typography scale, line height, and font weights.
- Spacing and layout widths.
- Border widths and radii.
- Shadows and surface elevation.
- Icon style and sizing.
- Responsive breakpoints.
- Focus, hover, active, disabled, and error states.

## Design Tokens

- Prefer named, reusable design tokens over scattered one-off values.
- Use semantic tokens such as background, foreground, muted, border, primary, and destructive when appropriate.
- Keep contrast and meaning consistent across the site.
- Support light and dark themes only when they are part of the requirements.
- Avoid creating many near-identical colors or spacing values.

## Component Consistency

- Define shared patterns for buttons, links, cards, fields, navigation, badges, and content sections.
- Keep variants limited and purposeful.
- Use consistent dimensions and behavior for components with the same role.
- Avoid one-off styling that makes related pages feel like different products.

## Brand Expression

- Make the design distinctive through a small number of deliberate choices.
- Match imagery, typography, color, and spacing to the brand's character.
- Avoid generic template appearance where the brief calls for a premium or bespoke feel.
- Do not let visual effects reduce readability or page performance.

## Maintainability

- Keep tokens and global styles organized.
- Avoid conflicting overrides and repeated magic numbers.
- Document only decisions that are not obvious from the implementation.
- Follow the project's installed CSS framework version.
- Avoid duplicating design tokens across components.

## Verification

- Compare related pages and components for consistency.
- Test both themes if supported.
- Check contrast, typography, and component states.
- Run available lint, type, and build checks.

## Completion Standard

The UI should feel like one coherent product, with reusable visual rules rather than unrelated collections of styles.