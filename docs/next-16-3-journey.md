# CashLift Next.js 16.3 Feature Journey

This is an experiment branch for the Next.js 16.3 preview. The dashboard routes are the playground because they have a persistent workspace shell, repeated sidebar links, and server-rendered workspace data.

| Feature | CashLift route tested | Before | After | Keep? | Why |
| --- | --- | --- | --- | --- | --- |
| Instant Navigations | `/dashboard/approvals` | Clicks waited on the next server-rendered page before useful UI appeared. | The approvals shell and section title render immediately, then data fills in. | Yes | User-perceived speed improves on a high-frequency finance workflow. |
| Partial Prefetching | Sidebar routes | Sidebar links could repeat route prefetch work for full route payloads. | `partialPrefetching` lets reusable route shells be prefetched and reused. | Yes | Lower prefetch waste while keeping workspace navigation quick. |
| Selective Deep Prefetch | `/dashboard`, `/dashboard/approvals`, `/dashboard/vendors` | Every link had the same prefetch behavior. | Only overview, approvals, and vendors opt into full `prefetch={true}`. | Yes | The most-used routes feel faster without increasing work everywhere. |
| Cache Components | Demo workspace data | Stable demo data was reduced on every route render. | Demo-only workspace data uses `"use cache"`; user-specific Supabase reads and approval mutations stay uncached. | Yes | Safer performance win without risking mutated approval correctness. |
| Route Shells | `/dashboard`, `/dashboard/approvals`, `/dashboard/vendors` | Loading UI could be absent or too generic. | Route-level `loading.tsx` files show CashLift section-aware shells. | Yes | Instant navigation has meaningful first paint, not just a blank transition. |
| Blocking Routes | `/login`, `/signup`, `/checkout` | Runtime/auth/query work conflicted with Cache Components prerendering. | Auth and checkout routes are marked `instant = false`; auth pages have Suspense fallbacks. | Yes | Keeps correctness for pages that depend on runtime state. |
| `instant()` tests | e2e dashboard nav | Navigation shell regressions were manual to catch. | Focused Playwright checks assert approvals and vendors shells appear immediately. | Yes | Fast navigation becomes a protected product quality. |
| DevTools MCP | local dev | Agents depended on full builds and manual browser checks. | Next DevTools MCP config is present for route/compile/browser diagnostics. | Yes | Faster iteration while keeping first-party agent tools explicit-invocation-only. |

## Trial Notes

- Keep this preview-only until Next.js 16.3 stabilizes.
- Test Instant Insights in Chrome or Firefox; the preview notes Safari limitations.
- Keep caching to demo/read-only data until user-specific Supabase and approval mutation correctness is reviewed.
- First-party Next skills and agent-browser should remain explicit-invocation-only for this repo.
