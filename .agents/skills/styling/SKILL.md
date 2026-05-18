---
name: styling
description: Tailwind CSS v4, `cn()` usage, class composition patterns, and theme variables for this app. Trigger when styling components, refining visual consistency, or introducing reusable variants.
---

# Styling

Tailwind-first styling conventions for this app (`CashLift`).

## Toolchain

| Tool | Location | Purpose |
| --- | --- | --- |
| Tailwind CSS v4 | `src/app/globals.css` + `postcss.config.mjs` | Primary styling system |
| `cn()` helper | `src/ui/utils/cn.ts` | Class merging (`clsx` + `tailwind-merge`) |
| `cva` | `class-variance-authority` | Optional variant composition for reusable components |

Tailwind is configured through:

- `@import "tailwindcss";` in `src/app/globals.css`
- `@tailwindcss/postcss` in `postcss.config.mjs`
- `@theme inline` CSS variables in `src/app/globals.css`

## Design Tokens

Use theme variables and standard Tailwind utilities first.

```tsx
// ✅ Prefer theme-backed utilities / semantic styles
className="bg-background text-foreground"

// ❌ Avoid introducing new one-off arbitrary values without reason
className="bg-[#123456]"
```

### Current Theme Variables

Defined in `src/app/globals.css` via `@theme inline`:

- `--color-background`
- `--color-foreground`
- `--font-sans`
- `--font-mono`

If new design tokens are needed, add them in `src/app/globals.css` first and then consume via Tailwind classes.

### Spacing, Radius, Typography

Use default Tailwind v4 scales unless a product requirement mandates a custom token.

## Class Merging with cn()

```tsx
import { cn } from "@/ui/utils/cn";

<div
  className={cn(
    "px-4 py-2 text-sm",
    variant === "primary" && "bg-indigo-600 text-white",
    disabled && "opacity-50",
    className,
  )}
/>;
```

Use logical expressions, not object syntax:

```tsx
// ✅ Good
className={cn("base", active && "active-class")}

// ❌ Avoid
className={cn("base", { active })}
```

## Component Variants with CVA

When a component has multiple stable variants, use `cva`.

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva("inline-flex items-center rounded-md text-sm", {
  variants: {
    variant: {
      primary: "bg-indigo-600 text-white",
      secondary: "border border-[#E8E8EC] bg-white text-[#0A0A0A]",
    },
    size: {
      sm: "h-8 px-3",
      md: "h-9 px-4",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});
```

## Prefer CSS :has() for Structural Parent State

Use CSS `:has()` when a parent only needs styling because of descendant structure or native UI state and the selector makes that relationship easier to understand. Avoid wrapper elements, React state, event handlers, prop drilling, or conditional parent `className` logic when they only mirror a descendant selector that CSS can express.

```css
/* ✅ Parent reacts to native field validity without React state. */
form:has(input:invalid) {
	border-color: var(--warning);
	background: var(--warning-subtle);
}

/* ✅ Card/list item reacts to a checked descendant. */
li:has(input:checked) {
	background: var(--primary-subtle);
	border-color: var(--primary-subtle-border);
}

/* ✅ Layout reacts to child count. */
.grid:has(> :nth-child(4)) {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* ✅ Remove image-specific spacing when no image exists. */
article:not(:has(img)) {
	padding-inline-start: 0;
}
```

Use `:has()` for:

- form, field, card, list item, and section styling driven by descendant validity, checked/selected state, focus, presence, absence, or child count
- replacing wrapper elements that only exist so a parent can receive a class
- replacing JavaScript that only toggles parent classes from child DOM events

Prefer explicit React state, a top-level class, or a prop when:

- the condition is important component state that future readers will expect to find near the component root
- downward state flow makes the component easier to scan than a CSS-only structural selector
- the same state drives behavior, data fetching, accessibility attributes, analytics, or other non-style effects

Do not use `:has()` when:

- the styling depends on business rules, API results, feature flags, permissions, or multi-step user state
- the selector becomes chained, deeply nested, or broad enough to be expensive on large dynamic DOMs, especially under frequent DOM mutations
- the selector stacks multiple state checks such as `.card:has(.selected):has(.error)` without a clear performance/readability reason
- legacy browser support is required without a build-time fallback or explicit feature-detection strategy

## Prefer Container Queries for Component Layout

Use container queries when a component's internal layout depends on the space available from its parent. Keep viewport breakpoints for page shells, route-level grids, fixed headers, full-screen overlays, and other behavior that genuinely depends on browser width.

Prefer Tailwind v4 container variants over layout props or JavaScript measurement for CSS-only responsive changes:

```tsx
<Panel className="@container">
	<ul className="grid gap-3 @md:grid-cols-2">
		{/* items */}
	</ul>
</Panel>
```

Use container queries for:

- reusable cards, panels, lists, and headers that may appear in a sidebar, modal, grid, or full-width area
- replacing component-internal viewport variants such as `md:grid-cols-2` when the parent width is the real condition
- avoiding `size`, `layout`, `compact`, or similar props that only choose visual responsive layout

Prefer `@container` on the nearest stable component wrapper, then use variants such as `@md:grid-cols-2`, `@lg:flex-row`, or arbitrary container variants when needed. Use named containers only when a descendant must query a specific ancestor instead of the nearest query container.

Do not use container queries when:

- the layout decision belongs to the page shell or route composition
- the component genuinely needs viewport dimensions
- CSS alone cannot express the behavior

Avoid `ResizeObserver`, `matchMedia`, and `window.innerWidth` for layout changes that can be expressed with container queries.

## Gotchas

- CSS custom properties (e.g. `--aspectRatio`) go on the `style` attribute, not as Tailwind arbitrary properties (`[--var:value]`).
- Prefer `transition-[prop]` with explicit properties over `transition-all`.
- Keep `motion-reduce:*` utilities for motion-heavy elements.

## UI Structure In This Repo

This app uses local UI primitives in `src/ui/components/*` (for example `Button.tsx`, `Panel.tsx`, `TextField.tsx`).

Before adding a new primitive:

1. Check existing components in `src/ui/components`.
2. Reuse the same patterns:
   - imports via `@/*` alias (`@/ui/utils/cn`, `@/ui/components/...`)
   - `cn("base", condition && "modifier")`
   - prop type alias pattern (`type Props = { children: React.ReactNode }` when children are used)
3. Prefer extending an existing primitive over creating a near-duplicate.

## Colors and Arbitrary Values

Current code contains arbitrary color utilities (for example `bg-[#FAFAFA]`, `border-[#E8E8EC]`). Do not multiply these ad hoc.

When touching a component:

- Prefer existing palette values already used in the feature.
- If introducing a recurring color, move it into theme variables in `globals.css`.
- Avoid mixing several close hex shades for the same semantic purpose.

## Colors

No `@your-org/ui` color export exists in this app.

Use Tailwind utilities and theme variables from `src/app/globals.css`.

## Icons

Icons in this codebase come from `lucide-react`.

```tsx
import { PiggyBank, TrendingUp } from "lucide-react";
```
