# Styling Reference

Rules live in `.agents/skills/styling/SKILL.md`. Examples only.

## `cn()` and variants

```tsx
import { cn } from "@/ui/utils/cn";
import { buttonVariants } from "@/ui/components/actions/buttonVariants";

<button className={cn(buttonVariants({ variant: "primary", size: "md" }), className)} />;
```

## Theme-backed utilities

```tsx
className="bg-panel text-panel-foreground border-border"
```

## Container query

```tsx
<Panel className="@container">
  <ul className="grid gap-3 @md:grid-cols-2">{items}</ul>
</Panel>
```

## CSS `:has()` (styling-only state)

```css
form:has(input:invalid) {
  border-color: var(--warning);
}
```

Glass dashboard surfaces: `DESIGN.md`, `src/ui/components/cockpit/GlassCard.tsx`.
