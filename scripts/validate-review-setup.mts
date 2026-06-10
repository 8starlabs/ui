import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

type CodeRabbitConfig = {
  language?: string;
  reviews?: {
    profile?: string;
    request_changes_workflow?: boolean;
    high_level_summary?: boolean;
    poem?: boolean;
    review_status?: boolean;
    review_details?: boolean;
    path_filters?: string[];
    path_instructions?: Array<{
      path?: string;
      instructions?: string;
    }>;
    auto_review?: {
      enabled?: boolean;
      description_keyword?: string;
      auto_incremental_review?: boolean;
      drafts?: boolean;
      ignore_title_keywords?: string[];
      ignore_usernames?: string[];
    };
  };
  chat?: {
    auto_reply?: boolean;
  };
};

type GithubWorkflow = {
  name?: string;
  on?: {
    pull_request?: unknown;
    push?: unknown;
  };
  jobs?: {
    checks?: {
      steps?: Array<{
        name?: string;
        run?: string;
      }>;
    };
  };
};

type PackageJson = {
  scripts?: {
    "docs:generate"?: string;
    tscheck?: string;
  };
};

function includesEvery(values: string[] | undefined, expected: string[]) {
  return expected.every((value) => values?.includes(value));
}

export function validateReviewSetup(root = process.cwd()) {
  const failures: string[] = [];

  function fail(message: string) {
    failures.push(message);
  }

  function ensure(condition: unknown, message: string) {
    if (!condition) {
      fail(message);
    }
  }

  function readRequired(relativePath: string) {
    const filePath = path.join(root, relativePath);

    if (!fs.existsSync(filePath)) {
      fail(`Missing required file: ${relativePath}`);
      return "";
    }

    return fs.readFileSync(filePath, "utf8");
  }

  function parseYaml<T>(relativePath: string) {
    const contents = readRequired(relativePath);

    if (!contents) {
      return undefined;
    }

    try {
      return parse(contents) as T;
    } catch (error) {
      fail(
        `${relativePath} is not valid YAML: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return undefined;
    }
  }

  function parseJson<T>(relativePath: string) {
    const contents = readRequired(relativePath);

    if (!contents) {
      return undefined;
    }

    try {
      return JSON.parse(contents) as T;
    } catch (error) {
      fail(
        `${relativePath} is not valid JSON: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return undefined;
    }
  }

  const packageJson = parseJson<PackageJson>("package.json");

  ensure(
    packageJson?.scripts?.["docs:generate"] === "fumadocs-mdx",
    "package.json must expose docs:generate for Fumadocs source generation"
  );
  ensure(
    packageJson?.scripts?.tscheck?.includes("pnpm docs:generate"),
    "package.json tscheck must generate Fumadocs source before running tsc"
  );

  const coderabbit = parseYaml<CodeRabbitConfig>(".coderabbit.yaml");
  const reviews = coderabbit?.reviews;
  const autoReview = reviews?.auto_review;

  ensure(
    coderabbit?.language === "en-US",
    ".coderabbit.yaml must review in en-US"
  );
  ensure(
    reviews?.profile === "chill",
    ".coderabbit.yaml must use the chill review profile"
  );
  ensure(
    reviews?.request_changes_workflow === false,
    ".coderabbit.yaml must not request changes automatically"
  );
  ensure(
    reviews?.high_level_summary === true,
    ".coderabbit.yaml must keep high-level summaries enabled"
  );
  ensure(reviews?.poem === false, ".coderabbit.yaml must disable poems");
  ensure(
    reviews?.review_status === true,
    ".coderabbit.yaml must publish review status"
  );
  ensure(
    reviews?.review_details === false,
    ".coderabbit.yaml must keep verbose review details disabled"
  );
  ensure(
    autoReview?.enabled === false,
    ".coderabbit.yaml must disable automatic reviews so PRs opt in by mention"
  );
  ensure(
    autoReview?.description_keyword === "",
    ".coderabbit.yaml must leave description_keyword empty for comment-only opt in"
  );
  ensure(
    autoReview?.auto_incremental_review === false,
    ".coderabbit.yaml must disable automatic incremental reviews"
  );
  ensure(
    autoReview?.drafts === false,
    ".coderabbit.yaml must skip draft pull requests"
  );
  ensure(
    includesEvery(autoReview?.ignore_title_keywords, ["WIP", "[skip review]"]),
    ".coderabbit.yaml must skip WIP and [skip review] pull requests"
  );
  ensure(
    includesEvery(autoReview?.ignore_usernames, [
      "dependabot[bot]",
      "renovate[bot]",
      "github-actions[bot]"
    ]),
    ".coderabbit.yaml must skip common automation authors"
  );
  ensure(
    coderabbit?.chat?.auto_reply === true,
    ".coderabbit.yaml must enable chat"
  );

  const requiredPathFilters = [
    "!public/r/**",
    "!registry/__index__.tsx",
    "!pnpm-lock.yaml",
    "!**/*.png",
    "!**/*.jpg",
    "!**/*.jpeg",
    "!**/*.gif",
    "!**/*.ico",
    "!**/*.svg"
  ];

  ensure(
    includesEvery(reviews?.path_filters, requiredPathFilters),
    ".coderabbit.yaml must exclude generated registry output and binary assets"
  );

  const requiredInstructionPaths = [
    "registry/8starlabs-ui/blocks/**",
    "registry/8starlabs-ui/examples/**",
    "lib/docs/**",
    ".github/**"
  ];

  for (const instructionPath of requiredInstructionPaths) {
    ensure(
      reviews?.path_instructions?.some(
        (instruction) =>
          instruction.path === instructionPath &&
          typeof instruction.instructions === "string" &&
          instruction.instructions.trim().length > 0
      ),
      `.coderabbit.yaml must include path instructions for ${instructionPath}`
    );
  }

  const contributing = readRequired("CONTRIBUTING.md");
  const requiredContributingPhrases = [
    "@coderabbitai review",
    "@coderabbitai full review",
    "@codex review",
    "npm test",
    "pnpm review:validate"
  ];

  for (const phrase of requiredContributingPhrases) {
    ensure(
      contributing.includes(phrase),
      `CONTRIBUTING.md must document ${phrase}`
    );
  }

  const agents = readRequired("AGENTS.md");
  const requiredAgentPhrases = [
    "## Review guidelines",
    "registry metadata",
    "generated registry output",
    "accessibility",
    "Tests and validation"
  ];

  for (const phrase of requiredAgentPhrases) {
    ensure(agents.includes(phrase), `AGENTS.md must include ${phrase}`);
  }

  const workflow = parseYaml<GithubWorkflow>(".github/workflows/ci.yml");
  const workflowRuns =
    workflow?.jobs?.checks?.steps?.flatMap((step) => step.run ?? []) ?? [];

  ensure(workflow?.name === "CI", ".github/workflows/ci.yml must be named CI");
  ensure(
    Boolean(workflow?.on?.pull_request),
    ".github/workflows/ci.yml must run for pull requests"
  );
  ensure(
    Boolean(workflow?.on?.push),
    ".github/workflows/ci.yml must run for pushes to protected branches"
  );

  for (const command of [
    "pnpm review:validate",
    "pnpm test",
    "pnpm lint",
    "pnpm tscheck",
    "pnpm registry:generate-index",
    "pnpm registry:build",
    "pnpm build"
  ]) {
    ensure(
      workflowRuns.some((run) => run.includes(command)),
      `.github/workflows/ci.yml must run ${command}`
    );
  }

  return failures;
}

function runCli() {
  const failures = validateReviewSetup();

  if (failures.length > 0) {
    console.error("Review setup validation failed:");

    for (const failure of failures) {
      console.error(`- ${failure}`);
    }

    process.exit(1);
  }

  console.log("Review setup validation passed.");
}

const isCli =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  runCli();
}
