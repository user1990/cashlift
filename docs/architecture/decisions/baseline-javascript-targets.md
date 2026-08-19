---
title: Baseline JavaScript targets
description: Use Web Platform Baseline status to decide when CashLift may rely on a native API instead of shipping JavaScript.
---

Status: accepted

CashLift treats [Web Platform Baseline](https://webstatus.dev/) as the compatibility source of truth for browser APIs. We do not add a production JavaScript library, polyfill, or client script when a Baseline-safe platform feature covers the real use case.

## Audience split

CashLift is not one audience.

| Surface | Who loads it | Default Baseline bar |
| --- | --- | --- |
| Public marketing, pricing, checkout, legal | Unknown devices; first visit; no company session | **Widely available** |
| Public Studio Nova demo | Unknown devices, but the same workspace widgets as production | **Widely available** for first paint; **Newly available** only behind a feature check that degrades to the server-rendered UI |
| Authenticated Company Workspace | Company Members on current desktop browsers making cash decisions | **Newly available** is allowed when a feature check or server-rendered fallback exists |

Widely available means the feature has shipped in Chrome, Edge, Firefox, and Safari for 30 months. Newly available means it has just landed in all four engines; older devices may still miss it. Limited availability is not a ship target without a fallback that does not increase the JavaScript payload.

## Consequences

- Server Components remain the default delivery path. Client JavaScript is an interactive leaf, not the page shell.
- Keep `src/services/next/emptyPolyfillModule.ts` aliased in `next.config.ts`. Do not re-enable Next.js default polyfills to paper over a Limited feature.
- Keep `date-fns` and `@internationalized/date` until `Temporal` is Baseline. Do not add `@js-temporal/polyfill`.
- Keep `fetch` wrappers in feature `api.ts` / `query.ts` files. Do not add `axios` or `superagent`.
- Format money and dates with `Intl` helpers already owned by `modules/money` and dashboard view models. Do not add numeral, timeago, or similar formatting packages.
- Record every new production script or dependency against the [Baseline JavaScript](/engineering/baseline-javascript) decision template before it ships.
- A heavier polyfill than the library it replaces is a failed swap, even if the native API is a better design.
