import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function readRequiredFile(root, failures, relativePath) {
  const absolutePath = path.join(root, relativePath);

  if (!fs.existsSync(absolutePath)) {
    failures.push(`${relativePath} is missing`);
    return "";
  }

  return fs.readFileSync(absolutePath, "utf8");
}

function expectMatch(failures, file, content, pattern, message) {
  if (!pattern.test(content)) {
    failures.push(`${file}: ${message}`);
  }
}

function expectNoMatch(failures, file, content, pattern, message) {
  if (pattern.test(content)) {
    failures.push(`${file}: ${message}`);
  }
}

function validatePinnedActions(failures, file, content) {
  const unpinnedActions = [];
  const usePattern = /^\s*-?\s*uses:\s*['"]?([^'"\s#]+)['"]?/gm;

  for (const match of content.matchAll(usePattern)) {
    const action = match[1];

    if (action.startsWith("./")) continue;
    if (/@[a-f0-9]{40}$/i.test(action)) continue;

    unpinnedActions.push(action);
  }

  if (unpinnedActions.length > 0) {
    failures.push(
      `${file}: external actions must be pinned to full commit SHAs: ${unpinnedActions.join(
        ", "
      )}`
    );
  }
}

export function validateGeminiWorkflows({ root = process.cwd() } = {}) {
  const failures = [];
  const match = (file, content, pattern, message) =>
    expectMatch(failures, file, content, pattern, message);
  const noMatch = (file, content, pattern, message) =>
    expectNoMatch(failures, file, content, pattern, message);
  const dispatchPath = ".github/workflows/gemini-dispatch.yml";
  const reviewPath = ".github/workflows/gemini-review.yml";
  const dispatch = readRequiredFile(root, failures, dispatchPath);
  const review = readRequiredFile(root, failures, reviewPath);
  const gitignore = readRequiredFile(root, failures, ".gitignore");
  const contributing = readRequiredFile(root, failures, "CONTRIBUTING.md");
  const gemini = readRequiredFile(root, failures, "GEMINI.md");

  noMatch(
    "GitHub workflows",
    `${dispatch}\n${review}`,
    /pull_request_target:/,
    "pull_request_target must not be used for AI review workflows"
  );

  match(
    dispatchPath,
    dispatch,
    /^\s{2}pull_request:/m,
    "same-repository pull request trigger is required"
  );
  match(
    dispatchPath,
    dispatch,
    /^\s{2}issue_comment:/m,
    "PR issue comment trigger is required"
  );
  match(
    dispatchPath,
    dispatch,
    /^\s{2}pull_request_review:/m,
    "PR review body trigger is required"
  );
  match(
    dispatchPath,
    dispatch,
    /^\s{2}pull_request_review_comment:/m,
    "PR review comment trigger is required"
  );
  match(
    dispatchPath,
    dispatch,
    /github\.event\.pull_request\.head\.repo\.fork == false/,
    "automatic reviews must not run on fork pull requests"
  );
  match(
    dispatchPath,
    dispatch,
    /github\.event\.issue\.pull_request/,
    "issue comments must be limited to pull request conversations"
  );
  match(
    dispatchPath,
    dispatch,
    /@gemini-cli \/review/,
    "manual review trigger must be documented in dispatch logic"
  );
  match(
    dispatchPath,
    dispatch,
    /"OWNER",\s*"MEMBER",\s*"COLLABORATOR"/,
    "manual comment triggers must be limited to trusted repository roles"
  );
  match(
    dispatchPath,
    dispatch,
    /\.\/\.github\/workflows\/gemini-review\.yml/,
    "dispatch must call the review workflow"
  );
  noMatch(
    dispatchPath,
    dispatch,
    /gemini-(triage|invoke|plan-execute)\.yml/,
    "dispatch should only enable PR review workflows in this repository"
  );

  match(
    reviewPath,
    review,
    /^\s{2}workflow_call:/m,
    "review workflow must be callable from the dispatcher"
  );
  match(
    reviewPath,
    review,
    /pull_request_number:/,
    "review workflow must accept an explicit pull request number"
  );
  match(
    reviewPath,
    review,
    /google-github-actions\/run-gemini-cli@[a-f0-9]{40}/,
    "Gemini action must be pinned to a commit SHA"
  );
  match(
    reviewPath,
    review,
    /GEMINI_API_KEY/,
    "review workflow must use the GEMINI_API_KEY secret"
  );
  match(
    reviewPath,
    review,
    /Validate Gemini authentication/,
    "review workflow must fail fast when Gemini authentication is missing"
  );
  match(
    reviewPath,
    review,
    /github_pr_number:\s*["']\$\{\{ inputs\.pull_request_number \}\}["']/,
    "review workflow must pass the explicit PR number to Gemini"
  );
  match(
    reviewPath,
    review,
    /"core":\s*\[\]/,
    "Gemini CLI core shell tools must remain disabled"
  );
  match(
    reviewPath,
    review,
    /ghcr\.io\/github\/github-mcp-server:v[0-9]+\.[0-9]+\.[0-9]+/,
    "GitHub MCP server image must be versioned"
  );

  validatePinnedActions(failures, dispatchPath, dispatch);
  validatePinnedActions(failures, reviewPath, review);

  match(
    ".gitignore",
    gitignore,
    /^\.gemini\/$/m,
    "must ignore local Gemini CLI settings"
  );
  match(
    ".gitignore",
    gitignore,
    /^gha-creds-\*\.json$/m,
    "must ignore GitHub Action credential artifacts"
  );

  match(
    "CONTRIBUTING.md",
    contributing,
    /@gemini-cli \/review/,
    "contributors must know the manual PR review trigger"
  );
  match(
    "CONTRIBUTING.md",
    contributing,
    /GEMINI_API_KEY/,
    "maintainers must know the required Gemini secret"
  );
  match(
    "CONTRIBUTING.md",
    contributing,
    /fork pull requests/i,
    "docs must explain fork pull request behavior"
  );

  match(
    "GEMINI.md",
    gemini,
    /8StarLabs UI/,
    "Gemini context must identify this project"
  );
  match(
    "GEMINI.md",
    gemini,
    /registry\/8starlabs-ui/,
    "Gemini context must mention registry component source"
  );
  match(
    "GEMINI.md",
    gemini,
    /pnpm lint/,
    "Gemini context must mention local validation commands"
  );

  return failures;
}

function runCli() {
  const failures = validateGeminiWorkflows();

  if (failures.length > 0) {
    console.error("Gemini workflow validation failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Gemini workflow validation passed.");
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  runCli();
}
