import path from "node:path";
import { fileURLToPath } from "node:url";

import { createMDX } from "fumadocs-mdx/next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  turbopack: {
    root: projectRoot
  },
  headers: async () => [
    {
      source: "/favicon.ico",
      headers: [
        { key: "Cache-Control", value: "public, max-age=2592000, immutable" }
      ]
    }
  ],
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
