---
title: Baseline JavaScript
description: Decide when CashLift should ship JavaScript, when the platform already covers the job, and how to record that choice.
---

Use [Web Platform Baseline](https://webstatus.dev/) before adding a production dependency, client component, polyfill, or third-party script. The accepted targets live in [Baseline JavaScript targets](/architecture/decisions/baseline-javascript-targets). Copy the templates in this guide into the [decision log](/engineering/baseline-javascript-decision-log) when you evaluate a library or a native API.

This guide applies the August 2026 Smashing Magazine audit method from [How Baseline Can Help You Ship Less JavaScript](https://www.smashingmagazine.com/2026/08/how-baseline-can-help-ship-less-javascript/) to CashLift's server-first Next.js app.

## What Baseline is

Baseline is a WebDX Community Group signal for whether a web platform feature is safe to use across the major engines: Chrome, Edge, Firefox, and Safari. It is a compatibility tracker, not a permission to skip accessibility, authorization, or product-format review.

A feature is in one of three states:

| Status | Meaning | CashLift default |
| --- | --- | --- |
| Limited availability | Missing from at least one major engine | Do not rely on it in shipped UI. Keep the current library, or feature-detect and omit the enhancement. Do not load a large polyfill by default. |
| Baseline Newly available | Just shipped in all four engines | Allowed on authenticated Company Workspace routes when a feature check or server-rendered fallback exists. Prefer Widely available on public marketing and the public demo first paint. |
| Baseline Widely available | Present in all four engines for 30 months | Use the platform API. Do not add a library that only wraps it. |

Look a feature up on [webstatus.dev](https://webstatus.dev/), on the Baseline badge at the top of the MDN reference page, or with the `web-features` npm package. Record the status and the URL in the decision log. Do not treat "I saw a Chromium blog post" as Baseline.

The 30-month gap between Newly and Widely is the usual reason a library is still in `package.json`. CashLift's authenticated workspace is a B2B cash-decision surface, so Newly available APIs are often usable there. Public marketing and checkout still see unknown devices, so they stay on Widely available unless the enhancement degrades cleanly.

## Techniques that reduce JavaScript

The article's wins come in clusters. Apply them to CashLift as payload and execution cuts, not as a hunt for novelty APIs.

### Prefer the platform cluster over a formatting library

`Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Intl.PluralRules`, `Intl.ListFormat`, and `Intl.Segmenter` are Widely available. CashLift already formats **MoneyCents** with `Intl.NumberFormat` in `src/modules/money/format.ts` and counts user-visible characters with `Intl.Segmenter` in `src/utilities/text/countCharacters.ts`.

Do not add `numeral`, `timeago.js`, `pluralize`, or list-joining helpers. If a **Vendor Bill** due label needs "in 3 days", compute the unit in a few lines and pass it to `Intl.RelativeTimeFormat`. Keep CashLift's custom compact-currency suffixes in `formatPreciseCompactCurrency` until a product owner asks for `notation: "compact"`; the platform string is not automatically the same as `$1.2M`.

`Intl.DurationFormat` was Newly available as of March 2025. Do not use it for public marketing copy yet. On the workspace, feature-detect it before rendering a duration such as a **Subscription** renewal window.

### Keep a thin `fetch` wrapper; do not add an HTTP client

`fetch` and `AbortController` are Widely available. CashLift already loads the workspace dataset and **Spend Request** decisions with `fetch` in `src/modules/workspace/query.ts` and `src/modules/spend-requests/api.ts`. Those wrappers check `response.ok`, parse with Zod, and throw stable messages. That is the replacement for axios interceptors, not a reason to install axios.

`AbortSignal.timeout()` covers request timeouts without a library. Do not add upload-progress HTTP clients unless a product flow actually reports upload progress. Browser code still must not query finance tables; `fetch` only talks to CashLift route handlers.

### Use native UI primitives for simple overlays; keep React Aria for complex widgets

The article replaces modal, tooltip, focus-trap, and body-scroll-lock libraries with `<dialog>`, the Popover API, CSS `:has(dialog:modal)`, and CSS anchor positioning.

CashLift already uses `react-aria-components` for buttons, fields, disclosures, and the dashboard date-range popover. Do not rip that out for a pixel-identical native rewrite. Do use native elements for new, simple confirmations:

- A "Reject this **Spend Request**?" confirm can be a `<dialog>` with `showModal()`, `method="dialog"`, and `body:has(dialog:modal) { overflow: hidden; }`.
- A one-off tooltip on a **Cash Buffer** hint can start as Popover API markup plus CSS, with a static fallback, rather than `tippy.js`.
- Keep React Aria `DateRangePicker` / `Popover` for the overview range control. Calendar grid, range selection, and `@internationalized/date` are the real use case; native `<dialog>` does not cover them.

Popover API became Newly available in January 2025. CSS anchor positioning became Newly available in January 2026. Public marketing should not depend on either without a CSS fallback. Do not add Popper, Floating UI, or `focus-trap` for a new overlay until those questions fail.

### Cherry-pick utilities; do not add Lodash

`structuredClone` is Widely available and is the default deep copy for plain workspace JSON. It does not clone functions, class instances, or DOM nodes.

`Object.groupBy` / `Map.groupBy` and `Set` union/intersection/difference were Newly available in 2024 and were on track to become Widely available in late 2026. They are acceptable in server-only modules today. In client components, feature-detect or keep a one-function helper rather than installing `lodash.groupby`.

Do not add `lodash`, `lodash.clonedeep`, or `lodash.debounce` by default. If a future typeahead truly needs debounce, add that one helper in `src/utilities` after searching for an existing one.

### Do not swap `date-fns` for Temporal yet

`Temporal` reached Stage 4 in March 2026 and is still Limited while Safari lacks a stable ship. The official polyfill is about 44 KB gzipped; a smaller one is about 19 KB. `date-fns` is about 3 KB gzipped for the calendar-day helpers CashLift actually imports (`parseISO`, `differenceInCalendarDays`).

A Temporal swap today would enlarge the bundle. Revisit when Safari ships Temporal and the feature is at least Newly available. Until then, keep `date-fns` for ISO **Vendor Bill** / **Cash Action** due windows, and keep `@internationalized/date` as the React Aria calendar adapter.

## Three questions before any swap

Use these before deleting a library or adding a native API. They are the article's decision framework, specialized to CashLift.

1. **Is the replacement Baseline-safe for this surface?** Match the table in the ADR. A Newly available API that is fine on `/dashboard` may be wrong on `/` or `/checkout`.
2. **What does the swap cost?** Measure gzipped size with Bundlephobia for a first look, then the real client chunk with the Next.js bundle analyzer. A polyfill larger than the current library is a failed swap unless it loads only after a feature check on the browsers that need it.
3. **Does the platform feature cover the real use case?** `fetch` is not axios interceptors. `structuredClone` is not a class-instance clone. `Intl.NumberFormat` compact notation is not CashLift's `$1.2M` suffix table. `showModal()` is not a range calendar. If the library is doing auth, Zod parsing, optimistic **Spend Request** updates, or company-scoped caching, the platform is not a replacement.

If any answer is no, keep the library and write the revisit date in the decision log.

## New and planned scripts

Apply this sequence to every new client script, npm dependency, or third-party snippet.

1. Search `src/` for an existing helper, UI primitive, or service adapter. Do not add a package that duplicates `formatCurrency`, `countCharacters`, or the workspace `fetch` wrappers.
2. Ask whether the work can stay in a Server Component. Protected workspace routes already load data on the server; client code should be the interactive leaf (`InteractiveApprovalQueue`, date-range picker, chart frame).
3. If the browser must run code, identify the platform API and record its Baseline status.
4. Choose Widely available APIs for public routes. On the Company Workspace, Newly available APIs need a feature check or a server-rendered fallback such as the overview date-range label that still renders when the picker chunk is absent.
5. Load heavy visualization and picker code with `next/dynamic` and `ssr: false`, following `LazyRechartsComponent.ts` and `OverviewDateRangePicker.tsx`. Charts still wait for a laid-out `ChartFrame` before executing Recharts.
6. Defer non-critical telemetry. `ClientTelemetry` already waits for `requestIdleCallback` before loading Analytics. New marketing pixels follow the same idle gate and the existing CSP nonce + `strict-dynamic` policy in `src/proxy.ts`.
7. Do not add a `script` tag, eval-based snippet, or CDN host that the Content-Security-Policy does not already allow.
8. Fill in the decision template below and append it to the decision log in the same change.

Planned work that often attracts unnecessary JavaScript in a cash product:

| Planned capability | Baseline-informed default | Do not add |
| --- | --- | --- |
| Relative due dates on **Vendor Bills** and **Cash Actions** | `Intl.RelativeTimeFormat` (Widely) plus a unit helper | `timeago.js` |
| Compact runway or **Vendor Leak** totals | Existing `formatPreciseCompactCurrency`, or `Intl.NumberFormat` only if product accepts compact notation | `numeral` |
| Confirm reject/approve in a modal | Native `<dialog>` + `:has(dialog:modal)` | `a11y-dialog`, `focus-trap`, `body-scroll-lock` |
| **13-week Cash Outlook** and spend-mix charts | Keep lazy `recharts`; no native chart API | Eager Recharts, Chart.js, D3 |
| Time-zone-safe calendar math | Keep `date-fns` / `@internationalized/date` until Temporal is Baseline | `@js-temporal/polyfill` |
| Client refetch and **Spend Request** mutations | Existing React Query + `fetch` + Zod | `axios`, a second client store for server data |
| Marketing motion | CSS, native View Transitions, or existing `LazyMotion` + `domAnimation` | Full `motion` import, extra animation libraries |
| Group **Spend Requests** by vendor | `Object.groupBy` on the server, or a small helper | `lodash.groupby` |

## Progressive enhancement, detection, and adoption timelines

### Progressive enhancement

Ship a usable server-rendered cash surface first. JavaScript adds the decision, not the numbers.

CashLift already follows this shape:

- **Spend Request** queues render as a read-only list in the public demo. Authenticated workspace hydrates `InteractiveApprovalQueue` for approve/reject. The amounts come from the server dataset either way.
- Overview date range shows a server `fallbackLabel`. The picker chunk loads only in the browser.
- **13-week Cash Outlook** charts stay empty on the server (`ChartFrame` snapshot is `false`) and execute Recharts after layout.
- Marketing FAQ and nav use React Aria disclosure, but the content is in the HTML. Do not gate invoice totals, **Cash Buffer** figures, or legal copy on a client bundle.

New UI should keep the same split: render the financial claim from current server input, then enhance with interaction.

### Feature detection versus polyfill loading

Detect the API. Do not download a polyfill for users who already have it, and do not download a 19–44 KB polyfill to avoid a 3 KB library.

```ts
if (typeof Intl.DurationFormat === "function") {
	return new Intl.DurationFormat("en", { style: "long" }).format(duration);
}

return fallbackLabel;
```

CashLift already uses this pattern for `requestIdleCallback` in `ClientTelemetry` and for `ResizeObserver` in `ChartFrame`. Copy that shape.

Rules:

- Widely available: call the API. No polyfill.
- Newly available on the workspace: feature-detect; fall back to the server label, a simpler `Intl` formatter, or no animation.
- Limited availability: keep the current library. Conditional polyfill only when the polyfill is smaller than the library _and_ it loads only on browsers that fail the check.
- Never enable Next.js default polyfills to unlock a Limited API. The empty module in `src/services/next/emptyPolyfillModule.ts` is intentional.
- Never polyfill on the server and ship that code to the client "just in case."

### Native API adoption timeline

| Now (Widely or already in CashLift) | Next (Newly; workspace + feature check) | Wait (Limited or polyfill too expensive) |
| --- | --- | --- |
| `Intl.NumberFormat`, `DateTimeFormat`, `RelativeTimeFormat`, `Segmenter` | `Intl.DurationFormat` | `Temporal` until Safari ships and Baseline updates |
| `fetch`, `AbortController`, `AbortSignal.timeout()` | Popover API on public pages only with CSS fallback | Any axios-sized HTTP client |
| `<dialog>.showModal()`, `structuredClone` | CSS anchor positioning | Lodash full package |
| CSS `:has()` for structural style | `Object.groupBy` / `Set` methods in client UI once Widely, or behind a check | Chart and auth libraries (no platform equivalent) |
| View Transitions for snapshot page/UI motion | | |

Revisit the Wait column when Baseline status changes, not when a conference talk ships. `Object.groupBy` crossing into Widely available is the next likely "just use it" event. Temporal is the next likely date-library event.

## Documentation framework

Every production JavaScript dependency or custom client script needs a decision record. Append records to [the decision log](/engineering/baseline-javascript-decision-log). Do not invent trends, savings claims, or "X% of users" figures. Cite Baseline status, the CashLift surface, and the measured or catalog size.

### Decision record template

Copy this block.

```md
### {package or script name}

- **Date:** YYYY-MM-DD
- **Surface:** marketing | public-demo | company-workspace | server-only
- **Owner path:** `src/...`
- **Need:** one sentence tied to a CashLift term (Spend Request, Vendor Bill, Cash Buffer, …)
- **Platform API considered:** {API or "none"}
- **Baseline status:** Limited | Newly available | Widely available | not a platform feature
- **Status URL:** https://webstatus.dev/features/{id} or MDN URL
- **Q1 Audience-safe?** yes / no — {surface vs ADR table}
- **Q2 Swap cost?** keep | drop | wait — {gzipped library size vs polyfill vs native}
- **Q3 Covers real use case?** yes / no — {gap: interceptors, calendar grid, compact suffix, auth, Zod, …}
- **Verdict:** ship native | keep library | feature-detect native | do not add
- **Revisit:** YYYY-MM or "none"
- **CSP / telemetry notes:** {nonce, connect-src, no Clerk user IDs, or "n/a"}
```

### Pull request checklist

Paste into the PR when the change adds or removes client JavaScript.

```md
- [ ] Searched `src/` for an existing helper or primitive
- [ ] Work stays in a Server Component unless this is an interactive leaf
- [ ] Platform API named, with Baseline status and URL
- [ ] Surface matches the ADR (Widely for public first paint; Newly allowed on workspace with fallback)
- [ ] No new polyfill, or the polyfill is conditional and smaller than the library it replaces
- [ ] No `localStorage` / `sessionStorage` tokens; no Clerk user IDs in telemetry
- [ ] CSP still nonce + `strict-dynamic`; no new script host without a proxy change
- [ ] Decision record appended to `docs/engineering/baseline-javascript-decision-log.md`
- [ ] Client bundle impact checked (`pnpm build` route analysis or source-map explorer)
```

### Feature-detection snippet checklist

- [ ] Detect the constructor or method (`typeof Intl.DurationFormat === "function"`, `"requestIdleCallback" in window`)
- [ ] True branch uses the platform API
- [ ] False branch uses a simpler formatter, server-rendered label, or existing small helper — not a dynamically imported 40 KB polyfill
- [ ] Server render stays deterministic; browser-only labels use `useSyncExternalStore` when time or layout affects the value

## Verification and optimization roadmap

Run this as a delivery process, not a one-off cleanup.

### 1. Inventory what ships

```bash
pnpm ls --prod --depth=0
```

Ignore devDependencies. Then list `"use client"` entry points and `next/dynamic` boundaries under `src/`. The current client leaves that matter for payload are workspace providers, **Spend Request** mutation UI, overview date-range picker, Recharts wrappers, marketing forms/nav, Clerk/Sentry/telemetry, and React Aria primitives.

### 2. Measure real chunks

Catalog size (Bundlephobia) is a screen. The Next.js production build's client/route analysis is the source of truth after tree-shaking. Record the chunk name and the owning route (`/`, `/demo/workspace`, `/dashboard`), not a global "we saved 60 KB" claim unless the build output shows it.

### 3. Set and keep Baseline targets

The ADR is the target. A later change may add an explicit `browserslist` of `baseline widely available` for shared code once a build comparison exists; do not flip that query in the same change as a feature. Playwright currently runs Chromium only. Expanding e2e to Firefox and WebKit is the browser-coverage follow-up that makes Newly available workspace APIs safer to adopt.

### 4. Cluster audit (repeat each quarter)

Walk the article clusters against `package.json` and the decision log:

1. Internationalization — keep `Intl`; reject formatting packages.
2. HTTP — keep feature `fetch` wrappers; reject axios.
3. UI primitives — native `<dialog>` / Popover for new simple overlays; keep React Aria for complex widgets.
4. Utilities — `structuredClone`, native grouping on the server; no Lodash.
5. Dates — keep `date-fns` until Temporal is Baseline.

Update each decision record's Baseline status and revisit date. Drop a library only when all three questions pass.

### 5. Guardrails in the development loop

| Gate | What it proves |
| --- | --- |
| Decision log entry | The three questions were asked in writing |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Behavior still matches financial contracts |
| `pnpm build` client analysis | The chunk did not silently grow |
| `pnpm test:e2e` | Public demo stays read-only; approve/reject still works when the client leaf loads |
| `pnpm security:audit` | Remaining libraries still get vulnerability review; Baseline does not replace `pnpm audit` |

### 6. Future-code constraints

- New `"use client"` files must be interactive leaves owned by a module, not new data shells.
- New browser APIs need a Baseline URL in the decision log.
- New animation prefers CSS or View Transitions before another motion import. If `motion` is required, keep `LazyMotion` + `domAnimation` as in the lead-capture success state.
- New overlays start native. Promote to React Aria only when keyboard, i18n, or range-selection requirements exceed `<dialog>` / Popover.
- New date logic stays in `date-fns` or `@internationalized/date` until the Temporal revisit date.
- New HTTP stays in the feature `api.ts` with Zod. No second client.

When the quarterly audit finds a Widely available replacement that covers the real use case, remove the library in a dedicated change with tests for the formatted money, due-window, or mutation behavior it used to own.
