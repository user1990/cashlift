---
name: web-interface-guidelines
description: Vercel Web Interface Guidelines for UI generation and review. Trigger when creating or reviewing interfaces, forms, accessibility, focus, motion, layout, loading states, content, performance, or responsive behavior.
---

# Web Interface Guidelines

Apply the Vercel Web Interface Guidelines to every Kuvro UI change. Use this skill with `architecture`, `guide`, and `styling`; add `testing` when behavior changes.

Source of truth: https://vercel.com/design/guidelines. For the fuller local checklist and update notes, read `.agents/docs/web-interface-guidelines.md` only when needed.

## Interaction & Accessibility

- Keyboard works everywhere. Use native controls first and follow WAI-ARIA APG patterns for custom widgets.
- Every focusable element has a visible `:focus-visible` style; grouped controls use `:focus-within` when useful. Never remove outlines without a replacement.
- Manage focus for dialogs, drawers, menus, validation errors, and route-level recovery states.
- Match visual and hit targets. Interactive targets are at least 24px; mobile targets are at least 44px.
- Use `<a>` or Next `<Link>` for navigation. Use `<button>` for actions. Never use clickable `div`/`span` elements.
- Icon-only buttons need descriptive `aria-label`; decorative icons use `aria-hidden`.
- Async updates, inline validation, and toasts use polite live regions.
- Include a skip link and hierarchical headings on page-level layouts.

## Forms

- Every field has a label or accessible name; clicking the label focuses the control.
- Inputs have meaningful `name`, `autocomplete`, `type`, and `inputMode` values.
- Mobile input text is at least 16px, or the viewport setup avoids iOS focus zoom without disabling zoom.
- Never block paste. Forms must work with password managers and one-time-code paste.
- Keep submit enabled until submission starts; then disable only while in flight and keep the original label with a loading indicator.
- Let users submit incomplete forms to surface validation. Show errors next to fields and focus the first error after submit.
- Placeholder text signals emptiness, uses an example or pattern when helpful, and ends with the ellipsis character `…`.
- Warn before navigation when unsaved data can be lost.

## State, Feedback & Content

- Persist shareable UI state in the URL: filters, tabs, pagination, expanded panels, and route-significant selections.
- Confirm destructive actions or provide an undo window.
- Loading labels use ellipsis, for example `Loading…`, and loading indicators avoid flicker with a short delay/minimum visible time.
- Design empty, sparse, dense, error, and recovery states. Avoid dead ends.
- Do not rely on color alone. Pair status color with text, icon shape, or another redundant cue.
- Text containers handle short, average, and very long content with wrapping, truncation, `min-w-0`, or clamping as appropriate.
- Use locale-aware formatting with `Intl.DateTimeFormat` and `Intl.NumberFormat`; keep currency precision consistent inside a context.
- Use semantic HTML before ARIA.

## Motion, Layout & Performance

- Honor `prefers-reduced-motion`; provide reduced variants or disable nonessential motion.
- Prefer CSS animations, then Web Animations API, then JS libraries. Animate `transform` and `opacity`; never use `transition-all`.
- Animations are input-driven and interruptible.
- Prefer flex, grid, intrinsic layout, and container queries over JavaScript measurement.
- Account for safe areas on full-bleed layouts.
- Avoid unwanted scrollbars and layout shifts. Images have explicit dimensions; above-fold images are prioritized and below-fold images lazy-load.
- Virtualize large lists or use `content-visibility: auto`.
- Batch DOM reads/writes and keep controlled input loops cheap.

## Theming & Review

- Dark themes set `color-scheme: dark`; browser theme color matches the page background.
- Touch surfaces set `touch-action: manipulation` and intentional tap highlight styling.
- Native selects specify background and text colors for Windows dark-mode contrast.
- Vercel-specific copy rules are product-style guidance unless they conflict with Kuvro brand voice: concise active voice, specific action labels, helpful error recovery, numerals for counts, and consistent terms.
- During UI review, group findings by file and cite `file:line`. Focus on actionable misses, not restating rules that already pass.
