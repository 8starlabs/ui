import assert from "node:assert/strict";
import { test } from "node:test";

import { ComponentSource } from "../components/component-source";

test("manual Empty State source matches installed imports and the usage export", async () => {
  const element = await ComponentSource({
    src: "registry/8starlabs-ui/blocks/empty-state.tsx",
    importMappings: {
      "@/registry/8starlabs-ui/blocks/button":
        "@/components/8starlabs-ui/button",
      "@/registry/8starlabs-ui/ui/empty": "@/components/8starlabs-ui/ui/empty"
    },
    collapsible: false
  });
  const code: string = element!.props.children.props.code;

  assert.match(code, /from "@\/components\/8starlabs-ui\/button"/);
  assert.match(code, /from "@\/components\/8starlabs-ui\/ui\/empty"/);
  assert.match(code, /export default function EmptyState\(/);
  assert.doesNotMatch(code, /@\/registry\/|@\/components\/blocks\//);
});

test("manual Empty primitive retains its named exports and utility import", async () => {
  const element = await ComponentSource({
    src: "registry/8starlabs-ui/ui/empty.tsx",
    importMappings: {},
    collapsible: false
  });
  const code: string = element!.props.children.props.code;

  assert.match(code, /from "@\/lib\/utils"/);
  assert.match(code, /export \{/);
  assert.doesNotMatch(code, /export default/);
});

test("source previews without explicit mappings keep their existing behavior", async () => {
  const element = await ComponentSource({
    src: "registry/8starlabs-ui/blocks/empty-state.tsx",
    collapsible: false
  });
  const code: string = element!.props.children.props.code;

  assert.match(code, /from "@\/components\/blocks\/button"/);
  assert.match(code, /export function EmptyState\(/);
});
