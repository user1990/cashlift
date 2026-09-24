# Vercel Web Interface Guidelines

Primary source: https://vercel.com/design/guidelines

Load `.agents/skills/web-interface-guidelines/SKILL.md` for UI creation and review. Treat the Vercel page as upstream truth; refresh this doc when upstream changes or CashLift intentionally diverges.

## Update procedure

1. Re-open the Vercel guidelines page.
2. Keep the skill concise; keep audit notes and long mirrors here only when needed.
3. Run `pnpm lint`, `pnpm typecheck`, and `pnpm check:react` after UI implementation changes.

## Audit checklist (review aid)

- Interaction: keyboard, focus, link/button semantics.
- Targets: hit area, `touch-action: manipulation`, mobile sizing.
- Forms: labels, paste allowed, errors near fields, loading/submit behavior.
- Accessibility: icon labels, `aria-hidden` on decorative icons, headings, landmarks.
- State: route-significant filters/tabs in the URL (`nuqs` where established).
- Motion: `prefers-reduced-motion`, explicit transition properties, transform/opacity for movement.
- Layout: responsive coverage, container queries for components, avoid JS measurement for CSS-only layout.
- Content: no color-only status, resilient long text, helpful errors and empty states.
