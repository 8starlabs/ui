---
name: pr-comment
description: Use when the user asks to write, draft, summarize, or compose a pull request description or change summary. Covers reviewer-facing PR bodies, strict Summary plus Key Changes formatting, and issue-closing keywords when the linked issue is known.
---

# PR Comment

This skill writes PR descriptions and change summaries for reviewers. It does
not handle inline review replies or generic issue comments.

## Output rules

- Output only one fenced `markdown` block.
- Use `## Summary` and `## Key Changes`.
- Include issue-closing text like `Closes #43` when appropriate and known.
- Do not add prose before or after the fenced block.
- Keep the write-up concise and copy-paste ready.

## Apply this skill when

- the user says "write a PR", "draft a PR", "summarize this PR", or
  "describe this diff"
- the user wants a reviewer-facing change summary
- the user shares a diff or changed files and wants a polished PR body

## Goals

1. Tell the reviewer what changed in user-visible terms.
2. Explain why the diff exists, especially the root cause.
3. Group the key changes without dumping a file-by-file changelog.
4. Include issue-closing language when there is a linked issue.

## Format

```markdown
## Summary

<one short paragraph, usually 2-4 sentences>

## Key Changes

<1-3 bullets for a small change, or grouped bullets by area for a larger one>

Closes #<issue>
```

### `## Summary`

The summary should cover:
- what changed
- where it changed
- why it changed

Lead with the user-visible surface or workflow. Include the root cause when it
helps the reviewer understand why the diff exists.

### `## Key Changes`

- Small change:
  use 1-3 bullets total.
- Multi-area change:
  group bullets by area with a plain label line such as `Registry:` or
  `Docs:`.
- Name specific symbols, files, commands, or surfaces only when that increases
  reviewer understanding.
- Do not restate the summary or enumerate every touched file.

## Style rules

- Backticks for file paths, commands, symbols, and config keys.
- Prefer direct reviewer-facing language.
- Keep the body tight; cut preamble like "This PR" or "In this change".
- Use root-cause framing when it clarifies a bug fix.
- Ground claims in the visible diff or in user-provided context.

## Issue-closing rules

- If the linked issue is known and the change resolves it, include a closing
  line such as `Closes #43`.
- If issue linkage is ambiguous, leave it out unless the user asked for it.
- Put the closing line at the end of the markdown block.

## Ask only if needed

If the user gave a diff but not enough context, ask at most once for:
- the main user-visible surface affected
- whether an issue number should be closed

If the user already explained the change well enough, write immediately.
