---
name: styling
description: Tailwind CSS v4, `cn()` usage, class composition patterns, and theme variables for this app. Trigger when styling components, refining visual consistency, or introducing reusable variants.
---

# Styling

Use this skill for CashLift styling changes. Read `.agents/docs/styling.md` for examples. For dashboard glass surfaces, read `DESIGN.md` and `src/ui/components/cockpit/*`.

## Toolchain

- Tailwind CSS v4 is configured in `src/app/globals.css` and `postcss.config.mjs`.
- Theme variables live in `@theme inline` and the extended `@theme` block in `src/app/globals.css` (shell, panel, paper, primary, signal, warning, and related tokens).
- Use `cn()` from `@/ui/utils/cn` for class composition.
- Use `tailwind-variants` (`tv`) for reusable components with stable variants. Reference: `src/ui/components/actions/buttonVariants.ts`, `src/ui/components/actions/Button.tsx`, `src/ui/components/layout/Panel.tsx`.
- Icons come from `lucide-react`.

## Tokens And Values

- Prefer theme-backed utilities and semantic classes such as `bg-background text-foreground`, `bg-panel`, and `text-muted-foreground`.
- Avoid new one-off arbitrary pixels/colors unless the product requirement needs them.
- If a recurring value is needed, add a theme variable in `globals.css` first, then consume it with Tailwind.
- Use default Tailwind spacing, radius, and typography scales unless a custom token is justified.
- Existing arbitrary colors may remain; do not multiply near-duplicate hex values.

## Class Composition

- Use `cn("base", condition && "modifier", className)`.
- Do not use object syntax in `cn()`.
- Prefer `transition-[property]` over `transition-all`.
- Preserve `motion-reduce:*` behavior for motion-heavy elements.

## Responsive Layout

- Prefer container queries for reusable component-internal layout that depends on parent space.
- Keep viewport breakpoints for route shells, fixed headers, full-screen overlays, and behavior that truly depends on browser width.
- Avoid `ResizeObserver`, `matchMedia`, and `window.innerWidth` for CSS-only layout decisions unless a measured chart or canvas genuinely needs it.
- Use `@container` on the nearest stable wrapper; use named containers only when a descendant must query a specific ancestor.

## Structural State

- Prefer CSS `:has()` when a parent only needs styling because of descendant structure or native state: invalid inputs, checked controls, child count, image presence, focus, selected state.
- Prefer React state, props, or top-level classes when the condition drives behavior, data fetching, accessibility, analytics, business rules, API/feature-flag state, permissions, or complex flows.
- Avoid chained/deep/broad `:has()` selectors on large or frequently mutating DOMs.

## UI Components

- Check `src/ui/components/*` (for example `actions/Button.tsx`, `layout/Panel.tsx`, `forms/TextField.tsx`) before adding a new primitive.
- Reuse local patterns: `@/*` imports, `cn()` composition, explicit `children` prop types, and local naming conventions.
- Prefer extending an existing primitive over creating a near-duplicate.

## Gotchas

- CSS custom properties such as `--aspectRatio` belong on `style`, not Tailwind arbitrary property utilities.
