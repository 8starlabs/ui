# AI Code Review

This repository uses CodeRabbit as the default free, comment-triggered AI
review path for issue
[#42](https://github.com/8starlabs/ui/issues/42). CodeRabbit is configured in
[`.coderabbit.yaml`](../.coderabbit.yaml) so review behavior is versioned with
the repository instead of living only in an external dashboard.

## Maintainer Setup

1. Install
   [CodeRabbit from the GitHub Marketplace](https://github.com/marketplace/coderabbitai)
   for `8starlabs/ui`.
2. Select the Open Source plan for this public repository.
3. Confirm CodeRabbit can read `.coderabbit.yaml` from the repository root.
4. On a test pull request, comment `@coderabbitai configuration` to verify the
   resolved settings.
5. Trigger the first review with `@coderabbitai full review`.

## PR Commands

Use these comments on a pull request after the GitHub App is installed:

- `@coderabbitai review` - incremental review of new changes.
- `@coderabbitai full review` - complete review of the full PR diff.
- `@coderabbitai pause` - pause review activity on a noisy work-in-progress PR.
- `@coderabbitai resume` - resume review activity after a pause.

Automatic reviews are disabled by default. Maintainers can still opt a PR into
review without a comment by adding the `ai-review` label or putting
`coderabbit:review` in the PR description.

## Why CodeRabbit

Research snapshot: 2026-06-10.

- CodeRabbit is the default for this repository because its GitHub Marketplace
  listing advertises a $0 Open Source Pro plan for open-source projects, and
  its documented PR commands support manual comment triggers such as
  `@coderabbitai review`.
- Codex is documented as an optional exact-trigger alternative because official
  Codex docs support `@codex review`, but the pricing docs list cloud-based
  integrations like automatic code review under Plus and higher plans. The API
  key path is also pay-per-token and does not include cloud code review.
- Gemini Code Assist was not selected because Google documents a `/gemini`
  comment flow, but its consumer GitHub version is scheduled to stop serving
  requests on July 17, 2026, and the enterprise path requires Google Cloud
  setup.

Relevant docs:

- [CodeRabbit GitHub Marketplace](https://github.com/marketplace/coderabbitai)
- [CodeRabbit YAML configuration](https://docs.coderabbit.ai/getting-started/yaml-configuration)
- [CodeRabbit review commands](https://docs.coderabbit.ai/reference/review-commands)
- [CodeRabbit automatic review controls](https://docs.coderabbit.ai/configuration/auto-review)
- [Codex code review in GitHub](https://developers.openai.com/codex/integrations/github)
- [Codex pricing](https://developers.openai.com/codex/pricing)
- [Gemini Code Assist GitHub review docs](https://docs.cloud.google.com/gemini/docs/code-review/review-repo-code)

## Review Scope

The default review profile is intentionally calm and manual:

- no automatic review on every PR open or push
- no request-changes workflow
- no generated poems or fortune comments
- generated registry output is excluded from review noise
- `AGENTS.md` and `CLAUDE.md` are used as durable review guidance

CodeRabbit should focus on actionable bugs, broken consumer install paths,
security-sensitive automation mistakes, accessibility regressions, and docs
that drift from the registry source.
