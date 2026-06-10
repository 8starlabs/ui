# 8StarLabs UI Agent Skills

Repo-local skills for working with 8StarLabs UI as both:

- maintainers shipping registry components in this repository
- consumers integrating `@8starlabs/*` into app projects

## Skills

| Skill                  | Use when                                                              | Path                                   |
| ---------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| `8sl-component-ship`   | Adding, updating, documenting, or validating a component in this repo | `skills/8sl-component-ship/SKILL.md`   |
| `8sl-consume-registry` | Installing or integrating 8StarLabs UI into an app                    | `skills/8sl-consume-registry/SKILL.md` |
| `8sl-pattern-review`   | Reviewing or debugging 8StarLabs UI usage                             | `skills/8sl-pattern-review/SKILL.md`   |
| `pr-comment`           | Drafting a PR description or change summary                           | `skills/pr-comment/SKILL.md`           |

## Notes

- Keep each `SKILL.md` at or below 220 lines.
- Move overflow detail into per-skill `references/`.
- Use per-skill `evals/evals.json` for realistic prompt coverage.

## Review guidelines

When reviewing pull requests in this repository, prioritize defects that would
break published registry consumers, documentation accuracy, and contributor
trust. Treat registry components as public API.

- For changes under `registry/8starlabs-ui/blocks`, verify component props,
  accessibility, hydration behavior, responsive layout stability, and shadcn
  compatibility.
- For changes under `registry/8starlabs-ui/examples` or `lib/docs`, check that
  examples, installation snippets, prop descriptions, and accessibility notes
  match the actual component API.
- For registry-facing changes, check `registry.json`, registry metadata,
  `registry/__index__.tsx`, and `public/r/*.json` for generated registry output
  drift.
- Tests and validation matter: expect relevant changes to run `pnpm lint`,
  `pnpm tscheck`, `pnpm registry:generate-index`, `pnpm registry:build`, and
  `pnpm build` when those surfaces are affected.
- For `.github/**` changes, flag risky permissions, untrusted fork execution
  with secrets, `pull_request_target` misuse, and missing validation coverage.
