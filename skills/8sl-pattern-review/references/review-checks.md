# 8StarLabs Review Checks

Use this file when `8sl-pattern-review` needs a deeper checklist than fits in
the main skill file.

## Import and alias checks

- Does the import path match the project's actual generated destination?
- Is the code assuming `@/components/ui/...` when the project alias differs?
- Was a registry example copied without fixing local import paths?

## Composition checks

- Does the app use the component in a way consistent with docs/examples?
- Did the integrator remove helper structure that the component expects?
- Is the component being stretched into a job another 8StarLabs item fits
  better?

## Docs drift checks

- Did code change but docs/example usage not follow?
- Is the integrator using an older prop shape than current examples show?
- Does the bug report come from misunderstanding install/usage rather than from
  broken component logic?

## Rewrite skepticism

Push back on rewrites when:
- a registry item already solves the problem
- a local fork only exists because install/import/setup was misunderstood
- the proposed custom version would make future upstream usage harder

## Findings style

Good findings are:
- concrete
- rooted in current code
- explicit about effect
- minimal in proposed fix

Weak findings are:
- vague style complaints
- generic component philosophy
- framework advice detached from 8StarLabs UI usage
