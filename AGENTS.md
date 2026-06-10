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

- Prioritize correctness, installability, accessibility, and public API
  stability over style preferences.
- For registry component changes, verify that source, examples, docs,
  `registry.json`, generated registry output, and install targets stay in sync.
- Flag any component change that omits practical docs, examples, or validation
  commands when the public API or behavior changes.
- Treat generated files such as `public/r/**` and `registry/__index__.tsx` as
  outputs. Review whether they match the source intent, not whether they should
  be hand-edited.
- For docs changes, check that commands use the current package manager,
  component names match registry entries, and links point to maintained sources.
- For GitHub automation changes, check permissions, third-party triggers,
  maintainer-only controls, and whether public contributors can consume limited
  service quota.
- Keep review comments high signal: report concrete defects, regressions,
  missing tests, stale docs, or unsafe automation behavior.
