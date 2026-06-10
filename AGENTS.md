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

- Prioritize correctness, accessibility, security, consumer installability,
  generated-registry consistency, and documentation drift over style-only
  feedback.
- For Codex reviews, flag only P0/P1 issues. For other AI reviewers, keep
  comments high signal and actionable.
- Treat `registry/8starlabs-ui/blocks/**` as public component API. Check
  TypeScript types, client/server boundaries, shadcn-style consumption, and
  accessible defaults.
- Treat `registry/8starlabs-ui/examples/**` and `lib/docs/**` as consumer
  onboarding surface. Verify examples are copyable and commands remain current.
- For `.github/**` changes, review least privilege, secret exposure, untrusted
  input handling, and maintainer setup clarity.
