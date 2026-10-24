"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Header + primary navigation.
 *
 * Desktop presentation is unchanged: the wordmark sits left and the section
 * links sit right. Below the mobile breakpoint the links collapse into a minimal
 * slide-down panel toggled by a hamburger button.
 *
 * The link elements are always mounted (the panel is shown/hidden with classes
 * rather than conditional rendering) so that `SiteInteractions` keeps its
 * delegated `#`-anchor listeners and its scroll-lock behaviour intact, and so
 * nothing re-mounts when the menu opens and closes.
 */

/**
 * Every section of the home page, top to bottom.
 *
 * The list is a map of `app/page.tsx`, not a second opinion about it: each
 * `href` is that section's own `id`, and the order below is the order the
 * sections are actually stacked in. Keep the two in step — if a section moves
 * or is renamed, move its entry here with it. `Hero` owns `#top`, so "خانه" is
 * an in-page jump rather than a route, which is also what makes it work away
 * from the home page (`/#top` in `NAV_LINKS_FROM_HOME`).
 */
const LINKS = [
  { href: "#instagram", label: "اینستاگرام" },
  { href: "#contact", label: "تماس با ما" },
  { href: "#craft", label: "استادکار" },
  { href: "#journal", label: "مجله" },
  { href: "#work", label: "پروژه‌ها" },
  { href: "#about", label: "درباره ما" },
  { href: "#services", label: "خدمات" },
  { href: "#top", label: "خانه" },
] as const;

/** One link as the header renders it. */
type NavLink = { href: string; label: string };

/** On the home page the eight labels are the page's own anchors, verbatim. */
const NAV_LINKS: NavLink[] = LINKS.map((link) => ({
  href: link.href,
  label: link.label,
}));

/**
 * On every other route the same eight labels point back at the home page's
 * sections, so the header stays useful on `/articles` — an anchor without a `/`
 * would simply do nothing away from the home page.
 */
const NAV_LINKS_FROM_HOME: NavLink[] = LINKS.map((link) => ({
  href: `/${link.href}`,
  label: link.label,
}));

/**
 * Routes painted on the magazine's dark ground, which need the header's dark
 * variant. The home page is not one of them, so its header is unchanged.
 */
const DARK_ROUTES = ["/articles"];

/**
 * Matches the hamburger breakpoint in `globals.css` (the `≤860px` block). Eight
 * section labels no longer fit one comfortable row below that, so the panel
 * takes over there. `Nav` tracks only this one query; every other breakpoint
 * belongs to the stylesheet.
 */
const MOBILE_QUERY = "(max-width: 860px)";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Route awareness. On `/` the anchors stay exactly as they were; elsewhere they
  // are rewritten to point at the home sections, and the dark magazine routes
  // also switch the header to its dark variant.
  const pathname = usePathname();
  const isHome = pathname === "/";
  const links = isHome ? NAV_LINKS : NAV_LINKS_FROM_HOME;
  const isDark = DARK_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Track the viewport so `inert`/`aria-hidden` are only applied on mobile.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Collapse the menu whenever the desktop layout takes over.
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Close with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Freeze the page behind the open panel.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  // Only meaningful on mobile: while collapsed the links are inert and hidden
  // from assistive technology, so they can't be tabbed into or clicked.
  const collapsed = isMobile && !open;

  return (
    <header
      /* `className` is intentionally static: SiteInteractions writes
         `is-scrolled` / `is-hidden` onto this element imperatively, and a
         React-controlled className would wipe them on every re-render.
         Menu state is therefore exposed as a data attribute instead. The
         header deliberately has no entrance animation (see `globals.css` →
         "Above-the-fold entrance"), so it is on screen from the first paint. */
      className="nav"
      data-theme={isDark ? "dark" : undefined}
      data-menu-open={open ? "true" : undefined}
    >
      <a href={isHome ? "#top" : "/#top"} className="brand" onClick={() => setOpen(false)}>
        NORSTA HOME
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-box" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <nav
        id="primary-navigation"
        className="nav-links"
        aria-label="ناوبری اصلی"
        aria-hidden={collapsed}
        inert={collapsed}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
