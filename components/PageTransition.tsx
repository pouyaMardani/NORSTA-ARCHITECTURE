"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Elegant page-transition cover.
 *
 * A deep warm-charcoal overlay carrying the Norsta wordmark and a single thin
 * sweeping hairline. It is raised for the moment between “the reader chose a
 * page” and “the new page has committed”, and taken down again on the route
 * change itself — never on a guessed schedule.
 *
 * How it hooks into the App Router
 * ────────────────────────────────
 * The App Router has no navigation lifecycle events (`routeChangeStart` and
 * friends belong to the legacy Pages Router and do not exist here), so the
 * transition is driven by the two facts the router *does* expose:
 *
 *   1. **A qualifying click** — `next/link` navigations are ordinary anchor
 *      activations, so one delegated `click` listener on `document` (capture
 *      phase) sees every internal navigation before it starts. That is the
 *      signal to raise the cover.
 *   2. **`usePathname()` changing** — the hook updates when the new route is
 *      committed. The cover is then dropped on the *next* frame, so what gets
 *      uncovered is the new page's own first paint rather than one last look at
 *      the page the reader has already left.
 *
 * `app/layout.tsx` mounts this once, above every route, so the home page, the
 * magazine, the project gallery and each of their detail pages are all covered
 * by the same component without any of them opting in.
 *
 * What it deliberately does *not* do
 * ──────────────────────────────────
 *   · In-page anchors (`href="#work"`), query-only changes (the archive's
 *     filter chips at `/articles?category=…`) and hash jumps within the current
 *     route all leave the pathname alone, so they never raise the cover.
 *   · External sites, `target="_blank"`, `download`, `mailto:`/`tel:` and
 *     modifier- or middle-clicks are filtered out and navigate untouched.
 *   · It never calls `preventDefault`, so it can never swallow a navigation.
 *   · It never traps focus and is `aria-hidden`, so assistive technology and
 *     the keyboard are unaffected; the destination page stays fully usable.
 *
 * When the cover comes down
 * ─────────
 * The cover ends for one of exactly two reasons: the router committed the new
 * route (the effect below, one painted frame after the commit), or a navigation
 * was *shown* to have ended without one — back/forward, a bfcache restore, the
 * document going away, or the connection dropping. Nothing ends it because a
 * certain number of milliseconds have passed, which is what used to cut a slow
 * navigation short; the only clock left is the short on-screen floor that stops
 * an instant navigation from reading as a flicker.
 *
 * That leaves one invariant to keep, and it lives outside this file: a click
 * that passes the test below must genuinely become a navigation — the router's
 * own client transition (which commits) or the browser's (which unloads the
 * document). No handler may `preventDefault` an internal route link; a control
 * that does needs `data-no-transition` so this component never claims it.
 */

/** A short on-screen floor, so an instant navigation reads as a transition rather than a flicker. */
const MIN_VISIBLE_MS = 260;

/**
 * The hard ceiling. A safety net, not the way the cover normally ends: the
 * pathname change is what takes it down, and this only guarantees that a
 * navigation which never commits cannot strand it.
 */
const MAX_VISIBLE_MS = 1400;

export default function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  /** Mirrors `active` so the listeners never need to be re-attached. */
  const activeRef = useRef(false);
  const ceilingRef = useRef(0);
  const floorRef = useRef(0);
  const shownAtRef = useRef(0);

  /** Take the cover down now. */
  const finish = useCallback(() => {
    if (ceilingRef.current) {
      window.clearTimeout(ceilingRef.current);
      ceilingRef.current = 0;
    }
    if (floorRef.current) {
      window.clearTimeout(floorRef.current);
      floorRef.current = 0;
    }
    if (!activeRef.current) return;
    activeRef.current = false;
    setActive(false);
  }, []);

  /** Drop the cover, honouring the short on-screen floor. */
  const hide = useCallback(() => {
    const remaining = MIN_VISIBLE_MS - (performance.now() - shownAtRef.current);
    if (remaining <= 0) {
      finish();
      return;
    }
    if (floorRef.current) return; // already scheduled
    floorRef.current = window.setTimeout(finish, remaining);
  }, [finish]);

  /** Raise the cover. */
  const show = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    shownAtRef.current = performance.now();
    setActive(true);
    ceilingRef.current = window.setTimeout(finish, MAX_VISIBLE_MS);
  }, [finish]);

  // ---------- 1. A qualifying internal navigation raises the cover ----------
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Only a plain, unmodified primary click counts as a navigation we own.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const node = event.target as Element | null;
      const anchor = node?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      // An explicit opt-out, and everything that leaves the current tab.
      if (anchor.dataset.noTransition !== undefined) return;
      if (anchor.target && anchor.target.toLowerCase() !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel")?.split(/\s+/).includes("external")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return; // an in-page anchor

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.protocol !== "http:" && url.protocol !== "https:") return; // mailto:, tel:, …
      if (url.origin !== window.location.origin) return; // another site

      // A real route change only. The archive's filter chips (`?category=…`)
      // and a hash jump to another section of this same route keep the
      // pathname, and must not raise a full-screen cover.
      if (url.pathname === window.location.pathname) return;

      show();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [show]);

  // ---------- 2. The committed route takes it down ----------
  useEffect(() => {
    // Fires on mount too, where it is a no-op — the cover starts down.
    hide();
  }, [pathname, hide]);

  // ---------- 3. Back/forward and bfcache restores never inherit a cover ----------
  useEffect(() => {
    const onRestore = () => finish();
    window.addEventListener("popstate", onRestore);
    window.addEventListener("pageshow", onRestore);
    return () => {
      window.removeEventListener("popstate", onRestore);
      window.removeEventListener("pageshow", onRestore);
    };
  }, [finish]);

  // ---------- 4. No timers outlive the component ----------
  useEffect(
    () => () => {
      if (ceilingRef.current) window.clearTimeout(ceilingRef.current);
      if (floorRef.current) window.clearTimeout(floorRef.current);
    },
    []
  );

  return (
    <div
      className="route-loader"
      data-active={active ? "true" : undefined}
      aria-hidden="true"
    >
      {/* The wordmark and one hairline: the same restrained vocabulary as the
          header and the footer, rather than a spinner. */}
      <span className="route-loader-mark">
        <span className="route-loader-word">Norsta</span>
        <span className="route-loader-rule">
          <i />
        </span>
      </span>
    </div>
  );
}
