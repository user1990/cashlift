---
name: styling
description: Tailwind CSS v4, `cn()` usage, class composition patterns, and theme variables for this app. Trigger when styling components, refining visual consistency, or introducing reusable variants.
---

# Styling

Use this skill for Kuvro styling changes. Read `.agents/docs/styling.md` only when you need examples or deeper rationale.

## Toolchain

- Tailwind CSS v4 is configured in `src/app/globals.css` and `postcss.config.mjs`.
- Theme variables live in `@theme inline` inside `src/app/globals.css`.
- Use `cn()` from `@/ui/utils/cn` for class composition.
- Use `class-variance-authority` only for reusable components with stable variants.
- Icons come from `lucide-react`.

## Tokens And Values

- Prefer theme-backed utilities and semantic classes such as `bg-background text-foreground`.
- Avoid new one-off arbitrary pixels/colors unless the product requirement needs them.
- If a recurring value is needed, add a theme variable first, then consume it with Tailwind.
- Current theme variables include `--color-background`, `--color-foreground`, `--font-sans`, and `--font-mono`.
- Use default Tailwind spacing, radius, and typography scales unless a custom token is justified.
- Existing arbitrary colors may remain; do not multiply near-duplicate hex values.

## Class Composition

- Use `cn("base", condition && "modifier", className)`.
- Do not use object syntax in `cn()`.
- Keep variant classes readable and colocated with the component unless a reusable primitive benefits from `cva`.
- Prefer `transition-[property]` over `transition-all`.
- Preserve `motion-reduce:*` behavior for motion-heavy elements.

## Responsive Layout

- Prefer container queries for reusable component-internal layout that depends on parent space.
- Keep viewport breakpoints for route shells, fixed headers, full-screen overlays, and behavior that truly depends on browser width.
- Avoid `ResizeObserver`, `matchMedia`, and `window.innerWidth` for CSS-only layout decisions.
- Use `@container` on the nearest stable wrapper; use named containers only when a descendant must query a specific ancestor.

## Structural State

- Prefer CSS `:has()` when a parent only needs styling because of descendant structure or native state: invalid inputs, checked controls, child count, image presence, focus, selected state.
- Prefer React state, props, or top-level classes when the condition drives behavior, data fetching, accessibility, analytics, business rules, API/feature-flag state, permissions, or complex flows.
- Avoid chained/deep/broad `:has()` selectors on large or frequently mutating DOMs.

## UI Components

- Check `src/ui/components/*` before adding a new primitive.
- Reuse local patterns: `@/*` imports, `cn()` composition, explicit `children` prop types, and local naming conventions.
- Prefer extending an existing primitive over creating a near-duplicate.

## Gotchas

- CSS custom properties such as `--aspectRatio` belong on `style`, not Tailwind arbitrary property utilities.
- No `@your-org/ui` color export exists in this app; use Tailwind utilities and `src/app/globals.css`.
