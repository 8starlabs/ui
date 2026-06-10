---
name: 8sl-pattern-review
description: Use when reviewing, debugging, or cleaning up existing 8StarLabs UI usage. Focus on import correctness, component composition, docs drift, unnecessary rewrites, and mismatches between intended registry usage and actual implementation.
---

# 8StarLabs Pattern Review

Use this skill when 8StarLabs UI is already present and the task is to review,
debug, or tighten that usage. This is not the primary skill for fresh installs
or for publishing new components to this repo.

## Apply this skill when

- the user says "review", "what's wrong", "debug", or "clean this up"
- a component was installed but behaves incorrectly
- code drifted away from documented examples
- a custom rewrite may have replaced a better registry-based solution

## Review priorities

1. Correctness first.
   Broken imports, wrong props, invalid composition, or behavior regressions
   matter more than style cleanup.
2. Findings before rewrite.
   Start by identifying bugs or risks with exact references when possible.
3. Smallest fix wins.
   Recommend the minimal change that restores correct library usage.
4. Stay library-aware.
   Judge the code against actual 8StarLabs and shadcn-style patterns, not
   abstract React preferences.

## Workflow

1. Read the current code and identify the actual user-visible or developer
   workflow problem.
2. Check imports and aliases first:
   wrong generated path, wrong alias assumptions, or missing supporting files
   often explain the bug faster than deeper styling analysis.
3. Compare usage against the intended installation/documentation pattern.
4. Separate:
   correctness bugs,
   integration mistakes,
   and optional cleanup opportunities.
5. Recommend the smallest fix that restores aligned usage.
6. If the user asked for a review only, do not jump straight to a rewrite unless
   the request includes that scope.

## Output format

For review requests, prefer:

1. Findings
2. Open questions or assumptions
3. Optional cleanup suggestions

Each finding should answer:
- what is wrong
- why it is wrong
- what specific change would fix it

## Common focus areas

- wrong import path or alias assumptions after registry install
- component used without matching supporting structure from docs/examples
- stale docs-derived usage after API drift
- unnecessary local fork of a component that should stay close to registry form
- app-side code blaming the library when the issue is integration shape

## Avoid

- generic React lint-style advice with no library context
- leading with style opinions before user-facing bugs
- telling consumers to edit this repo's internal registry authoring files
- recommending a rewrite when a small import, prop, or composition fix is enough

## References

- Read `references/review-checks.md` for a compact anti-pattern checklist.
