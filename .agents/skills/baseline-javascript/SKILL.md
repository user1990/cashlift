---
name: baseline-javascript
description: Evaluate production JavaScript dependencies, polyfills, client scripts, and native browser APIs against Web Platform Baseline. Trigger when adding or removing npm packages that ship to the browser, writing "use client" modules, introducing polyfills or third-party scripts, choosing fetch/date/format/dialog/popover libraries, or asking whether a platform API can replace a dependency.
---

# Baseline JavaScript

Read `docs/engineering/baseline-javascript.md` and `docs/architecture/decisions/baseline-javascript-targets.md` before adding a production dependency, polyfill, client script, or native browser API. Append a decision record to `docs/engineering/baseline-javascript-decision-log.md` in the same change.

## Targets

| Surface | Default bar |
| --- | --- |
| Public marketing, checkout, legal | Baseline Widely available |
| Public demo first paint | Widely available; Newly available only with a server-rendered fallback |
| Authenticated Company Workspace | Newly available allowed with a feature check or fallback |
| Limited availability | Do not ship without a fallback that does not enlarge the payload |

## Workflow

1. Search `src/` for an existing helper (`formatCurrency`, `countCharacters`, feature `api.ts` fetch wrappers, UI primitives). Do not duplicate them.
2. Keep the work in a Server Component unless this is an interactive leaf (mutation control, picker, chart, idle telemetry).
3. Identify the platform API. Look up Baseline on webstatus.dev or the MDN Baseline badge. Record Limited / Newly / Widely and the URL.
4. Ask the three questions:
   - Audience-safe for this CashLift surface?
   - Swap cheaper than the current library, including any polyfill?
   - Native API covers the real use case (Zod parse, optimistic **Spend Request**, range calendar, compact currency suffixes, Clerk session)?
5. If any answer is no, keep or do not add the library. Write a revisit date.
6. If Newly available, feature-detect and degrade. Do not load a polyfill larger than the library. Do not re-enable `src/services/next/emptyPolyfillModule.ts`.
7. Load heavy client UI with `next/dynamic` the way dashboard charts and the date-range picker already do.
8. Respect CSP nonce + `strict-dynamic` in `src/proxy.ts`. Do not add script hosts or store auth tokens in `localStorage` / `sessionStorage`.

## Defaults for this codebase

- Money and dates: `Intl` in `modules/money` and view models. No `numeral` / `timeago`.
- HTTP: `fetch` + Zod in feature `api.ts`. No `axios`.
- Dates: keep `date-fns` and `@internationalized/date` until `Temporal` is Baseline. No Temporal polyfill.
- Overlays: native `<dialog>` / Popover for simple confirms; keep React Aria for the range calendar and existing fields.
- Charts: keep lazy `recharts`. No native chart API.
- Motion: CSS or View Transitions first; existing `LazyMotion` + `domAnimation` if motion is required.

## Do not

- Invent traffic percentages or bundle-savings claims.
- Call a Chromium-only blog post Baseline.
- Replace React Query, Clerk, Zod, or next-intl with a platform API they do not equivalent.
- Ship a new `"use client"` data shell on a workspace route.
