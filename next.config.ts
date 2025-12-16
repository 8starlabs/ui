import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  // compiler: {
  //   removeConsole:
  //     process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  // },
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
