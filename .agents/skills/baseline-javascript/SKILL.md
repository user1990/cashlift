---
name: baseline-javascript
description: Evaluate new production npm dependencies, polyfills, and third-party browser scripts against Web Platform Baseline. Trigger when adding or removing a package that ships to the browser, introducing a polyfill, or loading a third-party script — not for ordinary "use client" UI leaves.
---

# Baseline JavaScript

Read `docs/decisions/0001-baseline-javascript-targets.md` before adding a production dependency, polyfill, or third-party script. Agents: load this skill only for those cases, not for every client component.

## Targets

| Surface | Default bar |
| --- | --- |
| Public marketing, checkout, legal | Widely available |
| Public demo first paint | Widely available; Newly available only with a server-rendered fallback |
| Authenticated Company Workspace | Newly available allowed with a feature check or fallback |

## Workflow

1. Search `src/` for an existing helper (`formatCurrency`, `countCharacters`, feature `api.ts` fetch wrappers, UI primitives).
2. Look up the platform API on [webstatus.dev](https://webstatus.dev/) or MDN.
3. Ask the three questions from the ADR: audience-safe, swap cheaper, covers the real use case.
4. If Newly available, feature-detect and degrade. Do not load a polyfill larger than the library.
5. Keep `src/services/next/emptyPolyfillModule.ts` aliased in `next.config.ts`. Do not restore Next.js default client polyfills.

## Defaults for this codebase

- Money: `Intl` in `modules/money`. No `numeral` / `timeago`.
- HTTP: `fetch` + Zod in feature `api.ts`. No `axios`.
- Dates: keep `date-fns` and `@internationalized/date` until `Temporal` is Baseline. No Temporal polyfill.
- Overlays: native `<dialog>` / Popover for simple confirms; keep React Aria for the range calendar.
- Charts: lazy `recharts`. Motion: CSS or View Transitions first.

## Do not

- Invent traffic percentages or bundle-savings claims.
- Replace React Query, Clerk, Zod, or next-intl with a platform API they do not equivalent.
- Append decision-log prose — `package.json` is the inventory.
