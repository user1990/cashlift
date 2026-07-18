---
title: Clerk-authenticated Supabase RLS
description: Enforce company-scoped access through the server repository and Supabase RLS.
---

Status: accepted

Workspace reads go through the server finance repository using a Clerk session JWT and Supabase publishable key, with row-level security enforcing company scope. We rejected service-role reads for the workspace path because a route bug would have a larger cross-company data exposure blast radius.

## Consequences

- Browser code never queries finance tables directly.
- Supabase policies must map Clerk `sub` to `company_members.clerk_user_id`.
- Supabase Third-Party Auth must trust the matching Clerk instance domain.
- Server code uses Clerk's standard session JWT; it does not use the deprecated Supabase JWT template.
