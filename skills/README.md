# 8StarLabs UI Skills

This directory contains repo-local agent skills for 8StarLabs UI workflows.
Skills cover both maintainers shipping components in this repository and
downstream consumers integrating `@8starlabs/*` into app projects.

## What's Here

Each skill lives in its own folder:

- `skills/<skill>/SKILL.md` - main entrypoint and workflow
- `skills/<skill>/references/` - optional deeper guidance when `SKILL.md`
  should stay lean
- `skills/<skill>/evals/evals.json` - optional realistic prompts for reviewing
  skill behavior

Hard rule: each `SKILL.md` must stay at or below 220 lines. If a skill needs
more detail, move overflow content into `references/`.

## Quick Start

Fastest path for contributors working inside this repo:

1. Start at [../AGENTS.md](../AGENTS.md).
2. Pick the skill that matches the task.
3. Read that skill's `SKILL.md` first.
4. Open `references/` only if task needs more repo-specific detail.
5. Use `evals/evals.json` when you want realistic prompt coverage for manual
   review or iteration.

Repo already contains skill definitions. This README is an onboarding guide, not
installation output.

## Skills

| Skill | Use when | Primary audience |
| --- | --- | --- |
| [`8sl-component-ship`](./8sl-component-ship/SKILL.md) | Adding, updating, documenting, or validating a component in this repo | Maintainers |
| [`8sl-consume-registry`](./8sl-consume-registry/SKILL.md) | Installing or integrating 8StarLabs UI into an app | Downstream consumers |
| [`8sl-pattern-review`](./8sl-pattern-review/SKILL.md) | Reviewing or debugging existing 8StarLabs UI usage | Maintainers and consumers |
| [`pr-comment`](./pr-comment/SKILL.md) | Drafting a PR description or change summary | Contributors writing PRs |

## Using These Skills In Claude

When Claude is working inside this repository, local skill usage should start
from [../AGENTS.md](../AGENTS.md) and then the matching
`skills/<name>/SKILL.md` file.

Use local skills for repo-specific workflow and policy:

- which skill to use
- which repo paths matter
- how 8StarLabs UI work is expected to flow

Use MCP for registry-aware operations:

- discover installable components
- install registry items by name
- work through shadcn MCP instead of raw guesswork

For shadcn MCP setup details, do not duplicate config here. Use existing repo
docs in [`lib/docs/(root)/mcp.mdx`](../lib/docs/%28root%29/mcp.mdx) or public
MCP documentation surfaced from that page.

## Using These Skills In Codex

Codex should use the same split of responsibilities:

- local repo skills in `skills/` for workflow, review rules, and repo-specific
  conventions
- shadcn MCP for registry discovery and install operations

Start from [../AGENTS.md](../AGENTS.md), then open matching skill entrypoint in
`skills/<name>/SKILL.md`. Keep `references/` as second hop when main skill file
does not contain enough detail.

For detailed shadcn MCP configuration, use
[`lib/docs/(root)/mcp.mdx`](../lib/docs/%28root%29/mcp.mdx) instead of
duplicating snippets here.

## Other Platforms

Other agentic coding platforms, including Antigravity, should follow same
general pattern if they support local repo instructions or skills:

- point platform at this repo's [../AGENTS.md](../AGENTS.md)
- let it read matching `skills/<name>/SKILL.md`
- keep `references/` and `evals/` alongside each copied skill

If platform also supports MCP, configure shadcn MCP and registry access in the same
way Claude and Codex do. Exact product-specific setup may differ, so this
README does not assume Antigravity-specific commands or config files.

## Reusing These Skills In Another Repo

To reuse these skills elsewhere:

1. Copy selected skill folders from `skills/`.
2. Preserve `SKILL.md`, `references/`, and `evals/`.
3. Add a root index file such as `AGENTS.md`.
4. Rewrite repo-specific paths, commands, and assumptions.
5. Re-test prompts in `evals/evals.json` after adaptation.

Most portable:

- `pr-comment`
- parts of `8sl-pattern-review`
- parts of `8sl-consume-registry`

Least portable:

- `8sl-component-ship`

`8sl-component-ship` is most tied to this repo's registry layout, docs layout,
and validation commands, so it will need most adaptation.

## Maintenance Notes

- Keep this README in sync with root `AGENTS.md` and current skill list.
- Update this file when skills are added, removed, or renamed.
- Keep per-skill examples and eval prompts realistic.
- Preserve hard 220-line cap for every `SKILL.md`.
- Prefer concise `SKILL.md` files and deeper `references/` files over bloated
  entrypoints.
