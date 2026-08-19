---
title: Baseline JavaScript decision log
description: Living records for production JavaScript dependencies and native API adoptions.
---

Append a record from the [Baseline JavaScript](/engineering/baseline-javascript) template whenever a production dependency, client script, or native API swap is proposed. Do not invent traffic shares or bundle savings; cite Baseline URLs and build output.

## Current production inventory

### date-fns

- **Date:** 2026-08-19
- **Surface:** server-only today (`dueWithinWindow`, ISO parse in cash-action and outflow helpers)
- **Owner path:** `src/utilities/dates/dueWithinWindow.ts`
- **Need:** Calendar-day distance for **Vendor Bill** and **Cash Action** due windows from ISO dates
- **Platform API considered:** `Temporal.PlainDate`
- **Baseline status:** Limited availability
- **Status URL:** https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Temporal
- **Q1 Audience-safe?** no — Safari has no stable Temporal
- **Q2 Swap cost?** wait — `@js-temporal/polyfill` is tens of KB gzipped versus a few KB of `date-fns` usage
- **Q3 Covers real use case?** yes — Temporal would cover calendar dates, but Q1 and Q2 fail
- **Verdict:** keep library
- **Revisit:** after Safari ships Temporal and Baseline is at least Newly available
- **CSP / telemetry notes:** n/a

### @internationalized/date

- **Date:** 2026-08-19
- **Surface:** company-workspace (overview date-range picker)
- **Owner path:** `src/modules/dashboard/components/OverviewDateRangePickerClient.tsx`
- **Need:** Parse ISO range bounds for the React Aria `DateRangePicker`
- **Platform API considered:** `Temporal` / native `Date`
- **Baseline status:** Limited (`Temporal`); `Date` does not match the calendar-date model React Aria expects
- **Status URL:** https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Temporal
- **Q1 Audience-safe?** no for Temporal
- **Q2 Swap cost?** wait
- **Q3 Covers real use case?** no — native `Date` is not a drop-in for `@internationalized/date` calendar values
- **Verdict:** keep library
- **Revisit:** with the Temporal revisit
- **CSP / telemetry notes:** picker is `next/dynamic` + `ssr: false`; server still renders `fallbackLabel`

### fetch wrappers (no axios)

- **Date:** 2026-08-19
- **Surface:** company-workspace
- **Owner path:** `src/modules/workspace/query.ts`, `src/modules/spend-requests/api.ts`
- **Need:** Load workspace datasets and submit **Spend Request** decisions
- **Platform API considered:** `fetch` + `AbortController`
- **Baseline status:** Widely available
- **Status URL:** https://developer.mozilla.org/docs/Web/API/Fetch_API
- **Q1 Audience-safe?** yes
- **Q2 Swap cost?** keep — already native; adding axios would add ~17 KB gzipped
- **Q3 Covers real use case?** yes, with local `response.ok` + Zod parsing as the interceptor equivalent
- **Verdict:** ship native
- **Revisit:** none
- **CSP / telemetry notes:** same-origin `/api/workspace/**` only; no finance-table access from the browser

### Intl.NumberFormat (modules/money)

- **Date:** 2026-08-19
- **Surface:** marketing | public-demo | company-workspace
- **Owner path:** `src/modules/money/format.ts`
- **Need:** Display **MoneyCents** as USD without fabricating precision
- **Platform API considered:** `Intl.NumberFormat`
- **Baseline status:** Widely available
- **Status URL:** https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- **Q1 Audience-safe?** yes
- **Q2 Swap cost?** keep native — do not add `numeral`
- **Q3 Covers real use case?** yes for `formatCurrency`; compact `$1.2M` suffixes stay custom in `formatPreciseCompactCurrency` until product accepts `notation: "compact"`
- **Verdict:** ship native
- **Revisit:** if product wants compact notation
- **CSP / telemetry notes:** n/a

### Intl.Segmenter (countCharacters)

- **Date:** 2026-08-19
- **Surface:** forms (server or client)
- **Owner path:** `src/utilities/text/countCharacters.ts`
- **Need:** Count user-visible characters for input limits
- **Platform API considered:** `Intl.Segmenter`
- **Baseline status:** Widely available
- **Status URL:** https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
- **Q1 Audience-safe?** yes
- **Q2 Swap cost?** keep native
- **Q3 Covers real use case?** yes — `.length` is the wrong model
- **Verdict:** ship native
- **Revisit:** none
- **CSP / telemetry notes:** n/a

### react-aria-components

- **Date:** 2026-08-19
- **Surface:** marketing | public-demo | company-workspace
- **Owner path:** `src/ui/components/**`, date-range picker, marketing disclosure/nav
- **Need:** Accessible buttons, fields, disclosures, and a range calendar
- **Platform API considered:** `<dialog>`, Popover API, CSS anchor positioning
- **Baseline status:** `<dialog>` Widely; Popover Newly (2025-01); anchor positioning Newly (2026-01)
- **Status URL:** https://developer.mozilla.org/docs/Web/HTML/Element/dialog
- **Q1 Audience-safe?** native overlays are safe for simple confirms; calendar widgets are not
- **Q2 Swap cost?** keep library for complex widgets; native for new simple confirms
- **Q3 Covers real use case?** no for `DateRangePicker`; yes for a future reject-confirm dialog
- **Verdict:** keep library
- **Revisit:** when adding a simple modal, try `<dialog>` first
- **CSP / telemetry notes:** n/a

### recharts (lazy)

- **Date:** 2026-08-19
- **Surface:** company-workspace | public-demo
- **Owner path:** `src/modules/dashboard/components/LazyRechartsComponent.ts`
- **Need:** Draw the **13-week Cash Outlook** and spend-mix series from current dataset values
- **Platform API considered:** none
- **Baseline status:** not a platform feature
- **Status URL:** n/a
- **Q1 Audience-safe?** n/a
- **Q2 Swap cost?** keep — load with `next/dynamic` and `ChartFrame` so the chunk does not run until layout
- **Q3 Covers real use case?** no native replacement
- **Verdict:** keep library
- **Revisit:** none unless a lighter chart primitive is introduced with equal accessible summaries
- **CSP / telemetry notes:** `ssr: false`; summaries remain in HTML tables beside charts

### @tanstack/react-query

- **Date:** 2026-08-19
- **Surface:** company-workspace
- **Owner path:** `src/modules/workspace/query.ts`, `src/modules/spend-requests/components/InteractiveApprovalQueue.tsx`
- **Need:** Hydrate server datasets, refetch on date range, optimistic **Spend Request** decisions with rollback
- **Platform API considered:** `fetch` alone
- **Baseline status:** `fetch` Widely; cache/optimism is not a platform feature
- **Status URL:** https://developer.mozilla.org/docs/Web/API/Fetch_API
- **Q1 Audience-safe?** yes
- **Q2 Swap cost?** keep React Query — `fetch` does not replace cache keys, snapshots, or pending-control locking
- **Q3 Covers real use case?** no
- **Verdict:** keep library
- **Revisit:** none
- **CSP / telemetry notes:** n/a

### next-intl

- **Date:** 2026-08-19
- **Surface:** all
- **Owner path:** `src/services/i18n/request.ts`
- **Need:** Message catalogs and request locale, not number formatting
- **Platform API considered:** `Intl.*` (formatting only)
- **Baseline status:** `Intl` Widely; catalogs are not a platform feature
- **Status URL:** https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl
- **Q1 Audience-safe?** yes
- **Q2 Swap cost?** keep next-intl; use `Intl` for money/dates
- **Q3 Covers real use case?** no — `Intl` does not load translated UI strings
- **Verdict:** keep library
- **Revisit:** none
- **CSP / telemetry notes:** n/a

### Clerk, Supabase, Sentry, Vercel Analytics / Speed Insights

- **Date:** 2026-08-19
- **Surface:** auth, data, observability
- **Owner path:** `src/services/clerk/**`, `src/services/supabase/**`, `src/instrumentation-client.ts`, `src/app/ClientTelemetry.tsx`
- **Need:** Company Member session, company-scoped data, failure reporting, delivery metrics
- **Platform API considered:** none
- **Baseline status:** not a platform feature
- **Status URL:** n/a
- **Q1 Audience-safe?** n/a
- **Q2 Swap cost?** keep; Analytics already waits for `requestIdleCallback`
- **Q3 Covers real use case?** no
- **Verdict:** keep library
- **Revisit:** none
- **CSP / telemetry notes:** nonce + `strict-dynamic`; `connect-src` allowlists Clerk, Supabase, Sentry, Vercel insights; no Clerk user IDs in telemetry

### Next.js default polyfill module (emptied)

- **Date:** 2026-08-19
- **Surface:** all
- **Owner path:** `src/services/next/emptyPolyfillModule.ts`, `next.config.ts`
- **Need:** Avoid shipping Next.js default client polyfills CashLift's Baseline targets do not require
- **Platform API considered:** engines already in the ADR table
- **Baseline status:** Widely available APIs do not need this polyfill bundle
- **Status URL:** n/a
- **Q1 Audience-safe?** yes for the ADR audiences
- **Q2 Swap cost?** keep the empty alias — re-enabling the polyfill would add payload for no product gain
- **Q3 Covers real use case?** n/a
- **Verdict:** keep native (empty module)
- **Revisit:** only if a documented Limited API must run without a dedicated, smaller, conditional polyfill
- **CSP / telemetry notes:** n/a

## Rejected by default

Do not add these without a new decision record that beats the three questions:

- `axios`, `superagent`
- `numeral`, `timeago.js`, `pluralize`, `humanize-duration`
- `lodash`, `lodash.clonedeep`, `lodash.groupby`
- `tippy.js`, `focus-trap`, `body-scroll-lock`, Popper / Floating UI for simple overlays
- `@js-temporal/polyfill`, `core-js`, re-enabled Next.js polyfills
- `dayjs` (would duplicate `date-fns`)
