# Clerk-authenticated Supabase RLS via server repository

Status: accepted

Workspace reads go through the server finance repository using a Clerk Supabase JWT and Supabase publishable key, with row-level security enforcing company scope. We rejected service-role reads for the workspace path because a route bug would have a larger cross-company data exposure blast radius.

## Consequences

- Browser code never queries finance tables directly.
- Supabase policies must map Clerk `sub` to `company_members.clerk_user_id`.
- Server code must request a Clerk JWT template named `supabase`.
