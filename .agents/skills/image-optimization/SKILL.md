---
name: image-optimization
description: Optimize website images for visual quality, loading speed, responsive delivery, accessibility, and layout stability. Use when implementing galleries, portfolios, hero images, or image-heavy pages.
---

# Image Optimization

## Inspect Before Optimizing

- Inspect the existing image assets, formats, dimensions, and usage.
- Identify which images appear above the fold and which are below the fold.
- Preserve the visual details important to the subject.
- Do not replace original project photography without approval.
- Never fabricate portfolio images or present generated images as real completed projects.

## Image Formats

- Prefer modern formats such as AVIF or WebP when supported by the project's image pipeline.
- Retain appropriate fallbacks when required.
- Use JPEG or PNG when they are better suited to the asset or existing workflow.
- Avoid converting images blindly when the result harms visual quality.
- Choose compression settings based on visual inspection and file size.

## Next.js Image Handling

- Prefer next/image for website images when appropriate.
- Provide meaningful width and height or a stable aspect ratio to prevent layout shifts.
- Use responsive sizing that matches the actual rendered layout.
- Configure sizes for responsive images rather than sending desktop-sized assets to every device.
- Use priority or preload behavior only for the most important above-the-fold images when justified by the installed Next.js version.
- Do not prioritize every image in a gallery.
- Use lazy loading for appropriate below-the-fold images.
- Follow the project's Next.js version and image configuration requirements.
- Configure remote image hosts explicitly when external image sources are used.

## Portfolio Galleries

- Use consistent image ratios when they support the design.
- Use object-fit and object-position intentionally.
- Preserve important details in microcement and patina photography.
- Check image crops at mobile, tablet, and desktop sizes.
- Avoid downloading every full-resolution gallery image on initial page load.
- Consider thumbnails or appropriately sized responsive assets for gallery previews.
- Load full-resolution images when users open a lightbox or request a larger view, when appropriate.
- Ensure gallery controls remain usable on touch devices and with a keyboard.

## Loading and Layout Stability

- Reserve the image's display space before loading.
- Avoid changing image dimensions after rendering.
- Use blur placeholders or other placeholders only when useful and properly implemented.
- Do not use a heavy placeholder that costs more than the benefit it provides.
- Prevent images from causing horizontal overflow.
- Avoid lazy-loading the image that is expected to be the page's Largest Contentful Paint element without a justified reason.

## Accessibility

- Write useful alt text for informative images.
- Describe the relevant subject rather than stuffing keywords into alt text.
- Use empty alt text for purely decorative images.
- Avoid repeating the same generic alt text across an entire gallery.
- Ensure image controls and lightboxes have accessible names and keyboard behavior.

## Asset Management

- Keep image filenames meaningful and consistent.
- Store assets in a clear, maintainable structure.
- Avoid duplicate files when an existing optimized asset can be reused.
- Preserve original source images when needed for future edits.
- Do not delete source assets without confirming they are no longer needed.
- Do not introduce external image services without checking project requirements and configuration.

## Verification

- Inspect actual image quality at realistic display sizes.
- Check image payload sizes and network requests in browser DevTools.
- Test mobile and desktop image delivery.
- Verify that images load without layout shifts.
- Confirm the production build handles image optimization correctly.
- Record any image optimization limitations.

## Completion Standard

Images should remain visually convincing while loading efficiently, adapting to different screens, remaining accessible, and avoiding unnecessary bandwidth usage.