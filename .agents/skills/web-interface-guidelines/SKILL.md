---
name: web-interface-guidelines
description: Vercel Web Interface Guidelines for UI generation and review. Trigger when creating or reviewing interfaces, forms, accessibility, focus, motion, layout, loading states, content, performance, or responsive behavior.
---

# Web Interface Guidelines

Apply the [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) to every CashLift UI change. Use with `architecture`, `guide`, and `styling`; add `testing` when behavior changes.

For update procedure, audit notes, and the full checklist mirror, read `.agents/docs/web-interface-guidelines.md` only when needed.

## CashLift-Specific Rules

- During UI review, group findings by file and cite `file:line`. Focus on actionable misses, not restating rules that already pass.
- Vercel copy rules are product-style guidance unless they conflict with CashLift brand voice.
- Persist shareable UI state in the URL when route-significant: filters, tabs, pagination, expanded panels.
- Loading labels use ellipsis (`Loading…`); avoid submit flicker with a short delay or minimum visible time.
- Honor `prefers-reduced-motion`; animate `transform` and `opacity` only; never use `transition-all`.
- Prefer flex, grid, intrinsic layout, and container queries over JavaScript measurement for CSS-only layout.
- Every field has a label or accessible name; never block paste; mobile input text is at least 16px or zoom is preserved.
- Interactive targets are at least 24px; mobile targets are at least 44px.
- Use `<a>` or Next `<Link>` for navigation and `<button>` for actions.
- Icon-only buttons need descriptive `aria-label`; decorative icons use `aria-hidden`.
- Do not rely on color alone for status; pair color with text, icon shape, or another redundant cue.
