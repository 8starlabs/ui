---
name: 8sl-component-ship
description: Use when adding, updating, documenting, or validating an 8StarLabs UI component in this repository. Covers the full maintainer workflow across blocks, examples, docs, registry metadata, generated index files, and validation commands.
---

# 8StarLabs Component Ship

Maintainer skill for work inside this repository. Use it when the task is to
ship or update a component end-to-end, not when the task is only to consume an
already-published registry item in another app.

## Apply this skill when

- adding a new component to the registry
- updating an existing block, demo, or docs page
- fixing registry metadata, generated index output, or install targets
- validating that a component change is shippable

## Repo map

- Component source: `registry/8starlabs-ui/blocks`
- Examples and demos: `registry/8starlabs-ui/examples`
- Docs content: `lib/docs/components`
- Registry manifest: `registry.json`
- Generated index: `registry/__index__.tsx`
- Generation script: `scripts/generate-index.mts`

## Core rules

1. Treat component shipping as one workflow.
   A real change usually touches source, at least one demo, docs, and registry
   output expectations together.
2. Follow existing component patterns before inventing new structure.
   Inspect similar blocks and docs pages first.
3. Keep changes minimal and coherent.
   Do not refactor unrelated registry or docs infrastructure unless the current
   task truly requires it.
4. Prefer explicit validation.
   When registry-facing files change, run the generation/build commands instead
   of assuming metadata still lines up.

## Workflow

1. Inspect the current component and the nearest comparable component in the
   same repo.
2. Decide the shipping surface:
   block only, or block + demo + docs + registry metadata.
3. Update the component source in `registry/8starlabs-ui/blocks`.
4. Update or add example files in `registry/8starlabs-ui/examples` when the
   user-facing API or behavior changes.
5. Update docs in `lib/docs/components` so installation, usage, and API remain
   accurate.
6. Check whether `registry.json` must be updated or regenerated expectations
   changed.
7. Run the registry sync commands when applicable:
   `pnpm registry:generate-index`
   `pnpm registry:build`
8. Run additional validation that fits the change, such as `pnpm lint` or
   `pnpm tscheck`, when the edited files could break site or type behavior.
9. Review generated diffs before finishing. Make sure output matches source
   intent and no unrelated artifacts slipped in.

## Heuristics

- New block:
  add source, at least one example, docs page content, and registry entry.
- API change:
  update demos and docs in the same pass.
- Docs-only change:
  keep code untouched unless docs prove current implementation wrong.
- Registry/index mismatch:
  trust generated output after verifying source inputs, not hand-edited drift.

## Avoid

- editing only the block when the public API changed
- leaving docs or demos stale after changing props or behavior
- hand-waving registry sync without running the repo commands
- treating consumer-app integration advice as maintainer workflow

## References

- Read `references/shipping-checklist.md` for repo-specific authoring and
  validation details.
