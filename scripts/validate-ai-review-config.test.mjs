import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const repositoryRoot = new URL("..", import.meta.url);

function readRepositoryFile(path) {
  return readFileSync(new URL(path, repositoryRoot), "utf8");
}

function createFixture(overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), "8sl-ai-review-"));
  mkdirSync(join(root, ".github"), { recursive: true });

  const files = {
    ".coderabbit.yaml": readRepositoryFile(".coderabbit.yaml"),
    ".github/AI_CODE_REVIEW.md": readRepositoryFile(
      ".github/AI_CODE_REVIEW.md"
    ),
    "CONTRIBUTING.md": readRepositoryFile("CONTRIBUTING.md"),
    "AGENTS.md": readRepositoryFile("AGENTS.md"),
    ...overrides
  };

  for (const [path, content] of Object.entries(files)) {
    writeFileSync(join(root, path), content);
  }

  return root;
}

test("validates a complete AI review setup", async () => {
  const { validateAiReviewConfig } = await import(
    "./validate-ai-review-config.mjs"
  );
  const result = validateAiReviewConfig({ root: createFixture() });

  assert.deepEqual(result, {
    filesChecked: [
      ".coderabbit.yaml",
      ".github/AI_CODE_REVIEW.md",
      "CONTRIBUTING.md",
      "AGENTS.md"
    ]
  });
});

test("accepts semantic CodeRabbit config regardless of YAML order", async () => {
  const { validateAiReviewConfig } = await import(
    "./validate-ai-review-config.mjs"
  );
  const root = createFixture({
    ".coderabbit.yaml": `# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
enable_free_tier: true
knowledge_base:
  code_guidelines: { enabled: true }
reviews:
  poem: false
  in_progress_fortune: false
  auto_review:
    labels: [ai-review]
    description_keyword: coderabbit:review
    enabled: false
`
  });
  const result = validateAiReviewConfig({ root });

  assert.equal(result.filesChecked.length, 4);
});

test("rejects accidental automatic CodeRabbit reviews", async () => {
  const { validateAiReviewConfig } = await import(
    "./validate-ai-review-config.mjs"
  );
  const root = createFixture({
    ".coderabbit.yaml": readRepositoryFile(".coderabbit.yaml").replace(
      "auto_review:\n    enabled: false",
      "auto_review:\n    enabled: true"
    )
  });

  assert.throws(
    () => validateAiReviewConfig({ root }),
    /Expected \.coderabbit\.yaml reviews\.auto_review\.enabled to be false/
  );
});

test("rejects docs that omit the full review trigger", async () => {
  const { validateAiReviewConfig } = await import(
    "./validate-ai-review-config.mjs"
  );
  const root = createFixture({
    ".github/AI_CODE_REVIEW.md": readRepositoryFile(
      ".github/AI_CODE_REVIEW.md"
    ).replaceAll("@coderabbitai full review", "@coderabbitai complete review")
  });

  assert.throws(
    () => validateAiReviewConfig({ root }),
    /Expected \.github\/AI_CODE_REVIEW\.md to include/
  );
});

test("package.json exposes AI review tests", () => {
  const packageJson = JSON.parse(readRepositoryFile("package.json"));

  assert.equal(packageJson.scripts.test, "node --test scripts/*.test.mjs");
  assert.equal(
    packageJson.scripts["ai-review:validate"],
    "node scripts/validate-ai-review-config.mjs"
  );
  assert.equal(packageJson.engines.node, ">=20.9.0");
});
