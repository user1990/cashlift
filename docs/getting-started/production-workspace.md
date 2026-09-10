---
title: Configure a production workspace
description: Configure Clerk and Supabase for authenticated company data.
---

Production mode is fail-closed. Set `CASHLIFT_APP_MODE=production` and provide all required credentials:

```dotenv
CASHLIFT_APP_MODE=production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The runtime refuses demo mode in a production deployment and reports unavailable workspace data when these values are absent.

## Clerk and Supabase

Configure Clerk's Supabase integration for the same Clerk instance used by the deployment. In Supabase Third-Party Auth, trust that Clerk domain. A signed-in Clerk user must also have a matching `company_members.clerk_user_id` record for company-scoped data to load.

Do not expose service-role credentials or database passwords to the browser. Workspace reads use the Clerk session JWT with Supabase row-level security.

## Authenticated browser verification

The repository's production browser checks cover the unauthenticated boundary. A complete approval check needs a dedicated Clerk test user, a matching `company_members` row, and a resettable test Supabase database. With those in place, verify that a finance user approves the seeded `request-brandforge` request, reloads the workspace, and still sees `approved`; then verify an employee receives `403` and a user from another company cannot change the request. Keep these credentials and records outside the repository.

For the underlying data-access decision, see [Clerk-authenticated Supabase RLS](/decisions/0003-clerk-authenticated-supabase-rls).
