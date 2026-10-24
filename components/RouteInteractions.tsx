"use client";

import { usePathname } from "next/navigation";

import Lightbox from "./Lightbox";
import SiteInteractions from "./SiteInteractions";

/**
 * The site's global interaction layer, re-mounted once per route.
 *
 * `SiteInteractions` wires the lightbox by collecting the `.proj` plates that
 * exist the moment it mounts, which is what makes prev/next walk the plates of
 * the page it was mounted for. Inside a shared layout that list goes stale as
 * soon as the router swaps in another page's plates — a project page's gallery
 * is reached from another project page's related row, so this is the normal
 * case, not an edge case. Keying both components on the pathname makes the
 * effect run again for every route, so the lightbox always belongs to the page
 * that is actually on screen and every listener is re-attached (the previous
 * mount's cleanup runs first).
 */
export default function RouteInteractions() {
  const pathname = usePathname();

  return (
    <>
      <Lightbox key={`lightbox-${pathname}`} />
      <SiteInteractions key={`interactions-${pathname}`} />
    </>
  );
}
