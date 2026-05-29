# 8starlabs UI

![Marketing](https://github.com/8starlabs/ui/blob/main/public/thumbnails/banner_github.png?raw=true)

[8StarLabs UI](https://ui.8starlabs.com) is a component library built on top of shadcn/ui to help you build modern, interactive, and unique interfaces faster.

The library integrates seamlessly with Next.js projects using shadcn/ui and provides a simple CLI for adding components to your project.

## Installation

```bash
pnpm dlx shadcn@latest add https://ui.8starlabs.com/r/status-indicator.json
```

All available components can be found [here](https://ui.8starlabs.com/docs/components).

## MCP

8StarLabs UI can be used with AI coding assistants through the shadcn MCP server. Add the registry to your project's `components.json`:

```json
{
  "registries": {
    "@8starlabs": "https://ui.8starlabs.com/r/{name}.json"
  }
}
```

Then configure the shadcn MCP server in Claude, Codex, Cursor, VS Code, or another MCP client. See the [MCP guide](https://ui.8starlabs.com/docs/mcp) for client-specific setup.

## Prerequisites

Before using 8starlabs UI, ensure your Next.js project meets these requirements:

- Node.js 18 or later
- shadcn/ui initialized in your project `pnpm dlx shadcn@latest init`
- Tailwind CSS configured

## Contributing

Please read the [contributing guide](/CONTRIBUTING.md) for more details. Love 8StarLabsUI? Give us a ⭐ on GitHub!

Huge thank you to our contributors.

<a href="https://github.com/8starlabs/ui/graphs/contributors">
<img src="https://contrib.rocks/image?repo=8starlabs/ui" />
</a>

## License

Licensed under the [MIT license](https://github.com/8starlabs/ui/blob/main/LICENSE.md).

## Contact

- Tham Kei Lok (Lead Engineer & Developer Relations) - [X](https://www.x.com/keiloktql/), [LinkedIn](https://www.linkedin.com/in/keiloktql/)
- Wang Jia Hua (Software Engineer, Full-stack) - [LinkedIn](https://www.linkedin.com/in/jiahua-wang-74ewfb/)

Engineered by [8StarLabs](https://8starlabs.com).

## Star History

[![Star History Chart](https://api.star-history.com/image?repos=8starlabs/ui&type=date&legend=top-left)](https://www.star-history.com/?repos=8starlabs%2Fui&type=date&legend=top-left)
