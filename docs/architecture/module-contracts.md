---
title: Module contracts
description: Ownership, public seams, dependency direction, and current architectural pressure points.
---

CashLift uses flat business modules and explicit composition modules. Route files orchestrate modules; they do not own business behavior.

## Main modules

| Area | Owns | Public seams | Dependency rule |
| --- | --- | --- | --- |
| `workspace` | Dataset aggregate, read orchestration, scoped loading, spend-decision orchestration | `schemas.ts`, `types.ts`, `server.ts`, `query.ts` | May compose financial modules and platform services |
| `dashboard` | Overview view model and dashboard-specific UI | `view-model.ts`, `types.ts`, overview components | May consume pure financial utilities and workspace data |
| `page-shell` | Workspace navigation, route-level sections, loading states, and experience composition | `WorkspacePage`, `WorkspacePageContent`, `types.ts` | May compose dashboard and section modules; must not become a business-rules module |
| Financial modules | One financial concept, its schema, types, calculations, and focused UI | Each module's `schemas.ts`, `types.ts`, and pure utilities | May depend on `money`; avoid peer-module imports unless explicitly allowed |
| `marketing` | Public product and checkout surfaces | Page components and typed content | May use generic UI and the public workspace shell where documented |
| `services` | Clerk, Supabase, Sentry, i18n, and query adapters | Narrow provider and adapter functions | Must not import business modules |
| `ui` and `utilities` | Generic visual and domain-agnostic primitives | Explicit file exports | Must not depend on business modules |

Fallow's configured checks cover duplicate code and dead code through `pnpm check:code`; run the full Fallow analysis when changing imports or module ownership to verify dependency directions and circular dependencies against `.fallowrc.json`.

## Interface rules

- Parse HTTP, environment, fixture, and persistence data before it enters a trusted model.
- Keep route handlers as transport adapters over module results.
- Pass leaf components only the values they render; keep the full `FinancialDataset` at workspace, dashboard, and page-shell composition seams.
- Import explicit files instead of adding module barrels.
- Keep cross-module calculations in the module that owns the business term.

## Current pressure points

- `FinancialDataset` is a useful read aggregate but creates broad fan-out. Add scope-specific view models before adding another consumer of the full aggregate.
- `FinanceRepository` currently carries access-token and company identifiers in method signatures. Treat that as an infrastructure seam and do not expose it to UI modules; a future repository split should separate authenticated reads from spend mutations.
- `dashboard` and `page-shell` are intentionally broad composition modules. New business rules belong in the owning financial module so these modules do not become dependency hubs.
- Supabase row types improve mapper ergonomics, but runtime schemas remain the source of truth because the client is not generated from the database schema.
