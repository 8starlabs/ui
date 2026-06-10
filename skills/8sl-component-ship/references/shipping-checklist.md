# 8StarLabs Component Shipping Checklist

Use this file when `8sl-component-ship` needs more repository detail than fits
comfortably in `SKILL.md`.

## Inspect first

- Read the target block in `registry/8starlabs-ui/blocks`.
- Read one comparable block with similar complexity.
- Check the matching docs page in `lib/docs/components`.
- Check existing demos in `registry/8starlabs-ui/examples`.
- Review the matching entries in `registry.json` when install targets or
  examples may change.

## Expected shipping surfaces

### Block source

- Keep exports aligned with repo conventions.
- Reuse existing shared utilities such as `cn` from `@/lib/utils`.
- Preserve import style used by neighboring blocks unless there is a clear repo
  convention change.

### Examples

- Prefer demos that prove the main feature or API edge the docs describe.
- Name files consistently with existing `*-demo.tsx` patterns.
- If behavior variants matter, use multiple example files rather than one
  overloaded demo.

### Docs

- Use the existing MDX pattern:
  frontmatter
  `ComponentPreview`
  installation tabs
  usage
  API reference when applicable
- Keep import paths and install commands accurate.
- If the component API changed, the docs change is not optional.

### Registry metadata

- `registry.json` should reflect installable source targets and example targets.
- If a new item is added manually, verify naming, `type`, `files`, and target
  locations match existing registry patterns.
- Generated output should not surprise the source tree.

## Validation commands

Run the smallest set that proves the change:

```bash
pnpm registry:generate-index
pnpm registry:build
pnpm lint
pnpm tscheck
```

Guidance:
- If only docs prose changed, registry commands may be unnecessary.
- If blocks, examples, or registry items changed, run the registry commands.
- If imports or types changed, run `pnpm tscheck`.
- If JSX or general source changed, `pnpm lint` is usually worth running.

## Final review

- Docs match the current API.
- Example names and imports are correct.
- Generated files look expected.
- No unrelated repo churn is included.
- Public install path still makes sense for downstream consumers.
