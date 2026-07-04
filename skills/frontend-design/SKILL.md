---
name: frontend-design
description: Use when building or reshaping frontend UI, reviewing visual design quality, improving responsive layouts, tightening typography, spacing, hierarchy, motion, copy, or making an interface feel more intentional and less templated.
license: Apache-2.0. Upstream: https://github.com/anthropics/skills/tree/main/skills/frontend-design
---

# Frontend Design

Use this skill as a design-lead pass for UI work. The goal is not decoration;
it is a more intentional interface that fits the product, audience, and job of
the page.

## Core Principles

- Ground the visual direction in the subject. For this repo, the subject is an
  installable component library for product engineers evaluating reusable UI.
- Treat the first screen as the thesis: show the product, components, or live
  interaction directly instead of relying on generic marketing composition.
- Make typography, spacing, and hierarchy carry personality. Avoid oversized
  generic hero type inside compact tool surfaces.
- Use structure to encode real information. Do not add decorative numbering or
  dividers unless they clarify sequence, grouping, or comparison.
- Spend boldness in one place. Keep surrounding UI quiet and disciplined.
- For operational/product UI, prefer scan-friendly density, restrained styling,
  predictable rhythm, and clear affordances over ornate presentation.
- Copy is interface material. Keep labels specific, plain, and useful.

## Design Review Workflow

1. Identify the screen's job, audience, and most important workflow.
2. Inspect the existing visual system before changing it:
   colors, typography, spacing scale, border radius, grid, shadows, motion.
3. Review responsive behavior at mobile and desktop widths.
4. Look for obvious quality issues:
   clipping, awkward alignment, inconsistent card heights, text wrapping,
   uneven preview framing, hidden overflow without a hint, dead whitespace,
   low contrast, unbalanced density, or controls that look broken.
5. Make the smallest coherent update that improves the system rather than
   patching one item at a time.
6. Validate with screenshots or DOM measurements at the relevant breakpoints.

## Planning Check

Before larger redesigns, sketch a compact design plan:

- Color: 4-6 tokens already present or intentionally introduced.
- Type: display/body/utility roles.
- Layout: the governing grid or rhythm.
- Signature: the one memorable element that is specific to the product.

Reject choices that could be dropped into any SaaS landing page unchanged.

## Validation

- Verify mobile and desktop.
- Confirm text does not overflow or overlap.
- Confirm interactive previews render, scroll, and crop intentionally.
- Run focused lint/type/format checks for touched files.
