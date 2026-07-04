import { notFound } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";

export const revalidate = false;

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function toSingleLine(value: string | undefined) {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const title = toSingleLine(page.data.title) || page.url;
  const description = toSingleLine(page.data.description);
  const rawText = await page.data.getText("raw");
  const content = [
    `# ${title}`,
    `Source: ${toAbsoluteUrl(page.url)}`,
    `Markdown: ${toAbsoluteUrl(page.url.replace(/^\/docs/, "/llm"))}`,
    description ? `\n> ${description}` : "",
    "",
    rawText
  ]
    .filter(Boolean)
    .join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8"
    }
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
