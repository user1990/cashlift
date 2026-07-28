---
name: architecture
description: Module boundaries, import rules, path aliases, folder layout, and state-management choices for the monorepo. Trigger when creating modules/files, importing between modules, picking a path alias, setting up routing, or deciding where code belongs.
---

# Architecture

Flat module architecture for CashLift's Next.js app.

## Project Structure

```text
├── src/
│   ├── app/            # App Router: thin route wrappers, metadata, layouts, server orchestration
│   ├── modules/        # Business/product modules only
│   │   ├── workspace/
│   │   ├── money/
│   │   ├── spend-requests/
│   │   ├── invoices/
│   │   ├── vendors/
│   │   ├── subscriptions/
│   │   ├── budgets/
│   │   ├── cash-outlook/
│   │   ├── dashboard/
│   │   ├── marketing/
│   │   └── page-shell/
│   ├── ui/             # Generic design-system primitives
│   ├── services/       # Technical integrations and platform adapters
│   ├── utilities/      # Domain-agnostic helpers
│   └── test/           # Test setup and fixtures
└── public/             # Static assets
```

## Source Categories & Import Rules

These boundaries are enforced. Violating them causes circular dependencies, weakens module ownership, and makes refactoring painful.

### 1. App

Route files under `src/app/**` orchestrate modules and support layers.

- **Can import from**: `modules`, `ui`, `services`, `utilities`
- Keep route files thin: routing, metadata, auth/layout gates, server data loading, and composition.
- Route-private `_components` and `_lib` are allowed only for one-off page composition.

### 2. Business Modules

Business/product capabilities under `src/modules/*`.

- Own their local `components`, `hooks`, `api.ts`, `server.ts`, `schemas.ts`, `types.ts`, `utils.ts`, and `assets` when useful.
- Keep `components/` for React components and their colocated component tests only. Put module-wide hooks in `hooks/`, shared module models in `types.ts`, schemas in `schemas.ts`, and non-component helpers or configuration at the module root (or `utils.ts` when it is a utility).
- A nested feature directory is appropriate only when its files form one cohesive feature subtree. Within it, use the same categories (`components/`, `hooks/`, `types.ts`, `schemas.ts`, `utils.ts`) rather than placing hooks, types, or constants in `components/`.
- API/data code stays colocated with the module that owns the business concept.
- Business modules should not import other business modules by default. Compose multiple modules in `src/app`, or extract a shared business primitive into its own module such as `modules/money`.
- Current explicit composition modules, such as `workspace`, `dashboard`, and `page-shell`, may import the business modules they intentionally compose.
- Import types and utilities from their owning module. Do not recreate cross-module re-export barrels to shorten import paths.

### 3. UI

Generic design-system primitives under `src/ui`.

- **Can import from**: `ui`, `utilities`
- **Cannot import from**: `modules`, `services`, `app`

### 4. Services

Technical integrations and platform adapters under `src/services`.

- **Can import from**: `services`, `utilities`
- **Cannot import from**: `modules`, `ui`, `app`
- Third-party integrations (Sentry, Clerk, Supabase, etc.) live under `services` or `services/platform/integrations/*`.

### 5. Utilities

Domain-agnostic helpers under `src/utilities`.

- **Can import from**: `utilities`
- **Cannot import from**: `modules`, `ui`, `services`, `app`
- If a helper has CashLift business meaning, it belongs in a business module instead. Example: `MoneyCents` belongs in `modules/money`, not `utilities`.

## Quick Reference Table

| Source area | Can Import From |
| --- | --- |
| `app` | `modules`, `ui`, `services`, `utilities` |
| `modules/*` | `ui`, `services`, `utilities`, explicit business module dependencies |
| `ui` | `utilities` |
| `services` | `utilities` |
| `utilities` | nothing outside utilities |

## Path Aliases

Use the existing `@/*` alias from `tsconfig.json`.

```ts
import { Button } from "@/ui/components/Button";
import { formatCurrency } from "@/modules/money/format";
import { loadWorkspaceDataset } from "@/modules/workspace/server";
```

Do not add `@modules/*`, `@ui/*`, or similar aliases unless the app's `tsconfig.json` is updated first and the existing imports are migrated consistently.

## State Management

| Purpose | Tool |
| --- | --- |
| Server state | Server Components first; TanStack Query for client refetch/mutations |
| UI state | Zustand when local React state is not enough |
| Forms | React Hook Form + Zod |

Protected workspace routes default to server-first data loading. Client Components should be interactive leaves, not initial page data shells.

## General Rules

1. `src/modules/*` means business/product modules. Do not put generic support code there.
2. Shared business primitives become modules, for example `modules/money`.
3. Truly generic helpers live in `src/utilities`.
4. Generic UI primitives live in `src/ui`.
5. Business modules communicate through route-level composition or explicit, documented dependencies.
6. Prefer explicit file imports over broad module-root barrels.
7. When adding a business module or an explicit cross-module dependency, update `.fallowrc.json` in the same change with the narrowest zone and allowlist, then run `pnpm check:code`. Do not widen an allowlist to make an unrelated import pass.
