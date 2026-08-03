---
title: Workspace incident runbook
description: Diagnose workspace read and spend-decision failures without exposing sensitive data.
---

Use this runbook when `/dashboard`, `/api/workspace/dataset`, or spend approvals fail in production.

## Classify the failure

| HTTP or UI state | Likely boundary | First check |
| --- | --- | --- |
| 401 / sign-in required | Clerk session | Confirm the request has a valid authenticated session |
| 403 / no company workspace | Membership or authorization | Confirm `company_members` contains the user and expected role |
| 400 / invalid request | Route validation | Inspect scope, date range, request ID, and decision status |
| 503 / configuration or token unavailable | Environment or Clerk token service | Confirm required environment values and Clerk-Supabase integration |
| 500 / workspace data unavailable | Supabase read or mutation | Use the response request ID to locate the Sentry event |

## Sentry lookup

Workspace reads use the `workspace-dataset` feature tag. Spend mutations use `spend-request-decision`. Narrow by `failureKind`, then use the returned request ID when one is shown.

Safe diagnostic context includes table name, Supabase error code, feature, failure kind, and correlation/request ID. Do not attach access tokens, Clerk user IDs, financial row contents, or other personal data.

## Recovery checks

1. Reproduce the failing route with the same app mode and workspace scope.
2. Verify authentication and membership before querying financial tables.
3. Confirm Supabase RLS still scopes reads and writes to the authenticated company.
4. For spend decisions, verify both `company_id` and request `id` filters are present and the caller has an allowed role.
5. Run the smallest contract test, then the complete unit suite and security checks.

```bash
pnpm test src/app/api/workspace/dataset/route.test.ts
pnpm test 'src/app/api/workspace/spend-requests/[id]/route.test.ts'
pnpm test src/modules/workspace/repositories/supabase.test.ts
pnpm test
pnpm security:check
```

Escalate when the failure crosses authentication, RLS, company isolation, or financial mutation boundaries. Preserve the Sentry request ID and sanitized error code in the handoff.
