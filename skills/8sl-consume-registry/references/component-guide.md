# 8StarLabs Consumer Component Guide

Use this file when `8sl-consume-registry` needs more detail than fits the main
skill file.

## Quick selector

- `button`: actions or CTA buttons, especially when the optional animated arrow
  helps
- `heatmap`: calendar-like intensity display over dates
- `partition-bar`: proportional segmented data display
- `timeline`: chronological events or milestones
- `flip-clock`: countdowns or time displays
- `marquee`: moving logo rails or repeated content bands
- `scroll-fade`: edge fade for overflowing content
- `status-indicator`: compact system or entity state display
- `transport-badge`: transit line or station labeling
- `system-banner`: top-level notices or environment banners
- `json-viewer`: formatted JSON inspection in UI

## Install guidance

### Direct CLI install

```bash
pnpm dlx shadcn@latest add https://ui.8starlabs.com/r/<name>.json
```

Replace `<name>` with the registry item name such as `heatmap`,
`transport-badge`, or `json-viewer`.

### MCP-oriented flow

Add this to `components.json`:

```json
{
  "registries": {
    "@8starlabs": "https://ui.8starlabs.com/r/{name}.json"
  }
}
```

Then assistants can use prompts like:
- `Install @8starlabs/heatmap and use it on the analytics page`
- `Show me the available components in the @8starlabs registry`

## Troubleshooting

- Missing `components.json`:
  initialize shadcn first.
- Alias mismatch:
  trust the local `components.json` aliases over guessed import paths.
- Install succeeded but usage feels unclear:
  check the corresponding docs page and example first before rewriting.
- User wants a very custom surface:
  recommend the closest base component, then explain the remaining app-side
  composition work.

## Guardrails

- This skill is for consuming the library, not publishing to it.
- Prefer specific install commands and example references over broad framework
  tutorials.
