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

function titleSort(a: { title: string }, b: { title: string }) {
  return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
}

/**
 * Design tokens mirror the source of truth in `app/globals.css`.
 * Update both together when palette, radius, or typography changes.
 */
const RADIUS = {
  base: "0.625rem (10px)",
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) + 4px)"
};

const TYPOGRAPHY = {
  sans: "Geist Sans (--font-geist-sans)",
  mono: "Geist Mono (--font-geist-mono)"
};

const BREAKPOINTS = [
  ["sm", "640px"],
  ["md", "768px"],
  ["lg", "1024px"],
  ["xl", "1280px"],
  ["2xl", "1536px"],
  ["3xl", "1600px"],
  ["4xl", "2000px"]
];

/**
 * Semantic color roles. Values are OKLCH and listed as `light / dark`,
 * matching the `:root` and `.dark` blocks in `app/globals.css`.
 */
const COLOR_ROLES: Array<[string, string, string, string]> = [
  ["background", "oklch(1 0 0)", "oklch(0.145 0 0)", "Page background"],
  ["foreground", "oklch(0.145 0 0)", "oklch(0.985 0 0)", "Default text"],
  ["card", "oklch(1 0 0)", "oklch(0.205 0 0)", "Card surface"],
  ["card-foreground", "oklch(0.145 0 0)", "oklch(0.985 0 0)", "Text on cards"],
  ["popover", "oklch(1 0 0)", "oklch(0.205 0 0)", "Popover surface"],
  ["primary", "oklch(0.205 0 0)", "oklch(0.922 0 0)", "Primary action"],
  [
    "primary-foreground",
    "oklch(0.985 0 0)",
    "oklch(0.205 0 0)",
    "Text on primary"
  ],
  ["secondary", "oklch(0.97 0 0)", "oklch(0.269 0 0)", "Secondary action"],
  ["muted", "oklch(0.97 0 0)", "oklch(0.269 0 0)", "Muted surface"],
  [
    "muted-foreground",
    "oklch(0.556 0 0)",
    "oklch(0.708 0 0)",
    "Secondary text"
  ],
  ["accent", "oklch(0.97 0 0)", "oklch(0.269 0 0)", "Accent surface"],
  [
    "destructive",
    "oklch(0.577 0.245 27.325)",
    "oklch(0.704 0.191 22.216)",
    "Errors / destructive"
  ],
  ["border", "oklch(0.922 0 0)", "oklch(1 0 0 / 10%)", "Borders"],
  ["input", "oklch(0.922 0 0)", "oklch(1 0 0 / 15%)", "Input borders"],
  ["ring", "oklch(0.708 0 0)", "oklch(0.556 0 0)", "Focus ring"],
  ["surface", "oklch(0.98 0 0)", "—", "Subtle section surface"],
  ["code", "oklch(0.98 0 0)", "oklch(0.2 0 0)", "Code block background"]
];

const CHART_COLORS = [
  ["chart-1", "oklch(0.646 0.222 41.116)", "oklch(0.488 0.243 264.376)"],
  ["chart-2", "oklch(0.6 0.118 184.704)", "oklch(0.696 0.17 162.48)"],
  ["chart-3", "oklch(0.398 0.07 227.392)", "oklch(0.769 0.188 70.08)"],
  ["chart-4", "oklch(0.828 0.189 84.429)", "oklch(0.627 0.265 303.9)"],
  ["chart-5", "oklch(0.769 0.188 70.08)", "oklch(0.645 0.246 16.439)"]
];

function getComponents() {
  const seen = new Set<string>();
  const components: Array<{ title: string; url: string; description: string }> =
    [];

  for (const param of source.generateParams()) {
    const page = source.getPage(param.slug ?? []);

    if (!page || seen.has(page.url)) {
      continue;
    }

    if (!page.url.startsWith("/docs/components/")) {
      continue;
    }

    seen.add(page.url);
    components.push({
      title: toSingleLine(page.data.title) || page.url,
      url: page.url,
      description: toSingleLine(page.data.description)
    });
  }

  return components.sort(titleSort);
}

export async function GET() {
  const components = getComponents();

  const componentLines = components.map((component) => {
    const docsUrl = toAbsoluteUrl(component.url);
    const slug = component.url.replace("/docs/components/", "");
    const manifestUrl = toAbsoluteUrl(`/r/${slug}.json`);
    const detail = component.description ? `: ${component.description}` : "";
    return `- **${component.title}** — [docs](${docsUrl}) · [manifest](${manifestUrl})${detail}`;
  });

  const colorLines = COLOR_ROLES.map(
    ([role, light, dark, use]) =>
      `| \`--${role}\` | \`${light}\` | \`${dark}\` | ${use} |`
  );

  const chartLines = CHART_COLORS.map(
    ([role, light, dark]) => `| \`--${role}\` | \`${light}\` | \`${dark}\` |`
  );

  const breakpointLines = BREAKPOINTS.map(
    ([name, value]) => `| \`${name}\` | ${value} |`
  );

  const content = [
    `# ${siteConfig.name} — Design System`,
    "",
    `> ${toSingleLine(siteConfig.description)}`,
    "",
    "This document is a machine-readable summary of the 8StarLabs UI design system,",
    "intended for LLMs, agents, and tooling. It is served as static markdown at",
    `\`${toAbsoluteUrl("/design.md")}\`. The canonical source of truth for tokens is`,
    "`app/globals.css`; component APIs live in the docs.",
    "",
    "## Project",
    `- Website: ${siteConfig.url}`,
    `- Repository: ${siteConfig.links.github}`,
    `- Docs Home: ${toAbsoluteUrl("/docs")}`,
    `- Components Index: ${toAbsoluteUrl("/docs/components")}`,
    `- LLM Index: ${toAbsoluteUrl("/llms.txt")}`,
    "",
    "## Principles",
    "- Niche, high-utility components you won't find in standard libraries.",
    "- shadcn/ui-compatible: copy-paste ownership, not a runtime dependency.",
    "- Built on Radix primitives, Tailwind CSS v4, and CSS custom properties.",
    "- Tokens are semantic (role-based), not literal — theme via variables, never hard-coded hex.",
    "- Light and dark themes are first-class; every role defines both.",
    "",
    "## Foundations",
    "",
    "### Theming model",
    "Colors are defined as OKLCH CSS custom properties on `:root` (light) and `.dark`",
    "(dark), then exposed to Tailwind via `@theme inline` as `--color-*` utilities.",
    "Reference roles with Tailwind classes (e.g. `bg-background`, `text-muted-foreground`,",
    "`border-border`) rather than raw values.",
    "",
    "### Semantic colors",
    "",
    "| Token | Light | Dark | Use |",
    "| --- | --- | --- | --- |",
    ...colorLines,
    "",
    "### Chart palette",
    "",
    "| Token | Light | Dark |",
    "| --- | --- | --- |",
    ...chartLines,
    "",
    "### Radius",
    `- Base: \`--radius\` = ${RADIUS.base}`,
    `- \`rounded-sm\` → ${RADIUS.sm}`,
    `- \`rounded-md\` → ${RADIUS.md}`,
    `- \`rounded-lg\` → ${RADIUS.lg}`,
    `- \`rounded-xl\` → ${RADIUS.xl}`,
    "",
    "### Typography",
    `- Sans (\`--font-sans\`): ${TYPOGRAPHY.sans}`,
    `- Mono (\`--font-mono\`): ${TYPOGRAPHY.mono}`,
    "",
    "### Breakpoints",
    "",
    "| Name | Min width |",
    "| --- | --- |",
    ...breakpointLines,
    "",
    "### Layout utilities",
    "Custom Tailwind utilities defined in `app/globals.css`:",
    "- `container` — centered, max-width `1400px` (`2xl` screens cap at `screen-2xl`).",
    "- `container-wrapper` — full-width wrapper used for fixed layouts.",
    "- `section-soft` — subtle top-to-bottom `background → surface` gradient.",
    "- `border-grid` / `border-ghost` — grid and overlay border treatments.",
    "- `no-scrollbar` — hide scrollbars while keeping scroll.",
    "- `step` — numbered step counters for setup docs.",
    "",
    "## Components",
    "",
    `${components.length} components ship in the registry. Each has docs and a shadcn`,
    "install manifest.",
    "",
    ...componentLines,
    "",
    "### Installation",
    "Components are installed with the shadcn CLI against the published manifest:",
    "```bash",
    "pnpm dlx shadcn@latest add https://ui.8starlabs.com/r/status-indicator.json",
    "```",
    "Replace `status-indicator` with any component slug listed above.",
    "",
    "## Machine-Readable Sources",
    `- Design system (this file): ${toAbsoluteUrl("/design.md")}`,
    `- LLM index: ${toAbsoluteUrl("/llms.txt")}`,
    `- Sitemap: ${toAbsoluteUrl("/sitemap.xml")}`,
    "- Raw doc markdown: `/llm/*` mirrors `/docs/*` (replace `/docs` with `/llm`).",
    `  Example: ${toAbsoluteUrl("/docs/components/heatmap")} -> ${toAbsoluteUrl("/llm/components/heatmap")}`,
    "- Component install manifests: `/r/*.json`.",
    ""
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8"
    }
  });
}
