---
name: 8sl-consume-registry
description: Use when users want to install, integrate, or adapt 8StarLabs UI components in a Next.js plus shadcn project. Covers registry selection, install paths, import guidance, MCP-aware flows, and practical integration checks.
---

# 8StarLabs Consume Registry

Use this skill for downstream app work, not for maintaining the `8starlabs/ui`
repository itself.

## Default assumptions

- Next.js app
- Tailwind CSS
- shadcn/ui initialized
- `components.json` present

If the project clearly differs, adapt. Otherwise use these defaults instead of
asking broad setup questions.

## Apply this skill when

- a user wants to install an `@8starlabs/*` component
- a user asks which 8StarLabs UI component fits a use case
- a user wants MCP or registry-based assistant workflows
- a user has integration friction after install

## Core rules

1. Recommend an existing registry component before proposing custom build work.
2. Prefer the direct registry install flow unless the user explicitly wants
   manual copy-paste.
3. Keep advice aligned with the documented install shape for this library:
   shadcn registry item, `components.json`, and Next.js-friendly usage.
4. Treat MCP as an accelerator, not the only supported path.
5. Do not drift into maintainer workflow guidance like editing `registry.json`
   or `registry/__index__.tsx`.

## Standard install flow

For direct install, use:

```bash
pnpm dlx shadcn@latest add https://ui.8starlabs.com/r/<name>.json
```

For MCP-friendly registry browsing, make sure `components.json` contains:

```json
{
  "registries": {
    "@8starlabs": "https://ui.8starlabs.com/r/{name}.json"
  }
}
```

Then assistants can refer to registry items by name, such as
`@8starlabs/heatmap`.

## Workflow

1. Identify the actual user need:
   installation, component selection, integration, or troubleshooting.
2. Choose the closest existing component instead of inventing a custom one when
   the registry already covers the job.
3. Give the exact install command or registry name.
4. Explain the likely import shape and where the generated files will land.
5. Call out any usage caveats visible from the component's purpose, examples, or
   the user's app context.
6. Point the user to the most relevant docs or examples when that will reduce
   guesswork.

## Integration checks

- Confirm the app already has shadcn initialized.
- Confirm `components.json` exists and is the source of truth for aliases and
  registry config.
- Prefer the project's alias style instead of hardcoding import assumptions if
  local config says otherwise.
- If the user only wants one installable component, do not bury the answer in
  MCP setup unless they asked for assistant tooling.

## Avoid

- telling the user to maintain this repo's internal registry files
- rewriting a component from scratch when a registry item already fits
- assuming every request needs MCP setup
- giving generic React advice detached from the library's actual install flow

## References

- Read `references/component-guide.md` for current component-selection and
  troubleshooting notes.
