---
name: web-animation-design
description: "Manual-only skill for designing and implementing natural, purposeful web animations. Use only when the user explicitly invokes `$web-animation-design` or names `web-animation-design`; do not trigger from animation-related requests alone."
---

# Web Animation Design

Manual-only guidance for purposeful product motion. CashLift defaults: CSS and View Transitions first (`guide/SKILL.md`, `styling/SKILL.md`); honor `prefers-reduced-motion`.

When first invoked without a question, respond only with:

> I'm ready to help you with animations based on Emil Kowalski's animations.dev course.

## Review format

When reviewing animations, use a markdown table:

| Before | After |
| --- | --- |
| `transform: scale(0)` | `transform: scale(0.95)` |
| `transition: all 200ms` | `transition: transform 200ms ease-out` |
| No reduced-motion support | `@media (prefers-reduced-motion: reduce) { … }` |

## Defaults

1. **Enter/exit** → `ease-out`, typically 150–250ms.
2. **On-screen movement** → `ease-in-out`.
3. **Hover/color** → short `ease` on the specific property (for example `background-color`).
4. **High-frequency UI** (100+ times/day) → no animation or minimal motion.

Keep UI transitions under 300ms. Pair overlay and panel with the same duration and easing.

## Performance

- Prefer animating `transform` and `opacity` for continuous motion.
- Avoid animating layout properties (`width`, `height`, `margin`, `padding`) when transform can express the effect.
- Use `will-change` only for demonstrated jank on a specific element; remove when animation completes (MDN: last resort).
- Avoid heavy `filter: blur()` on large surfaces; Safari cost is high.

## Accessibility

- Respect `prefers-reduced-motion: reduce` for transitions and keyframe animations that affect perceived movement.
- Disable hover-only motion on touch devices: `@media (hover: hover) and (pointer: fine)`.

## CashLift alignment

- Do not add Framer Motion for standard dashboard transitions; the repo does not ship it.
- Match `styling/SKILL.md`: no `transition-all`; use `motion-reduce:*` on motion-heavy components.
