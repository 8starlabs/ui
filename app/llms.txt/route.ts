import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";

export const revalidate = false;
export const dynamic = "force-static";

type Section = {
  title: string;
  entries: string[];
};

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function toSingleLine(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function toSectionTitle(url: string) {
  if (url.startsWith("/docs/components")) {
    return "Components";
  }

  return "Get Started";
}

function titleSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export async function GET() {
  const params = source.generateParams();
  const seen = new Set<string>();
  const sections = new Map<string, Section>();

  for (const param of params) {
    const slug = param.slug ?? [];
    const page = source.getPage(slug);

    if (!page || seen.has(page.url)) {
      continue;
    }

    seen.add(page.url);

    const pageTitle = toSingleLine(page.data.title) || page.url;
    const pageDescription = toSingleLine(page.data.description);
    const pageUrl = toAbsoluteUrl(page.url);
    const sectionTitle = toSectionTitle(page.url);

    if (!sections.has(sectionTitle)) {
      sections.set(sectionTitle, { title: sectionTitle, entries: [] });
    }

    const entry = pageDescription
      ? `- [${pageTitle}](${pageUrl}): ${pageDescription}`
      : `- [${pageTitle}](${pageUrl})`;

    sections.get(sectionTitle)?.entries.push(entry);
  }

  const orderedSections = ["Get Started", "Components"]
    .map((title) => sections.get(title))
    .filter((section): section is Section => section !== undefined)
    .map((section) => ({
      ...section,
      entries: [...section.entries].sort(titleSort)
    }));

  const sectionBlocks = orderedSections.flatMap((section) => [
    `## ${section.title}`,
    "",
    ...section.entries,
    ""
  ]);

  const content = [
    `# ${siteConfig.name}`,
    `> ${toSingleLine(siteConfig.description)}`,
    "",
    "## Project",
    `- Website: ${siteConfig.url}`,
    `- Repository: ${siteConfig.links.github}`,
    `- Docs Home: ${toAbsoluteUrl("/docs")}`,
    `- Components Index: ${toAbsoluteUrl("/docs/components")}`,
    "- Install Command: npx shadcn@latest add https://ui.8starlabs.com/r/status-indicator.json",
    "",
    ...sectionBlocks,
    "## Machine-Readable Sources",
    `- [Markdown Index](${toAbsoluteUrl("/llm")})`,
    "- Raw markdown is available at `/llm/*` using the same path as `/docs/*` (replace `/docs` with `/llm`).",
    `- Example: ${toAbsoluteUrl("/docs/setup")} -> ${toAbsoluteUrl("/llm/setup")}`,
    `- Example: ${toAbsoluteUrl("/docs/components/heatmap")} -> ${toAbsoluteUrl("/llm/components/heatmap")}`,
    "- Component install manifests are available under `/r/*.json`."
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
