import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  // Files under public/ default to `max-age=0, must-revalidate`, so every edge
  // PoP re-validates against the origin on every request - the main source of
  // Fast Origin Transfer. Cache them at the edge for a year (a deployment
  // purges the CDN cache, so replaced assets still go live immediately) while
  // browsers re-check daily. `/r` matters most: every `shadcn add` fetches it.
  headers: async () => {
    const assetCache = [
      {
        key: "Cache-Control",
        value:
          "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800"
      }
    ];
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" }
        ]
      },
      { source: "/r/:path*", headers: assetCache },
      { source: "/images/:path*", headers: assetCache },
      { source: "/thumbnails/:path*", headers: assetCache },
      { source: "/svgs/:path*", headers: assetCache }
    ];
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  },
  redirects() {
    return [
      {
        source: "/components",
        destination: "/docs/components",
        permanent: true
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/docs/:path*.md",
        permanent: true
      }
    ];
  },
  rewrites() {
    return [
      {
        source: "/docs/:path*.md",
        destination: "/llm/:path*"
      }
    ];
  }
};

const withMDX = createMDX({});

export default withMDX(config);
