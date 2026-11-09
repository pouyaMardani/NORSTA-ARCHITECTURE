import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Maintenance mode.
 *
 * `MAINTENANCE_MODE=1` turns the whole site into the 503 page: every request
 * is rewritten to `/unavailable` and answered with HTTP 503, so a visitor —
 * and a search engine — is told plainly that the absence is temporary. The
 * maintenance page itself answers normally, and the static assets it is built
 * from (`/_next/*`, the favicons, the public images) stay reachable, so the
 * page still renders in full instead of arriving unstyled.
 *
 * Anything else — including the flag unset, which is the default — serves the
 * site normally. The flag is read at request time, not build time, so turning
 * maintenance on or off is a restart (or a redeploy with the variable), never
 * a rebuild of the pages.
 */
export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "1") return NextResponse.next();
  if (request.nextUrl.pathname === "/unavailable") return NextResponse.next();
  return NextResponse.rewrite(new URL("/unavailable", request.url), {
    status: 503,
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|apple-touch-icon|images).*)",
  ],
};
