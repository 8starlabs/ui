import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateGeminiWorkflows } from "./validate-gemini-workflows.mjs";

const validDispatchWorkflow = `name: Gemini Dispatch

on:
  pull_request:
  issue_comment:
  pull_request_review:
  pull_request_review_comment:

jobs:
  dispatch:
    if: |-
      github.event.pull_request.head.repo.fork == false &&
      github.event.issue.pull_request &&
      startsWith((github.event.comment.body || ''), '@gemini-cli /review') &&
      contains(fromJSON('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.comment.author_association)
    steps:
      - uses: actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea
  review:
    uses: ./.github/workflows/gemini-review.yml
`;

const validReviewWorkflow = `name: Gemini PR Review

on:
  workflow_call:
    inputs:
      pull_request_number:

jobs:
  review:
    steps:
      - name: Validate Gemini authentication
        run: echo ok
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
      - uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8
      - uses: google-github-actions/run-gemini-cli@f77273f4c914e4bf38440cf36a0369cb64a37489
        with:
          github_pr_number: "\${{ inputs.pull_request_number }}"
          settings: |-
            {
              "tools": {
                "core": []
              },
              "mcpServers": {
                "github": {
                  "args": ["ghcr.io/github/github-mcp-server:v0.27.0"]
                }
              }
            }
`;

const validGitignore = `.gemini/
gha-creds-*.json
`;

const validContributing = `Use @gemini-cli /review.
Set GEMINI_API_KEY.
Fork pull requests are gated.
`;

const validGemini = `8StarLabs UI
registry/8starlabs-ui
pnpm lint
`;

function createFixture(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gemini-workflow-"));
  const files = {
    ".github/workflows/gemini-dispatch.yml": validDispatchWorkflow,
    ".github/workflows/gemini-review.yml": validReviewWorkflow,
    ".gitignore": validGitignore,
    "CONTRIBUTING.md": validContributing,
    "GEMINI.md": validGemini,
    ...overrides
  };

  for (const [relativePath, content] of Object.entries(files)) {
    if (content === null) continue;

    const absolutePath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, content, "utf8");
  }

  return root;
}

test("passes when required Gemini review workflow surfaces are present", () => {
  const root = createFixture();

  assert.deepEqual(validateGeminiWorkflows({ root }), []);
});

test("reports missing files without throwing", () => {
  const root = createFixture({
    ".github/workflows/gemini-review.yml": null,
    "GEMINI.md": null
  });

  const failures = validateGeminiWorkflows({ root });

  assert.match(failures.join("\n"), /gemini-review\.yml is missing/);
  assert.match(failures.join("\n"), /GEMINI\.md is missing/);
});

test("rejects unpinned external GitHub Actions", () => {
  const root = createFixture({
    ".github/workflows/gemini-review.yml": validReviewWorkflow.replace(
      "actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8",
      "actions/checkout@v6"
    )
  });

  const failures = validateGeminiWorkflows({ root });

  assert.match(failures.join("\n"), /external actions must be pinned/);
  assert.match(failures.join("\n"), /actions\/checkout@v6/);
});

test("rejects unsafe pull_request_target workflows", () => {
  const root = createFixture({
    ".github/workflows/gemini-dispatch.yml": `${validDispatchWorkflow}
on:
  pull_request_target:
`
  });

  const failures = validateGeminiWorkflows({ root });

  assert.match(failures.join("\n"), /pull_request_target must not be used/);
});

test("rejects empty manual trigger role allowlists", () => {
  const root = createFixture({
    ".github/workflows/gemini-dispatch.yml": validDispatchWorkflow.replace(
      '"OWNER", "MEMBER", "COLLABORATOR"',
      ""
    )
  });

  const failures = validateGeminiWorkflows({ root });

  assert.match(failures.join("\n"), /trusted repository roles/);
});
