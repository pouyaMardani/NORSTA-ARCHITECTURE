import type { NextConfig } from "next";

/**
 * The response headers this site promises, applied to every route.
 *
 * They live here rather than in a proxy because the app is fully prerendered:
 * the same headers then hold for the HTML, for the generated `robots.txt` and
 * `sitemap.xml`, and for the optimised images, wherever the build is served.
 *
 *   · `nosniff` — trust the declared content type. Every asset here is served
 *     with an explicit one; this stops anything else being interpreted, say, as
 *     a script.
 *   · `Referrer-Policy` — following the Instagram or map link sends the origin
 *     only, never the reader's full path. The magazine's article URLs are long,
 *     and nobody else needs them.
 *   · `X-Frame-Options` — the studio's pages are not meant to be framed by
 *     another site. Nothing here embeds itself, so nothing breaks.
 *
 * `poweredByHeader` is switched off: `x-powered-by: Next.js` announced the
 * framework to every visitor for no benefit.
 *
 * HSTS is deliberately absent: it is a commitment about HTTPS, and whoever
 * terminates TLS (the edge, in a deployment) should make it once the domain is
 * settled. A content policy is absent for the same kind of reason — the pages
 * carry Next's own inline bootstrap and each route's inline `noscript` style
 * rules, so a policy would have to be built from hashes first.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
