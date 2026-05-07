---
name: styling
description: Tailwind CSS v4, `cn()` usage, class composition patterns, and theme variables for this app. Trigger when styling components, refining visual consistency, or introducing reusable variants.
---

# Styling

Tailwind-first styling conventions for this app (`cashlift`).

## Toolchain

| Tool | Location | Purpose |
| --- | --- | --- |
| Tailwind CSS v4 | `src/app/globals.css` + `postcss.config.mjs` | Primary styling system |
| `cn()` helper | `src/lib/utils.ts` | Class merging (`clsx` + `tailwind-merge`) |
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
import { cn } from "@/lib/utils";

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

## Gotchas

- CSS custom properties (e.g. `--aspectRatio`) go on the `style` attribute, not as Tailwind arbitrary properties (`[--var:value]`).
- Prefer `transition-[prop]` with explicit properties over `transition-all`.
- Keep `motion-reduce:*` utilities for motion-heavy elements.

## UI Structure In This Repo

This app uses local UI primitives in `src/components/ui/*` (for example `button.tsx`, `panel.tsx`, `text-field.tsx`).

Before adding a new primitive:

1. Check existing components in `src/components/ui`.
2. Reuse the same patterns:
   - imports via `@/*` alias (`@/lib/utils`, `@/components/ui/...`)
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
