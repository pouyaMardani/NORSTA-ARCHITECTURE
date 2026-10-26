# NORSTA — the studio's website

The website of **Norsta**, a microcement and patina studio: an Instagram
showcase, a project gallery, a Persian magazine and a microcement academy. It is
a standalone **Next.js (App Router) + React + TypeScript** project, written in
Persian (`fa-IR`), served from **https://norsta.ir**.

Its visual language began as a faithful reconstruction of the single-page
reference site **https://architecture-showcase.verdent.app/** — layout, type
scale, colour tokens, section order, imagery, transitions and responsive
behaviour were ported from it — and the site has since been re-branded and
localised: the copy, the contact block, the structured data, the package name and
the Instagram links all name Norsta.

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

## Brand and deployment

| fact | value |
| --- | --- |
| Brand | `NORSTA` (the wordmark stays `NORSTA HOME`) |
| Production origin | `https://norsta.ir` |
| Language | Persian, `fa-IR`, in an LTR shell |
| Instagram | `@norsta.home` — https://www.instagram.com/norsta.home/ |

The origin is one fact in one place: `lib/site.ts` reads `NEXT_PUBLIC_SITE_URL`
at **build** time (see `.env.example`), and every canonical link, `og:url`,
`twitter:image`, JSON-LD `@id`, sitemap entry and `robots.txt` sitemap line is
written against it. Set it to `https://norsta.ir` in the production environment
before the build; left unset, a build falls back to that same origin, and only
`next dev` falls back to `http://localhost:3000`.

The Instagram handle is named once too — `SITE_INSTAGRAM_HANDLE` and
`SITE_INSTAGRAM_URL` in `lib/site.ts`. The showcase, the contact block, the
academy's purchase enquiry and the `Organization` node all read it, so the site
cannot end up pointing at two different accounts.

That account is Norsta's only published contact route. The reference studio's
Copenhagen address and its e-mail were removed rather than re-pointed, because no
street address, telephone number or e-mail for Norsta has been supplied — and
inventing one is not an option. `components/Contact.tsx` and
`lib/structured-data.ts` are the two places that would state them.

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
  Contact.tsx         The contact block: copy, the Instagram account, the CTA
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
