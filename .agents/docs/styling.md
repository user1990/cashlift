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

## Native CSS interaction and sizing

Prefer platform behavior when it matches the user interaction; do not remove application state when it owns behavior, accessibility, or server validation.

### Anchors and scroll position

Use real fragment links and target margins to account for sticky headers. The global root already enables smooth scrolling and disables it for reduced motion in `src/app/globals.css`.

```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

.anchor-target {
  scroll-margin-block-start: 6rem;
}
```

Keep `scrollIntoView()` when code must reveal a changing keyboard selection inside a specific scroll container; smooth scrolling alone does not provide that behavior.

### Scroll snapping

Add `scroll-snap-type: x proximity` to a horizontal scroller and `scroll-snap-align: start` to its items only when item alignment is intended. Avoid mandatory snapping that can trap or fight free scrolling. Snapping does not replace carousel selection logic or accessible controls.

### Native form validity and focus

Use `:user-valid` / `:user-invalid` for styling native HTML constraint validity after the user has interacted. They do not represent React Hook Form, server, or business-rule errors; keep those sources authoritative and exposed to assistive technology.

```css
input:user-invalid {
  border-color: var(--warning);
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

Do not remove focus outlines without an equivalent visible cue. `:focus-visible` can also match text fields focused by pointer; test with the actual browser interaction and component library.

### Line-based sizing and growing fields

Use `lh` when the intended minimum is a number of lines and the element has a deliberate line height:

```css
textarea {
  min-block-size: 3lh;
}
```

`field-sizing: content` can replace textarea `scrollHeight` sizing code when growing-to-content is the desired behavior:

```css
textarea {
  field-sizing: content;
  min-block-size: 3lh;
  max-block-size: 12lh;
  inline-size: 100%;
}
```

The field should still work and remain resizable/readable where `field-sizing` is unsupported. It is Baseline Newly available (June 2026), so public surfaces targeting Widely available need a fallback; verify the current target before relying on it. `lh` is now Baseline Widely available. Avoid `field-sizing: content` on fixed-layout inputs unless content-driven width changes are intended.

Glass dashboard surfaces: `DESIGN.md`, `src/ui/components/cockpit/GlassCard.tsx`.
