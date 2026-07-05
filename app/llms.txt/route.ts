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

function toMarkdownUrl(docsUrl: string) {
  return toAbsoluteUrl(docsUrl.replace(/^\/docs/, "/llm"));
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
    const docsUrl = toAbsoluteUrl(page.url);
    const markdownUrl = toMarkdownUrl(page.url);
    const sectionTitle = toSectionTitle(page.url);

    if (!sections.has(sectionTitle)) {
      sections.set(sectionTitle, { title: sectionTitle, entries: [] });
    }

    const entry = pageDescription
      ? `- [${pageTitle}](${markdownUrl}) ([docs](${docsUrl})): ${pageDescription}`
      : `- [${pageTitle}](${markdownUrl}) ([docs](${docsUrl}))`;

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
    "- Install Command: pnpm dlx shadcn@latest add https://ui.8starlabs.com/r/status-indicator.json",
    "",
    ...sectionBlocks,
    "## Machine-Readable Sources",
    `- [Design System](${toAbsoluteUrl("/design.md")}): tokens, colors, typography, and component index.`,
    `- [Full Docs (single file)](${toAbsoluteUrl("/llms-full.txt")}): every page concatenated for LLM consumption.`,
    `- [Markdown Docs Home](${toAbsoluteUrl("/llm")})`,
    "- Raw markdown pages are available at `/llm/*` using the same path as `/docs/*` (replace `/docs` with `/llm`).",
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
