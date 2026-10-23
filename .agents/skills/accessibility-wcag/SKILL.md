---
name: accessibility-wcag
description: Improve frontend accessibility through semantic HTML, keyboard support, contrast, focus management, labels, alternative text, and reduced-motion support. Use when building or reviewing user interfaces.
---

# Accessibility Best Practices

## Semantic Structure

- Use semantic HTML elements according to their purpose.
- Maintain a logical heading hierarchy.
- Use buttons for actions and links for navigation.
- Use lists, landmarks, and form elements meaningfully.
- Avoid adding ARIA when native HTML already provides the needed semantics.

## Keyboard Access

- Ensure all interactive features work without a mouse.
- Preserve a visible focus indicator.
- Keep keyboard focus order logical.
- Avoid keyboard traps.
- For dialogs and menus, manage focus appropriately and restore it when closed.
- Ensure custom interactive components support expected keyboard controls.

## Forms

- Associate labels with their controls.
- Identify required fields and explain validation errors.
- Make errors understandable to assistive technology.
- Do not communicate errors through color alone.
- Preserve entered values when validation fails where practical.
- Ensure form controls have accessible names.

## Images and Media

- Write meaningful alternative text for informative images.
- Use empty alt text for purely decorative images.
- Avoid repeating nearby text unnecessarily in alt attributes.
- Provide captions or transcripts for meaningful audio/video when required.
- Do not put essential information only inside an image.

## Visual Accessibility

- Maintain sufficient text and UI contrast.
- Do not use color as the only signal.
- Support browser zoom and text resizing.
- Avoid tiny text and overly dense controls.
- Respect prefers-reduced-motion and avoid unnecessary flashing or intense animation.
- Ensure interactive elements have visible focus states.

## ARIA and Dynamic UI

- Add accessible names to icon-only controls.
- Ensure expanded/collapsed states are exposed when relevant.
- Announce important asynchronous status changes appropriately.
- Use ARIA roles and attributes accurately; incorrect ARIA can make interfaces less accessible.
- Keep accessible names consistent with visible labels.

## RTL and Localization

- Use correct document language and text direction.
- Test bidirectional text, mixed-language labels, numbers, and icons.
- Prefer logical CSS properties such as margin-inline-start where suitable.
- Do not assume that mirroring every icon is correct.
- Verify focus order and reading order in RTL interfaces.

## Verification

- Test keyboard-only navigation.
- Inspect focus visibility, labels, heading order, and contrast.
- Use automated accessibility checks as a supplement, not a complete guarantee.
- Review critical flows with assistive-technology considerations.
- Fix issues found during manual and automated testing.

## Completion Standard

Aim for WCAG-aligned behavior and document known gaps. Do not claim full compliance based only on an automated scan.