import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";

import { validateReviewSetup } from "./validate-review-setup.mts";

function createTempRepo(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "8sl-review-setup-"));

  t.after(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  return root;
}

function writeFile(root: string, relativePath: string, contents: string) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function writeValidReviewSetup(root: string) {
  writeFile(
    root,
    "package.json",
    JSON.stringify(
      {
        scripts: {
          "docs:generate": "fumadocs-mdx",
          tscheck: "pnpm docs:generate && tsc --noEmit"
        }
      },
      null,
      2
    )
  );

  writeFile(
    root,
    ".coderabbit.yaml",
    `
language: en-US
reviews:
  profile: chill
  request_changes_workflow: false
  high_level_summary: true
  poem: false
  review_status: true
  review_details: false
  auto_review:
    enabled: false
    description_keyword: ""
    auto_incremental_review: false
    drafts: false
    ignore_title_keywords:
      - WIP
      - "[skip review]"
    ignore_usernames:
      - "dependabot[bot]"
      - "renovate[bot]"
      - "github-actions[bot]"
  path_filters:
    - "!public/r/**"
    - "!registry/__index__.tsx"
    - "!pnpm-lock.yaml"
    - "!**/*.png"
    - "!**/*.jpg"
    - "!**/*.jpeg"
    - "!**/*.gif"
    - "!**/*.ico"
    - "!**/*.svg"
  path_instructions:
    - path: "registry/8starlabs-ui/blocks/**"
      instructions: "Review blocks."
    - path: "registry/8starlabs-ui/examples/**"
      instructions: "Review examples."
    - path: "lib/docs/**"
      instructions: "Review docs."
    - path: ".github/**"
      instructions: "Review workflows."
chat:
  auto_reply: true
`
  );

  writeFile(
    root,
    "CONTRIBUTING.md",
    [
      "@coderabbitai review",
      "@coderabbitai full review",
      "@codex review",
      "npm test",
      "pnpm review:validate"
    ].join("\n")
  );

  writeFile(
    root,
    "AGENTS.md",
    [
      "## Review guidelines",
      "registry metadata",
      "generated registry output",
      "accessibility",
      "Tests and validation"
    ].join("\n")
  );

  writeFile(
    root,
    ".github/workflows/ci.yml",
    `
name: CI
on:
  pull_request: {}
  push: {}
jobs:
  checks:
    steps:
      - run: pnpm review:validate
      - run: pnpm test
      - run: pnpm lint
      - run: pnpm tscheck
      - run: pnpm registry:generate-index
      - run: pnpm registry:build
      - run: pnpm build
`
  );
}

test("validateReviewSetup accepts a complete review configuration", (t) => {
  const root = createTempRepo(t);
  writeValidReviewSetup(root);

  assert.deepEqual(validateReviewSetup(root), []);
});

test("validateReviewSetup reports empty list edge cases without throwing", (t) => {
  const root = createTempRepo(t);
  writeValidReviewSetup(root);
  writeFile(
    root,
    ".coderabbit.yaml",
    `
language: en-US
reviews:
  profile: chill
  request_changes_workflow: false
  high_level_summary: true
  poem: false
  review_status: true
  review_details: false
  auto_review:
    enabled: false
    description_keyword: ""
    auto_incremental_review: false
    drafts: false
    ignore_title_keywords: []
    ignore_usernames: []
  path_filters: []
  path_instructions: []
chat:
  auto_reply: true
`
  );

  const failures = validateReviewSetup(root);

  assert.match(
    failures.join("\n"),
    /skip WIP and \[skip review\] pull requests/
  );
  assert.match(
    failures.join("\n"),
    /exclude generated registry output and binary assets/
  );
  assert.match(
    failures.join("\n"),
    /include path instructions for registry\/8starlabs-ui\/blocks\/\*\*/
  );
});

test("validateReviewSetup reports null review sections as validation failures", (t) => {
  const root = createTempRepo(t);
  writeValidReviewSetup(root);
  writeFile(
    root,
    ".coderabbit.yaml",
    `
language: en-US
reviews:
chat:
  auto_reply: true
`
  );

  const failures = validateReviewSetup(root);

  assert.match(failures.join("\n"), /must use the chill review profile/);
  assert.match(failures.join("\n"), /must disable automatic reviews/);
});

test("validateReviewSetup reports invalid JSON and YAML parse errors", (t) => {
  const root = createTempRepo(t);
  writeValidReviewSetup(root);
  writeFile(root, "package.json", "{");
  writeFile(root, ".coderabbit.yaml", "reviews: [");

  const failures = validateReviewSetup(root);

  assert.match(failures.join("\n"), /package\.json is not valid JSON/);
  assert.match(failures.join("\n"), /\.coderabbit\.yaml is not valid YAML/);
});
