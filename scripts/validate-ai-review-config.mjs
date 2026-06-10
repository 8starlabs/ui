import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDocument } from "yaml";

function readProjectFile(root, path) {
  try {
    return readFileSync(join(root, path), "utf8");
  } catch (error) {
    throw new Error(`Expected ${path} to exist: ${error.message}`);
  }
}

function assertIncludes(content, expected, path) {
  if (!content.includes(expected)) {
    throw new Error(`Expected ${path} to include ${JSON.stringify(expected)}`);
  }
}

function parseYaml(content, path) {
  const document = parseDocument(content);
  if (document.errors.length > 0) {
    throw new Error(
      `Expected ${path} to contain valid YAML: ${document.errors[0].message}`
    );
  }

  return document.toJS();
}

function assertEqual(actual, expected, path, property) {
  if (actual !== expected) {
    throw new Error(
      `Expected ${path} ${property} to be ${JSON.stringify(expected)}`
    );
  }
}

function assertArrayIncludes(actual, expected, path, property) {
  if (!Array.isArray(actual) || !actual.includes(expected)) {
    throw new Error(
      `Expected ${path} ${property} to include ${JSON.stringify(expected)}`
    );
  }
}

export function validateAiReviewConfig({ root = process.cwd() } = {}) {
  const coderabbitConfig = readProjectFile(root, ".coderabbit.yaml");
  const parsedCoderabbitConfig = parseYaml(
    coderabbitConfig,
    ".coderabbit.yaml"
  );
  const aiReviewDocs = readProjectFile(root, ".github/AI_CODE_REVIEW.md");
  const contributing = readProjectFile(root, "CONTRIBUTING.md");
  const agents = readProjectFile(root, "AGENTS.md");

  assertIncludes(
    coderabbitConfig,
    "# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json",
    ".coderabbit.yaml"
  );
  assertEqual(
    parsedCoderabbitConfig.enable_free_tier,
    true,
    ".coderabbit.yaml",
    "enable_free_tier"
  );
  assertEqual(
    parsedCoderabbitConfig.reviews?.auto_review?.enabled,
    false,
    ".coderabbit.yaml",
    "reviews.auto_review.enabled"
  );
  assertEqual(
    parsedCoderabbitConfig.reviews?.auto_review?.description_keyword,
    "coderabbit:review",
    ".coderabbit.yaml",
    "reviews.auto_review.description_keyword"
  );
  assertArrayIncludes(
    parsedCoderabbitConfig.reviews?.auto_review?.labels,
    "ai-review",
    ".coderabbit.yaml",
    "reviews.auto_review.labels"
  );
  assertEqual(
    parsedCoderabbitConfig.reviews?.poem,
    false,
    ".coderabbit.yaml",
    "reviews.poem"
  );
  assertEqual(
    parsedCoderabbitConfig.reviews?.in_progress_fortune,
    false,
    ".coderabbit.yaml",
    "reviews.in_progress_fortune"
  );
  assertEqual(
    parsedCoderabbitConfig.knowledge_base?.code_guidelines?.enabled,
    true,
    ".coderabbit.yaml",
    "knowledge_base.code_guidelines.enabled"
  );

  for (const command of [
    "@coderabbitai review",
    "@coderabbitai full review",
    "coderabbit:review",
    "ai-review",
    "@codex review"
  ]) {
    assertIncludes(aiReviewDocs, command, ".github/AI_CODE_REVIEW.md");
  }

  assertIncludes(
    aiReviewDocs,
    "CodeRabbit is the default for this repository",
    ".github/AI_CODE_REVIEW.md"
  );
  assertIncludes(
    aiReviewDocs,
    "Codex is documented as an optional exact-trigger alternative",
    ".github/AI_CODE_REVIEW.md"
  );
  assertIncludes(contributing, ".github/AI_CODE_REVIEW.md", "CONTRIBUTING.md");
  assertIncludes(contributing, "@coderabbitai review", "CONTRIBUTING.md");
  assertIncludes(agents, "## Review guidelines", "AGENTS.md");
  assertIncludes(agents, "P0/P1", "AGENTS.md");

  return {
    filesChecked: [
      ".coderabbit.yaml",
      ".github/AI_CODE_REVIEW.md",
      "CONTRIBUTING.md",
      "AGENTS.md"
    ]
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateAiReviewConfig();
  console.log("AI review configuration validated.");
}
