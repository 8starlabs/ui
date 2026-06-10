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

- Treat `registry/8starlabs-ui` as the public shipping surface. Flag component
  API changes that do not update matching examples, docs, registry metadata, or
  generated expectations.
- For React and Next.js changes, check client/server boundaries, hydration
  risks, accessibility, keyboard behavior, responsive layout, and TypeScript
  soundness before style preferences.
- For docs in `lib/docs`, treat stale installation commands, stale prop names,
  broken examples, and missing accessibility notes as functional defects.
- For GitHub automation and repository configuration, flag secret exposure,
  broad token permissions, unpinned third-party actions, unsafe
  `pull_request_target` usage, and any workflow that writes to untrusted pull
  request code.
- Avoid spending review attention on generated registry files unless the source
  inputs suggest the generated output is stale or inconsistent.
