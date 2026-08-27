---
title: Baseline JavaScript targets
description: Use Web Platform Baseline status to decide when CashLift may rely on a native API instead of shipping JavaScript.
---

Status: accepted

CashLift treats [Web Platform Baseline](https://webstatus.dev/) as the compatibility source of truth for browser APIs. We do not add a production JavaScript library, polyfill, or third-party script when a Baseline-safe platform feature covers the real use case. For the audit method, see [How Baseline Can Help You Ship Less JavaScript](https://www.smashingmagazine.com/2026/08/how-baseline-can-help-ship-less-javascript/).

## Audience split

| Surface | Default Baseline bar |
| --- | --- |
| Public marketing, checkout, legal | **Widely available** |
| Public demo first paint | **Widely available**; **Newly available** only with a server-rendered fallback |
| Authenticated Company Workspace | **Newly available** allowed with a feature check or fallback |

Widely available means the feature has shipped in Chrome, Edge, Firefox, and Safari for 30 months. Newly available means it just landed in all four engines. Limited availability is not a ship target without a fallback that does not increase the JavaScript payload.

## Three questions before any swap

1. **Audience-safe?** Match the table above — not “is it Baseline” in the abstract.
2. **Swap cheaper?** A polyfill larger than the library is a failed swap unless it loads only after a feature check.
3. **Covers the real use case?** `fetch` is not axios interceptors; `Intl` compact notation is not CashLift's `$1.2M` suffixes; `<dialog>` is not a range calendar.

Look up status on [webstatus.dev](https://webstatus.dev/) or the MDN Baseline badge. `package.json` is the dependency inventory — do not maintain a separate log.

## Consequences

- Server Components remain the default delivery path. Client JavaScript is an interactive leaf, not the page shell.
- Keep `src/services/next/emptyPolyfillModule.ts` aliased in `next.config.ts`. Do not restore Next.js default client polyfills.
- Keep `fetch` + Zod in feature `api.ts` / `query.ts`. Do not add `axios` or `superagent`.
- Format money with `Intl` in `modules/money`. Do not add `numeral`, `timeago`, or similar formatting packages.
- Load heavy client UI with `next/dynamic` (charts, date-range picker). Defer non-critical telemetry after idle, as in `ClientTelemetry`.
- Prefer tooling over prose when enforcing targets: `browserslist` Baseline queries and compat linting are follow-ups, not blockers for this ADR.

## Wait list

| Dependency | Verdict | Revisit when |
| --- | --- | --- |
| `date-fns` | Keep — already in the client bundle via dashboard `view-model` / `outflows` | `Temporal` is Baseline |
| `@internationalized/date` | Keep — React Aria calendar adapter | Same as `Temporal` |
| `@js-temporal/polyfill` | Do not add | N/A |

## Do not add without beating the three questions

`axios`, `superagent`, `numeral`, `timeago.js`, `pluralize`, `lodash`, `@js-temporal/polyfill`, re-enabled Next.js default polyfills, or upload-progress HTTP clients unless a product flow actually needs them.
