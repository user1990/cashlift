# Styling Reference

This reference keeps styling examples and rationale out of the hot-path `styling` skill. Load it when implementing non-trivial component styles, variants, responsive behavior, or reviewing visual consistency.

## Toolchain

Tailwind CSS v4 is the primary styling system. It is configured through `@import "tailwindcss";` in `src/app/globals.css`, `@tailwindcss/postcss` in `postcss.config.mjs`, and `@theme inline` variables in `globals.css`.

Use `cn()` from `@/ui/utils/cn` for class merging:

```tsx
import { cn } from "@/ui/utils/cn";

<div className={cn("px-4 py-2 text-sm", active && "bg-background", className)} />;
```

Use logical expressions, not object syntax:

```tsx
className={cn("base", active && "active-class")}
```

## Variants

Use `cva` when a reusable component has stable variants and sizes:

```tsx
const buttonVariants = cva("inline-flex items-center rounded-md text-sm", {
  variants: {
    variant: {
      primary: "bg-indigo-600 text-white",
      secondary: "border bg-background text-foreground",
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

Do not introduce a variant abstraction for one-off component state.

## Design Tokens

Prefer theme variables and standard Tailwind utilities:

```tsx
className="bg-background text-foreground"
```

Avoid new arbitrary values unless needed:

```tsx
className="bg-[#123456]"
```

If a value recurs or has product meaning, add it to `src/app/globals.css` first. Current theme variables include `--color-background`, `--color-foreground`, `--font-sans`, and `--font-mono`.

## CSS `:has()`

Use `:has()` when a parent style depends only on descendant structure or native state:

```css
form:has(input:invalid) {
  border-color: var(--warning);
}

li:has(input:checked) {
  background: var(--primary-subtle);
}

.grid:has(> :nth-child(4)) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

article:not(:has(img)) {
  padding-inline-start: 0;
}
```

Good fits: form, field, card, list item, and section styling driven by validity, checked/selected state, focus, presence, absence, or child count.

Keep state in React when it is business state, API/feature-flag state, permission state, multi-step flow state, or when the same value drives behavior, accessibility attributes, analytics, or data fetching.

Avoid chained, deeply nested, or broad `:has()` selectors on large dynamic DOMs.

## Container Queries

Use container queries when a reusable component's layout depends on parent space:

```tsx
<Panel className="@container">
  <ul className="grid gap-3 @md:grid-cols-2">{items}</ul>
</Panel>
```

Use viewport breakpoints for page shells, route-level grids, fixed headers, full-screen overlays, and behavior that genuinely depends on browser width.

Prefer container queries over layout props or JavaScript measurement for CSS-only responsive changes. Avoid `ResizeObserver`, `matchMedia`, and `window.innerWidth` when CSS can express the behavior.

## Repository UI Patterns

Local primitives live in `src/ui/components/*`, for example `Button.tsx`, `Panel.tsx`, and `TextField.tsx`.

Before adding a primitive:

1. Search `src/ui/components`.
2. Reuse local imports through `@/*`.
3. Follow local `cn()` and prop type patterns.
4. Extend an existing primitive when possible.

## Colors And Icons

No `@your-org/ui` color export exists. Use Tailwind utilities and variables from `src/app/globals.css`.

Icons come from `lucide-react`:

```tsx
import { PiggyBank, TrendingUp } from "lucide-react";
```

## Gotchas

- CSS custom properties such as `--aspectRatio` go on the `style` attribute, not as Tailwind arbitrary property utilities.
- Prefer `transition-[prop]` with explicit properties over `transition-all`.
- Keep `motion-reduce:*` utilities for motion-heavy elements.
