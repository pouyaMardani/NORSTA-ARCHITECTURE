---
name: responsive-design
description: Build and verify interfaces that adapt reliably across mobile, tablet, laptop, and large desktop screens. Use when creating or reviewing responsive layouts and navigation.
---

# Responsive Design

## Mobile-First Approach

- Start with a usable narrow-screen layout, then enhance it for wider viewports.
- Base breakpoints on where the content needs to change, not on a device brand.
- Use flexible grids, flex layouts, and fluid sizing where appropriate.
- Avoid fixed widths that cause overflow on smaller screens.
- Follow the responsive conventions of the project's existing framework.

## Layout Checks

Review at minimum:

- Narrow mobile viewport around 320–375 CSS pixels.
- Typical mobile viewport around 390–430 CSS pixels.
- Tablet or compact laptop viewport.
- Desktop viewport around 1280 CSS pixels or wider.

These are practical test sizes, not a substitute for checking intermediate widths.

## Navigation

- Ensure menus work with touch, keyboard, and pointer input.
- Prevent menus from overflowing the viewport.
- Make open and closed states clear.
- Keep important navigation reachable on mobile.
- Do not rely on hover-only interactions.
- Ensure mobile navigation can be opened and closed accessibly.

## Typography and Content

- Avoid clipped headings, unreadable text, and excessively long line lengths.
- Use responsive type sizes when appropriate.
- Check Persian/RTL and other supported languages for wrapping and alignment.
- Keep buttons and form controls usable at narrow widths.
- Prevent long URLs and unbroken strings from causing horizontal overflow.

## Images and Media

- Prevent images from stretching or overflowing.
- Use suitable aspect ratios and object positioning.
- Verify image crops at different widths.
- Avoid layout shifts by reserving image dimensions or aspect ratios.
- Ensure galleries and sliders remain usable on touch devices.
- Use responsive image techniques and avoid downloading unnecessarily large assets on mobile.

## Common Failure Modes

- Horizontal scrolling caused by fixed widths or long unbroken text.
- Tiny tap targets.
- Dialogs taller or wider than the viewport.
- Cards that become too narrow or too tall.
- Footer columns that do not reflow.
- Sticky elements that cover important content.
- Navigation that becomes inaccessible on touch devices.
- Images that cause layout shifts while loading.

## Verification

- Inspect the rendered site at multiple viewport widths.
- Test navigation, forms, galleries, dialogs, and interactive controls.
- Check browser developer tools for overflow and console errors.
- Fix root causes rather than hiding overflow indiscriminately.
- Verify both LTR and RTL layouts if the project supports them.

## Completion Standard

Do not mark a page responsive until key layouts and interactions have been checked at narrow, medium, and wide widths.