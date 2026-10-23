---
name: typography-and-layout
description: Create readable, balanced page layouts with clear typography, consistent spacing, strong hierarchy, and support for multilingual and RTL content. Use when designing content-heavy or editorial pages.
---

# Typography and Layout

## Typography System

- Define a small, consistent type scale for headings, body text, labels, and captions.
- Choose readable line heights and sensible line lengths.
- Use font weights to express hierarchy rather than styling every element differently.
- Verify that chosen fonts include the required language glyphs.
- Prefer local or framework-supported font loading when practical.
- Avoid loading unnecessary font families and weights that increase page load time.

## Content Hierarchy

- Make page titles, section headings, body copy, metadata, and actions visually distinct.
- Keep heading order logical as well as visually consistent.
- Break long content into meaningful sections.
- Use lists, summaries, and captions when they improve scanning.
- Avoid oversized headings that crowd out the page's actual content.
- Make important content easy to find without excessive scrolling.

## Spacing and Grid

- Use a consistent spacing scale.
- Align content to a coherent grid.
- Keep related elements close and separate unrelated sections.
- Set readable maximum widths for long-form text.
- Allow layouts to breathe without wasting excessive screen space.
- Use reusable layout primitives rather than arbitrary spacing values.

## Persian and RTL

- Confirm document language and direction are set correctly for the page.
- Check punctuation, numbers, Latin terms, URLs, and mixed-direction text.
- Prefer CSS logical properties when they support both LTR and RTL layouts.
- Review icon direction and alignment rather than automatically mirroring every icon.
- Ensure headings and buttons do not clip due to font metrics or line height.
- Test Persian text in the actual chosen font and browser.
- Verify that mixed Persian and English content remains readable.

## Responsive Behavior

- Check wrapping and hierarchy on mobile, tablet, and desktop.
- Reduce unnecessary line length on wide screens.
- Avoid orphaned labels, cramped buttons, and awkward heading breaks.
- Ensure the reading experience remains comfortable at browser zoom.
- Adjust typography fluidly when this improves readability.

## Editorial and Portfolio Layouts

- Make long-form articles easy to scan using headings, paragraphs, lists, and appropriate media.
- Keep article text width comfortable for reading.
- Use consistent image ratios and captions across portfolio grids.
- Avoid layouts that force important text over busy imagery.
- Keep gallery labels and project information legible on small screens.

## Verification

- Review real page content, not just placeholder text.
- Test the intended fonts in the target browsers.
- Inspect RTL alignment and mixed-language content.
- Check line length, contrast, spacing, and overflow at several widths.
- Verify that typography does not cause unexpected layout shifts.

## Completion Standard

Typography and layout should make content easy to scan and read while remaining consistent with the product's brand and language.