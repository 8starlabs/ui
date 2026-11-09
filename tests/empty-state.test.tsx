import * as React from "react";
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Bell, Calendar } from "lucide-react";

import EmptyState from "../registry/8starlabs-ui/blocks/empty-state";
import EmptyStateDemo from "../registry/8starlabs-ui/examples/empty-state-demo";

test("main demo shows the empty state without a file-manager toolbar", () => {
  const html = renderToStaticMarkup(<EmptyStateDemo />);

  assert.match(html, /No files found/);
  assert.match(html, /Clear search/);
  assert.match(html, /New document/);
  assert.doesNotMatch(html, /All files|<input/);
  assert.equal((html.match(/<button/g) ?? []).length, 2);
});

test("labels and descriptions reference existing, unique elements", () => {
  const html = renderToStaticMarkup(
    <>
      <EmptyState title="No files" description="Create a file to start." />
      <EmptyState
        title="No projects"
        description="Create a project to start."
      />
    </>
  );
  const labels = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(
    (match) => match[1]
  );
  const descriptions = [...html.matchAll(/aria-describedby="([^"]+)"/g)].map(
    (match) => match[1]
  );
  assert.equal(new Set(labels).size, 2);
  assert.equal(new Set(descriptions).size, 2);
  for (const id of [...labels, ...descriptions])
    assert.ok(html.includes(`id="${id}"`));
});

test("actions default to non-submit buttons, retain disabled, and place secondary first", () => {
  const html = renderToStaticMarkup(
    <form>
      <EmptyState
        title="No results"
        secondaryAction={{ label: "Clear search" }}
        primaryAction={{ label: "Create file", disabled: true }}
      />
    </form>
  );
  assert.equal((html.match(/type="button"/g) ?? []).length, 2);
  assert.ok(html.indexOf("Clear search") < html.indexOf("Create file"));
  assert.match(html, /disabled=""/);
});

test("omits actions and description references when not supplied", () => {
  const html = renderToStaticMarkup(<EmptyState title="Nothing here" />);
  assert.doesNotMatch(html, /<button|aria-describedby=/);
});

test("supports a custom SVG icon, no surrounding icons, and native root props", () => {
  const html = renderToStaticMarkup(
    <EmptyState
      title="No notifications"
      icon={Bell}
      surroundingIcons={[]}
      data-testid="empty-notifications"
    />
  );
  assert.equal((html.match(/<svg/g) ?? []).length, 1);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /data-testid="empty-notifications"/);
});

test("caps decorative icons at six", () => {
  const html = renderToStaticMarkup(
    <EmptyState
      title="Empty"
      surroundingIcons={Array.from({ length: 8 }, () => Calendar)}
    />
  );
  assert.equal((html.match(/<svg/g) ?? []).length, 7);
});
