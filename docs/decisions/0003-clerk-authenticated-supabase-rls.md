---
title: Clerk-authenticated Supabase RLS
description: Enforce company-scoped access through the server repository and Supabase RLS.
---

# 0003: Clerk-authenticated Supabase RLS

- Status: accepted
- Date: 2026-07-18

## Context

Workspace reads need company-scoped authorization across the application server
and Supabase. A service-role read would make a route bug more likely to expose
data across companies, while browser-side table access would bypass the intended
server boundary.

## Decision

Route workspace reads through the server finance repository using a Clerk
session JWT and Supabase publishable key, with Supabase row-level security
enforcing company scope. Do not use service-role reads for the workspace path.

## Consequences

- Browser code never queries finance tables directly.
- Supabase policies map Clerk `sub` to `company_members.clerk_user_id`.
- Supabase Third-Party Auth trusts the matching Clerk instance domain.
- Server code uses Clerk’s standard session JWT rather than the deprecated
  Supabase JWT template.
- Authorization failures remain part of the server-boundary contract and must
  be tested there.

## Revisit if

Reopen this decision when the identity provider, Supabase trust model, or
company-scoping model changes, or when a formally reviewed access pattern offers
equivalent isolation with a smaller exposure blast radius.
