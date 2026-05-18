# Vercel Web Interface Guidelines

Last reviewed: 2026-05-18

Primary sources:

- Vercel Web Interface Guidelines: https://vercel.com/design/guidelines
- Vercel review command prompt: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
- Vercel AGENTS.md template: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md

## How Agents Should Use This

- Load `.agents/skills/web-interface-guidelines/SKILL.md` for all UI creation and UI review work.
- Keep `AGENTS.md` as a routing layer only; do not paste the full upstream checklist there.
- Treat the Vercel page as the source of truth. Refresh this doc when the upstream page changes or when CashLift intentionally diverges.
- Use Vercel-specific copywriting rules as product-style guidance unless they conflict with CashLift brand voice.

## Update Procedure

1. Re-open the primary Vercel guidelines page and the raw command prompt.
2. Compare the current upstream sections with `.agents/skills/web-interface-guidelines/SKILL.md`.
3. Keep the skill concise and actionable; move long examples or audit notes into this doc.
4. Update the `Last reviewed` date.
5. Run `pnpm lint`, `pnpm typecheck`, and `pnpm doctor:score` after implementation changes.

## Audit Checklist

- Interaction: keyboard support, visible focus, focus management, correct link/button semantics, no dead zones.
- Targets: minimum hit size, mobile target size, `touch-action: manipulation`, intentional tap highlight.
- Forms: labels, autocomplete/name/type/inputMode, paste allowed, validation next to fields, submit/loading behavior, unsaved-change warnings.
- Accessibility: icon names, decorative `aria-hidden`, polite live regions, skip link, heading order, semantic HTML.
- State: shareable filters/tabs/pagination/expanded state in the URL when route-significant.
- Motion: reduced-motion support, CSS-first motion, explicit transition properties, transform/opacity animations.
- Layout: responsive mobile/laptop/ultra-wide coverage, safe areas, no unwanted scrollbars, no JS measurement for CSS-only layout.
- Content: no color-only status, resilient long text, accurate titles, helpful errors, empty/sparse/dense/error states.
- Performance: image dimensions, preload/lazy-load choices, cheap controlled inputs, virtualization for large lists.
- Theming: browser theme color, `color-scheme` for dark UI, native form control dark-mode contrast.

## Baseline Audit Notes

Verification run during setup:

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm doctor:score` returned `100`.

Static checks that passed during setup:

- No `transition-all` usage found.
- No paste-blocking pattern found.
- No disabled browser zoom metadata found.
- No JavaScript layout measurement patterns found.
- Navigation generally uses Next `Link`.
- Decorative lucide icons generally use `aria-hidden`.

Initial gaps addressed with the setup:

- Root layout gained a skip link and browser theme color metadata.
- Dark theme gained `color-scheme: dark`.
- Global touch defaults gained `touch-action: manipulation` and intentional tap highlight styling.
- Text field errors gained polite live-region announcement.
- Existing marketing/dashboard forms gained more explicit autocomplete, input type, and placeholder conventions.
