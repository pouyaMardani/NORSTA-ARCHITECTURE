# Monolith Atelier — Next.js recreation

A standalone **Next.js (App Router) + React + TypeScript** project that faithfully
recreates the single-page reference site **https://architecture-showcase.verdent.app/**.

This is a reference-reconstruction, not a redesign: the layout, type scale, colour
tokens, copy, section order, imagery, transitions and responsive behaviour are all
ported from the original page.

---

## Stack

| Concern     | Choice                                              |
| ----------- | --------------------------------------------------- |
| Runtime     | Node.js 20+                                          |
| Framework   | Next.js (App Router, Server Components by default)   |
| UI          | React 19                                             |
| Language    | TypeScript (strict)                                  |
| Styling     | A single structured global stylesheet (`app/globals.css`) |
| Package mgr | npm                                                  |

No component library, CSS framework or animation library is used — the original
page is plain HTML + CSS + one vanilla script, and so is this recreation.

---

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server → http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
```

---

## Project structure

```
app/
  layout.tsx          Root layout: metadata, font loading, global CSS
  page.tsx            The single page — composes the sections in reference order
  globals.css         Full stylesheet ported from the reference styles
components/
  Nav.tsx             Fixed/absolute header + wordmark + nav links
  Hero.tsx            “QUIET MONUMENTS” hero, background video, scroll cue
  Services.tsx        “PRACTICE / Areas of Work” numbered list + edge image
  About.tsx           “STUDIO / Matter & Silence” + animated metrics
  Work.tsx            “SELECTED WORKS / Recent Projects” grid
  Contact.tsx         “GET IN TOUCH / Begin a Quiet Project” + address
  Footer.tsx          Footer rule + studio cities
  Lightbox.tsx        Markup for the project image viewer
  SiteInteractions.tsx  Client component: the port of the reference script.js
public/images/        Reference imagery and the hero video
```

### Server vs. client components

Everything is a **Server Component** except `components/SiteInteractions.tsx`,
the single `"use client"` entry point. It reproduces the reference `script.js`:

* hero entrance state (`is-loaded`) and the masked headline reveal
* the `[data-reveal]` scroll-reveal system (`IntersectionObserver`)
* the animated metric counters
* the hero parallax
* the sticky / auto-hiding navigation
* the project lightbox (open, close, prev, next, `Esc` / `←` / `→`)

Keeping the behaviour in one client component means the markup of the page is
fully server-rendered and the client bundle stays tiny.

---

## Assets

All imagery and the hero video were fetched from the reference site’s public
`/images/` directory and are stored locally in `public/images/`
(no external/remote image hosts are configured, so no `remotePatterns` are needed):

| File | Use in reference | Notes |
| --- | --- | --- |
| `hero.mp4` | Hero background video | reproduced as-is |
| `hero-villa.png` | Hero video poster | kept in full; an additional 1920px JPEG (`hero-villa-poster.jpg`) is used as the actual `<video poster>` to avoid a multi-megabyte poster |
| `services-arch.png` | Practice section edge image | as-is |
| `about-courtyard.png` | Studio section image | as-is |
| `project-minimal-residence.png` | Works — House on the Fjord | as-is |
| `project-corporate-headquarters.png` | Works — Foundry Offices | as-is |
| `project-cultural-center.png` | Works — Tea Pavilion | as-is |
| `contact-stairs.png` | Contact section image | as-is |

Text is served through `next/image`, which re-encodes each source PNG to a
right-sized, modern format at request time.

---

## Typography

The reference loads **Cormorant Garamond** (300/400/500) and **Inter** (300/400/500)
from Google Fonts. This project loads the same two families via `next/font/google`,
so the fonts are self-hosted at build time and exposed as the CSS custom
properties `--font-serif` / `--font-sans` that `globals.css` consumes.

---

## Documenting deviations

See `NOTES.md` for the (short) list of deliberate differences between this
recreation and the reference page.
