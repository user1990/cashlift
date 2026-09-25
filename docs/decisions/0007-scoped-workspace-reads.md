---
title: Scoped workspace reads over monolithic datasets
description: Prefer server-side scoped Supabase selects and DTOs instead of loading full company tables per request.
---

# 0007: Scoped workspace reads over monolithic datasets

- Status: accepted
- Date: 2026-09-25

## Context

Workspace handlers currently load all company-scoped rows for a view, then filter in memory. That is simple for demo and early product work but does not scale with tenant size.

## Decision

- New workspace reads should push scope and date filters into Supabase queries.
- API responses should return the smallest dataset a view needs rather than always hydrating the full `FinancialDataset`.
- Unversioned `/api/workspace/**` routes remain deprecated shims over `/api/v1/**`.

## Consequences

- Repositories gain per-scope query helpers; read-models shrink over time.
- Breaking changes to client contracts require OpenAPI and ADR updates.
