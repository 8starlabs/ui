import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultRepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

function readRequired(repoRoot, relativePath, failures) {
  const absolutePath = path.join(repoRoot, relativePath);

  if (!existsSync(absolutePath)) {
    failures.push(`${relativePath} must exist`);
    return "";
  }

  return readFileSync(absolutePath, "utf8");
}

function assertIncludes(file, content, needle, reason, failures) {
  if (!content.includes(needle)) {
    failures.push(`${file} must include ${JSON.stringify(needle)} (${reason})`);
  }
}

function assertMatches(file, content, pattern, reason, failures) {
  if (!pattern.test(content)) {
    failures.push(`${file} must match ${pattern} (${reason})`);
  }
}

export function validateAiReviewSetup(repoRoot) {
  const failures = [];

  if (typeof repoRoot !== "string" || repoRoot.trim().length === 0) {
    return ["repository root must be a non-empty string"];
  }

  const codeRabbitConfig = readRequired(repoRoot, ".coderabbit.yaml", failures);
  const aiReviewGuide = readRequired(
    repoRoot,
    ".github/AI_REVIEW.md",
    failures
  );
  const pullRequestTemplate = readRequired(
    repoRoot,
    ".github/pull_request_template.md",
    failures
  );
  const contributingGuide = readRequired(repoRoot, "CONTRIBUTING.md", failures);
  const agentGuide = readRequired(repoRoot, "AGENTS.md", failures);

  assertIncludes(
    ".coderabbit.yaml",
    codeRabbitConfig,
    "https://coderabbit.ai/integrations/schema.v2.json",
    "pin the public CodeRabbit schema for editor validation",
    failures
  );
  assertIncludes(
    ".coderabbit.yaml",
    codeRabbitConfig,
    "enable_free_tier: true",
    "keep the selected reviewer compatible with the free open-source plan",
    failures
  );
  assertMatches(
    ".coderabbit.yaml",
    codeRabbitConfig,
    /auto_review:\n(?: {4}.+\n)* {4}enabled: false/,
    "manual comments should trigger reviews instead of automatic review spam",
    failures
  );
  assertIncludes(
    ".coderabbit.yaml",
    codeRabbitConfig,
    "!public/r/**",
    "generated registry JSON should not consume review attention",
    failures
  );
  assertIncludes(
    ".coderabbit.yaml",
    codeRabbitConfig,
    "registry/8starlabs-ui/blocks/**/*.tsx",
    "component blocks need path-specific review guidance",
    failures
  );
  assertIncludes(
    ".coderabbit.yaml",
    codeRabbitConfig,
    ".github/**",
    "workflow and contribution files need security-focused guidance",
    failures
  );

  assertIncludes(
    ".github/AI_REVIEW.md",
    aiReviewGuide,
    "CodeRabbit",
    "document the selected free review provider",
    failures
  );
  assertIncludes(
    ".github/AI_REVIEW.md",
    aiReviewGuide,
    "Open Source Pro plan is free",
    "explain the free/open-source basis for the choice",
    failures
  );
  assertIncludes(
    ".github/AI_REVIEW.md",
    aiReviewGuide,
    "@coderabbitai review",
    "document the manual PR comment trigger",
    failures
  );
  assertIncludes(
    ".github/AI_REVIEW.md",
    aiReviewGuide,
    "@coderabbitai full review",
    "document the full-review PR comment trigger",
    failures
  );
  assertIncludes(
    ".github/AI_REVIEW.md",
    aiReviewGuide,
    "@codex review",
    "document the Codex-compatible review path requested in the issue",
    failures
  );

  assertIncludes(
    ".github/pull_request_template.md",
    pullRequestTemplate,
    "@coderabbitai review",
    "make the manual review trigger visible on every PR",
    failures
  );
  assertIncludes(
    ".github/pull_request_template.md",
    pullRequestTemplate,
    "Closes #",
    "preserve issue-closing hygiene for contributors",
    failures
  );

  assertIncludes(
    "CONTRIBUTING.md",
    contributingGuide,
    "AI code review",
    "contributors need to know how the review flow works",
    failures
  );
  assertIncludes(
    "CONTRIBUTING.md",
    contributingGuide,
    "@coderabbitai review",
    "the contribution guide should mention the PR comment trigger",
    failures
  );

  assertIncludes(
    "AGENTS.md",
    agentGuide,
    "## Review guidelines",
    "Codex and other agents need durable repository review guidance",
    failures
  );
  assertIncludes(
    "AGENTS.md",
    agentGuide,
    "registry/8starlabs-ui",
    "review guidance must cover the registry component surface",
    failures
  );
  assertIncludes(
    "AGENTS.md",
    agentGuide,
    "pull_request_target",
    "review guidance must flag high-risk GitHub Actions patterns",
    failures
  );

  return failures;
}

function runCli() {
  const failures = validateAiReviewSetup(defaultRepoRoot);

  if (failures.length > 0) {
    console.error("AI review setup validation failed:");

    for (const failure of failures) {
      console.error(`- ${failure}`);
    }

    process.exit(1);
  }

  console.log("AI review setup validation passed.");
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  runCli();
}
