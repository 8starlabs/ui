# AI Pull Request Review

This repository is configured for manual AI review on pull requests.

## Selected Provider

Use CodeRabbit as the default review bot.

Why this setup:

- The GitHub Marketplace says CodeRabbit's Open Source Pro plan is free for Open Source projects.
- It does not require repository API keys, paid model secrets, or a custom GitHub Actions bot.
- It supports pull request comment triggers such as `@coderabbitai review` and `@coderabbitai full review`.
- The repository keeps review behavior in version control through `.coderabbit.yaml`.

Automatic reviews are disabled in `.coderabbit.yaml` so review budget is spent only when maintainers ask for it.

## Maintainer Setup

1. Install the CodeRabbit GitHub App for `8starlabs/ui`.
2. Select the Open Source plan for the public repository.
3. Confirm CodeRabbit detects `.coderabbit.yaml` by commenting `@coderabbitai configuration` on a test pull request.
4. Request the first incremental review by commenting `@coderabbitai review`.
5. Use `@coderabbitai full review` when a pull request needs a complete fresh pass.

## Pull Request Commands

- `@coderabbitai review` requests an incremental review of new changes.
- `@coderabbitai full review` requests a complete review of the full pull request.
- `@coderabbitai pause` pauses automatic review behavior for a pull request if maintainers enable automatic reviews later.
- `@coderabbitai resume` resumes paused review behavior.
- `@coderabbitai help` shows the current command reference in the pull request.

## Codex Compatibility

The issue requested a workflow like `@codex review`. Codex code review is an optional external integration that maintainers can enable separately in Codex settings. If enabled, the exact `@codex review` pull request comment should follow the repository-level guidance in `AGENTS.md`.

CodeRabbit remains the default free/open-source setup in this repository because it can be configured by committed files and does not require OpenAI API secrets in GitHub Actions.

## Review Policy

AI review is advisory. Maintainers remain responsible for final review, testing, and merge decisions.

Reviewers should ask the bot for another pass after meaningful changes, especially when a pull request touches:

- public component APIs in `registry/8starlabs-ui/blocks`
- examples or docs that must stay synchronized with component behavior
- GitHub Actions or repository automation
- accessibility-sensitive UI behavior
- build, registry, or TypeScript configuration

Generated registry output under `public/r/**` and `registry/__index__.tsx` is excluded from CodeRabbit review focus so reviewers spend attention on source inputs instead of generated artifacts.
