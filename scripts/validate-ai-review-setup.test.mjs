import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { validateAiReviewSetup } from "./validate-ai-review-setup.mjs";

function createFixture(files) {
  const root = mkdtempSync(path.join(tmpdir(), "8sl-ai-review-"));

  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = path.join(root, relativePath);

    mkdirSync(path.dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, content, "utf8");
  }

  return root;
}

function validFiles(overrides = {}) {
  return {
    ".coderabbit.yaml": [
      "# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json",
      "enable_free_tier: true",
      "reviews:",
      "  path_filters:",
      '    - "!public/r/**"',
      "  path_instructions:",
      '    - path: "registry/8starlabs-ui/blocks/**/*.tsx"',
      '    - path: ".github/**"',
      "  auto_review:",
      "    enabled: false"
    ].join("\n"),
    ".github/AI_REVIEW.md": [
      "CodeRabbit",
      "Open Source Pro plan is free",
      "@coderabbitai review",
      "@coderabbitai full review",
      "@codex review"
    ].join("\n"),
    ".github/pull_request_template.md": [
      "@coderabbitai review",
      "Closes #<issue-number>"
    ].join("\n"),
    "CONTRIBUTING.md": ["AI code review", "@coderabbitai review"].join("\n"),
    "AGENTS.md": [
      "## Review guidelines",
      "registry/8starlabs-ui",
      "pull_request_target"
    ].join("\n"),
    ...overrides
  };
}

test("returns no failures for a complete AI review setup", () => {
  const root = createFixture(validFiles());

  try {
    assert.deepEqual(validateAiReviewSetup(root), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("reports missing files without throwing", () => {
  const root = createFixture({});

  try {
    const failures = validateAiReviewSetup(root);

    assert.ok(failures.includes(".coderabbit.yaml must exist"));
    assert.ok(failures.includes(".github/AI_REVIEW.md must exist"));
    assert.ok(failures.includes(".github/pull_request_template.md must exist"));
    assert.ok(failures.includes("CONTRIBUTING.md must exist"));
    assert.ok(failures.includes("AGENTS.md must exist"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("reports empty documentation and malformed auto review config", () => {
  const root = createFixture(
    validFiles({
      ".coderabbit.yaml": [
        "# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json",
        "enable_free_tier: true",
        "reviews:",
        "  auto_review:",
        "    enabled: true"
      ].join("\n"),
      ".github/AI_REVIEW.md": "",
      ".github/pull_request_template.md": "",
      "CONTRIBUTING.md": "",
      "AGENTS.md": ""
    })
  );

  try {
    const failures = validateAiReviewSetup(root);

    assert.ok(
      failures.some((failure) =>
        failure.includes("manual comments should trigger reviews")
      )
    );
    assert.ok(
      failures.some((failure) =>
        failure.includes("document the selected free review provider")
      )
    );
    assert.ok(
      failures.some((failure) =>
        failure.includes("contributors need to know how the review flow works")
      )
    );
    assert.ok(
      failures.some((failure) =>
        failure.includes("Codex and other agents need durable")
      )
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("reports invalid repository roots gracefully", () => {
  assert.deepEqual(validateAiReviewSetup(null), [
    "repository root must be a non-empty string"
  ]);
  assert.deepEqual(validateAiReviewSetup(""), [
    "repository root must be a non-empty string"
  ]);
  assert.deepEqual(validateAiReviewSetup("   "), [
    "repository root must be a non-empty string"
  ]);
});
