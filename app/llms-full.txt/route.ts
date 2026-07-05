import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";

export const revalidate = false;
export const dynamic = "force-static";

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function toSingleLine(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function toMarkdownUrl(docsUrl: string) {
  return toAbsoluteUrl(docsUrl.replace(/^\/docs/, "/llm"));
}

// Get Started pages first, then Components, mirroring /llms.txt ordering.
function sectionRank(url: string) {
  return url.startsWith("/docs/components") ? 1 : 0;
}

export async function GET() {
  const params = source.generateParams();
  const seen = new Set<string>();
  const pages: ReturnType<typeof source.getPage>[] = [];

  for (const param of params) {
    const slug = param.slug ?? [];
    const page = source.getPage(slug);

    if (!page || seen.has(page.url)) {
      continue;
    }

    seen.add(page.url);
    pages.push(page);
  }

  pages.sort((a, b) => {
    if (!a || !b) {
      return 0;
    }

    const rank = sectionRank(a.url) - sectionRank(b.url);
    if (rank !== 0) {
      return rank;
    }

    const aTitle = toSingleLine(a.data.title) || a.url;
    const bTitle = toSingleLine(b.data.title) || b.url;
    return aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
  });

  const blocks = await Promise.all(
    pages.map(async (page) => {
      if (!page) {
        return "";
      }

      const title = toSingleLine(page.data.title) || page.url;
      const description = toSingleLine(page.data.description);
      const text = await page.data.getText("raw");

      return [
        `# ${title}`,
        `Source: ${toAbsoluteUrl(page.url)}`,
        `Markdown: ${toMarkdownUrl(page.url)}`,
        description ? `\n> ${description}` : "",
        "",
        text
      ]
        .filter(Boolean)
        .join("\n");
    })
  );

  const content = [
    `# ${siteConfig.name}`,
    `> ${toSingleLine(siteConfig.description)}`,
    "",
    "Full text of every documentation page, concatenated for LLM consumption.",
    `See ${toAbsoluteUrl("/llms.txt")} for the linked index.`,
    "",
    "---",
    "",
    blocks.filter(Boolean).join("\n\n---\n\n"),
    ""
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
