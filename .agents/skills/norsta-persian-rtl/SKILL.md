---
name: norsta-persian-rtl
description: Implement and verify Persian-language interfaces for Norsta, including RTL layout, typography, mixed Persian and English text, responsive behavior, accessibility, and correct bidirectional rendering.
---

# Norsta Persian and RTL

## Language and Direction

- Treat Persian as the primary website language unless the project owner changes this requirement.
- Set the correct document language and text direction at the appropriate document level.
- Verify that the rendered HTML uses lang="fa" and dir="rtl" where appropriate.
- Avoid relying on CSS alone to correct an incorrectly configured document direction.
- Keep text direction and language configuration consistent across layouts and pages.
- Do not add a second language or language switcher unless requested.

## Layout and CSS

- Prefer CSS logical properties when they improve RTL and responsive support.
- Use margin-inline-start, margin-inline-end, padding-inline-start, padding-inline-end, and logical border properties where appropriate.
- Avoid unnecessary left/right-specific styling that breaks when direction changes.
- Verify the alignment of navigation, cards, buttons, breadcrumbs, forms, and footers.
- Do not mirror every icon automatically.
- Check directional icons, arrows, progress indicators, and navigation controls individually.
- Prevent horizontal overflow caused by RTL layout or mixed-direction content.

## Persian Typography

- Use a readable Persian-compatible font with the required glyph coverage.
- Inspect the project's existing font setup before introducing a new font.
- Prefer an efficient font-loading strategy.
- Avoid loading unnecessary font families and weights.
- Set suitable font sizes and line heights for Persian glyphs.
- Check that diacritics and glyphs are not clipped.
- Ensure headings, buttons, captions, and long-form content remain readable.
- Keep typography consistent across the website.

## Mixed-Direction Text

- Test paragraphs that contain Persian text alongside English terms, URLs, technical names, or numbers.
- Use appropriate direction isolation for inline content that must preserve its own direction.
- Apply dir="ltr" selectively to content such as URLs or technical strings when necessary.
- Avoid applying LTR direction to an entire Persian paragraph merely because it contains an English word.
- Verify punctuation, brackets, dates, phone numbers, and Latin product or technology names.
- Use semantic HTML and suitable Unicode bidirectional handling instead of inserting arbitrary spacing characters.

## Persian Content Quality

- Use natural, clear, professional Persian.
- Preserve the correct terminology for microcement, patina, surface preparation, application methods, and maintenance.
- Define technical terms when needed for the intended audience.
- Avoid awkward machine-translated phrasing and unnecessary English words.
- Do not invent technical or material claims.
- Use consistent spelling and terminology throughout articles, headings, buttons, and image captions.

## Navigation and Interactions

- Verify mobile menus in RTL layouts.
- Keep icons, labels, and control positions visually coherent.
- Ensure keyboard focus order follows a logical reading and interaction order.
- Test dropdowns, galleries, dialogs, theme controls, and forms.
- Do not assume visual alignment alone guarantees correct keyboard behavior.
- Avoid interactions that require hover on touch devices.

## Accessibility

- Provide meaningful accessible names for controls.
- Use appropriate labels for forms.
- Keep focus indicators visible in RTL layouts.
- Maintain sufficient text and control contrast.
- Write meaningful alt text in Persian when Persian is the primary content language.
- Keep heading hierarchy semantic and logical.
- Respect reduced-motion preferences.

## Responsive Verification

Test representative narrow, medium, and wide viewports.

Check for:

- Clipped Persian headings.
- Overlapping text and icons.
- Buttons with insufficient space.
- Incorrect gallery alignment.
- Broken mixed-direction strings.
- Unintended horizontal scrolling.
- Footer and navigation alignment problems.
- Incorrect line breaks in article content.

## Verification

- Inspect the rendered page in a real browser.
- Test actual Persian content rather than relying only on English placeholders.
- Verify document language and direction.
- Review typography and mixed-direction text.
- Test keyboard navigation and responsive behavior.
- Run relevant project checks after changes.

## Completion Standard

Persian content must render naturally, read comfortably, and maintain correct RTL behavior across supported viewports and interactions.