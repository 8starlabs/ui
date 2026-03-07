import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";

const HOME_PRIORITY = 1;
const DOCS_ROOT_PRIORITY = 0.9;
const SECTION_INDEX_PRIORITY = 0.8;
const COMPONENT_DETAIL_PRIORITY = 0.7;
const LLM_PRIORITY = 0.2;
const CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"] =
  "monthly";

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function getPriority(path: string): number {
  if (path === "/llms.txt") {
    return LLM_PRIORITY;
  }

  if (path === "/docs") {
    return DOCS_ROOT_PRIORITY;
  }

  if (path === "/docs/components") {
    return SECTION_INDEX_PRIORITY;
  }

  if (path.startsWith("/docs/components/")) {
    return COMPONENT_DETAIL_PRIORITY;
  }

  if (path.startsWith("/docs/")) {
    return SECTION_INDEX_PRIORITY;
  }

  return SECTION_INDEX_PRIORITY;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const seen = new Set<string>();
  const staticPaths = ["/llms.txt"];

  const nonHomePaths = [
    ...staticPaths,
    ...source
      .generateParams()
      .map((param) => source.getPage(param.slug ?? []))
      .filter((page): page is NonNullable<ReturnType<typeof source.getPage>> =>
        Boolean(page)
      )
      .map((page) => page.url)
  ].filter((path) => {
    if (path === "/") {
      return false;
    }

    if (seen.has(path)) {
      return false;
    }

    seen.add(path);
    return true;
  });

  const entries = [
    {
      url: toAbsoluteUrl("/"),
      lastModified,
      changeFrequency: CHANGE_FREQUENCY,
      priority: HOME_PRIORITY
    },
    ...nonHomePaths.map((path) => ({
      url: toAbsoluteUrl(path),
      lastModified,
      changeFrequency: CHANGE_FREQUENCY,
      priority: getPriority(path)
    }))
  ];

  return entries.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
