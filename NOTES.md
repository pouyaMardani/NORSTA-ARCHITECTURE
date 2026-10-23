# Notes — deviations from the reference

The goal was a faithful reconstruction of `https://architecture-showcase.verdent.app/`.
Everything below is either a deliberate technical adaptation or a point that could
not be reproduced 1:1. Nothing about the visual design, copy, section order or
layout was intentionally changed.

## Intentional technical adaptations

1. **Fonts are self-hosted instead of loaded from the Google Fonts CDN.**
   The reference uses
   `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap">`.
   This build loads the *same two families at the same weights* through
   `next/font/google`, which downloads and self-hosts the same font files at build
   time. Glyph shapes are identical; the only observable difference is that the
   request goes to `/_next/static/media/...` instead of `fonts.gstatic.com`.
   `next/font` also applies its own fallback-font metric overrides, which only
   affects the pre-swap fallback rendering.

2. **`<img>` → `next/image` for the six photographic images.**
   The reference uses plain `<img>` elements with global
   `img { width:100%; height:100%; object-fit:cover }`. Because every image sits in
   a wrapper that already establishes the box (`.hero-image` 66% height,
   `.about-image` 4/5, `.proj figure` 4/3 & 5/6, `.contact-image`) with
   `overflow:hidden`, this build uses `next/image` with `fill` plus
   `style={{ objectFit: "cover" }}` and the same `sizes` hint, which produces the
   same crop and composition while letting Next.js re-encode the (very large)
   source PNGs. To support this, `position: relative` was added to
   `.about-image` and `.proj figure` — inert for the rest of the layout.

3. **The lightbox image is still a plain `<img>`.**
   `.lb-img` relies on intrinsic sizing (`width:auto; height:auto`) with
   `object-fit: contain` and a `max-height:calc(100vh - 180px)` cap, which
   `next/image` cannot express without fixing dimensions. The rule is kept
   verbatim and the ESLint `no-img-element` warning is disabled inline with an
   explanatory comment.

4. **A smaller hero poster.**
   The reference sets `<video poster="images/hero-villa.png">` — a 6.2 MB PNG. The
   original asset is preserved in `public/images/hero-villa.png`, but the poster
   attribute points at `hero-villa-poster.jpg`, a 1920 px wide JPEG derived from
   it, so the poster does not cost multiple megabytes before the video starts.

5. **Interactions moved from a global script into one client component.**
   The reference loads a vanilla `script.js` with an IIFE that wires up six
   behaviours. This build ships the identical logic inside
   `components/SiteInteractions.tsx` (`"use client"`), which mounts once, wires the
   same listeners on the server-rendered DOM, and tears them down on unmount.
   Behaviour (delays, easing inputs, thresholds, `rootMargin`, the 4 s reveal
   safety net, `1600 ms` counters with cubic ease-out, `0.18` parallax factor,
   the nav hide/show thresholds, `Esc` / `←` / `→`) is copied value-for-value.
   All `.is-in`, `.is-loaded`, `.is-scrolled`, `.is-hidden`, `.lb-open` and
   `#lightbox.is-open` class contracts are unchanged.

6. **`<main>` wrapper added** around the section sequence for semantics. It has no
   styling and does not affect layout.

7. **`app/layout.tsx` also declares `viewport` explicitly**
   (`width=device-width, initial-scale=1`) — the same values the reference
   hard-codes in its `<meta name="viewport">`.

## Things that could not be verified

* **No automated pixel-diff against the live reference.** Visual verification was
  done by rendering both the reference and this recreation in a headless
  Chromium (Microsoft Edge) at the same viewport sizes and comparing the
  resulting screenshots by eye / measurement. Captures do not include
  mid-animation frames, so the entrance transitions are compared by their
  end state.
* **The reference's own scroll-triggered reveals** depend on
  `IntersectionObserver` timing; on a static screenshot the reference page may
  show elements in their pre-reveal state. Both pages were therefore captured
  after allowing the reveal safety-net to complete, and with
  `prefers-reduced-motion` off.
* **The reference page injects a third-party script**
  (`/__verdent/deploy-badge.js`) that renders a deployment badge in the corner.
  It is a hosting artefact of the reference deployment, not part of the design,
  and is not reproduced.
* **`images/hero.mp4`** was downloaded verbatim and is served as-is; its codec and
  bitrate are unchanged, so no re-encoding artefacts are introduced.

## Verified identical

* All visible copy, in order: wordmark, nav, hero headline/subhead/CTA, the four
  numbered practice areas and their descriptions, the Studio body copy and both
  metrics, the works heading/lede and all three projects with their locations,
  the contact block, address, note, CTA and the footer.
* Section order and anchors: `#top`, `#services`, `#about`, `#work`, `#contact`.
* All colour tokens, spacing values, type sizes/weights/letter-spacing, aspect
  ratios, masks, gradients and hover/transition behaviour (the stylesheet is a
  verbatim port).
