import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

async function readWorkspaceFile(relativePath) {
  try {
    return await readFile(path.join(workspaceRoot, relativePath), "utf8");
  } catch (error) {
    throw new Error(`Missing workspace file: ${relativePath}`, {
      cause: error
    });
  }
}

function requireIncludes(text, expected, label) {
  if (!text.includes(expected)) {
    throw new Error(`${label} is missing ${JSON.stringify(expected)}`);
  }
}

function sectionAfter(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) {
    return "";
  }

  const section = text.slice(start + heading.length);
  const nextHeading = section.search(/\n\S/);
  return nextHeading === -1 ? section : section.slice(0, nextHeading);
}

test("CodeRabbit config uses maintainer-triggered review controls", async () => {
  const config = await readWorkspaceFile(".coderabbit.yaml");
  const autoReview = sectionAfter(config, "  auto_review:");

  requireIncludes(config, "enable_free_tier: true", "CodeRabbit config");
  requireIncludes(autoReview, "    enabled: false", "auto_review settings");
  requireIncludes(
    autoReview,
    "    auto_incremental_review: false",
    "auto_review settings"
  );
  requireIncludes(autoReview, '      - "review-ready"', "auto_review labels");
  requireIncludes(
    autoReview,
    '      - "[skip review]"',
    "auto_review title exclusions"
  );
  requireIncludes(config, '    - "!pnpm-lock.yaml"', "path filters");
  requireIncludes(config, '    - "!public/r/**"', "path filters");
  requireIncludes(config, '    - "!registry/__index__.tsx"', "path filters");
  requireIncludes(config, "  allow_non_org_members: false", "chat settings");
  requireIncludes(config, "  auto_reply: false", "chat settings");
});

test("agent review guidelines cover repo-specific risk areas", async () => {
  const agents = await readWorkspaceFile("AGENTS.md");

  requireIncludes(agents, "## Review guidelines", "AGENTS.md");
  requireIncludes(agents, "registry component changes", "review guidelines");
  requireIncludes(agents, "`registry.json`", "review guidelines");
  requireIncludes(agents, "`public/r/**`", "review guidelines");
  requireIncludes(agents, "GitHub automation changes", "review guidelines");
  requireIncludes(agents, "service quota", "review guidelines");
});

test("contributor docs explain CodeRabbit and Codex review triggers", async () => {
  const contributing = await readWorkspaceFile("CONTRIBUTING.md");

  requireIncludes(
    contributing,
    "https://docs.coderabbit.ai/platforms/github-com",
    "CodeRabbit docs link"
  );
  requireIncludes(
    contributing,
    "https://developers.openai.com/codex/integrations/github",
    "Codex docs link"
  );
  requireIncludes(contributing, "@coderabbitai full review", "CodeRabbit docs");
  requireIncludes(contributing, "@coderabbitai review", "CodeRabbit docs");
  requireIncludes(contributing, "review-ready", "CodeRabbit label docs");
  requireIncludes(contributing, "@codex review", "Codex docs");
  requireIncludes(contributing, "AI review is advisory", "review ownership");
});

test("pull request template exposes validation and AI review prompts", async () => {
  const template = await readWorkspaceFile(".github/PULL_REQUEST_TEMPLATE.md");

  requireIncludes(template, "## Validation", "pull request template");
  requireIncludes(template, "`pnpm lint`", "validation checklist");
  requireIncludes(template, "`pnpm tscheck`", "validation checklist");
  requireIncludes(
    template,
    "`pnpm registry:generate-index`",
    "validation checklist"
  );
  requireIncludes(template, "`pnpm registry:build`", "validation checklist");
  requireIncludes(template, "Screenshots", "validation checklist");
  requireIncludes(template, "@coderabbitai full review", "AI review checklist");
  requireIncludes(template, "@coderabbitai review", "AI review checklist");
  requireIncludes(template, "review-ready", "AI review checklist");
  requireIncludes(template, "@codex review", "AI review checklist");
});

test("test helpers fail clearly for empty, missing, and malformed content", async () => {
  assert.equal(sectionAfter("", "missing"), "");
  assert.equal(sectionAfter("heading\nvalue", "absent"), "");
  assert.throws(
    () => requireIncludes("", "anything", "empty content"),
    /empty content is missing "anything"/
  );
  await assert.rejects(
    readWorkspaceFile("does-not-exist.md"),
    /Missing workspace file: does-not-exist\.md/
  );
});
