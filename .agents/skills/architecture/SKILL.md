---
name: architecture
description: Module boundaries, import rules, path aliases, folder layout, and state-management choices for the monorepo. Trigger when creating modules/files, importing between modules, picking a path alias, setting up routing, or deciding where code belongs.
---

# Architecture

Module-oriented architecture for web apps (Next.js)

## Project Structure (Web)

```
├── src/
│   ├── app/            # App Router
│   ├── modules/
│   │   ├── base/       # Empowers feature modules (user, vehicles, etc.)
│   │   ├── features/   # Domain-specific business logic
│   │   ├── ui/         # Design system implementation
│   │   ├── common/     # Generic utilities, types, constants
│   │   └── shared/     # Reusable composites wrapping ui/common/services
│   ├── services/       # Browser/Node integrations
│   └── types/          # App-wide types (discouraged, prefer module types)
├── public/             # Static assets
└── styles/             # Global styles (legacy SCSS)
```

## Module Types & Import Rules

These boundaries are enforced and non-negotiable. Violating them causes circular dependencies, breaks encapsulation, and makes refactoring painful.

### 1. UI

Design system components, animations, layouts.

- **Cannot import from**: any other modules

### 2. Common

Generic utilities, common types, constants.

- **Cannot import from**: any other modules

### 3. Services

Browser/Node integrations and technical foundation.

- **Can import from**: `ui`, `common`
- **Cannot import from**: `feature`, `base`, `shared`
- **Platform submodule**: must not import from any other module (including `ui`/`common`)
- 3rd-party integrations (Klaviyo, PostHog, Firebase, etc.) must be wrapped in `services/platform/integrations/*`

### 4. Shared

Reusable composites wrapping `ui`, `common`, and `services`.

- **Can only import from**: `ui`, `common`, `services`

### 5. Base

Modules that empower feature modules (core data like user, vehicles).

- **Cannot import from**: feature modules
- **Can import from**: `shared`, `ui`, `common`, `services`

### 6. Feature

Standalone modules for domain-specific business logic.

- **Cannot import from**: other feature modules
- Prefer explicit file imports (hooks/components/api/types), not module-root barrels

### Quick Reference Table

| Module Type  | Can Import From                              |
| ------------ | -------------------------------------------- |
| **UI**       | Nothing (standalone)                         |
| **Common**   | Nothing (standalone)                         |
| **Services** | `ui`, `common` (platform submodule: nothing) |
| **Shared**   | `ui`, `common`, `services`                   |
| **Base**     | `shared`, `ui`, `common`, `services`         |
| **Feature**  | `base`, `shared`, `ui`, `common`, `services` |

## Path Aliases

**Check the local `tsconfig.json` before writing an import** — alias configuration is per-app, not uniform across the monorepo.

Most apps (e.g. `web-app`) rely on `"baseUrl": "src"` and import from `modules/...` directly:

```ts
import { useAuthSession } from 'modules/auth/hooks/useAuthSession';
import Page from 'modules/page-shell/components/Page';
```

Some apps configure an `@/*` alias to the app root (e.g. `apps/affiliate`, `apps/signature-generator`):

```json
{ "paths": { "@/*": ["./*"] } }
```

The `@base/*`, `@features/*`, `@ui/*`, `@common/*`, `@shared/*`, `@services/*` aliases are the **target** convention for new setups but are **not configured in existing apps today**. When adding them, update the app's `tsconfig.json` first. Match whatever style the rest of the app uses; do not mix.

## State Management

| Purpose      | Tool                         |
| ------------ | ---------------------------- |
| Server state | TanStack Query (React Query) |
| UI state     | Zustand                      |
| Forms        | React Hook Form + Zod        |

Expose state from base modules via explicit hook files (for example `hooks/useUser.ts`).

## Routing

- **All pages**: Next.js App Router (`src/app`)

## General Rules

1. App-wide types belong in specific submodules within `modules/common` (e.g., `modules/common/money` for a `Money` type)
2. State from base modules is available via hooks imported from explicit files
3. Feature modules communicate at the route level via props or route params — never import across features
4. All UI elements come from `modules/ui`, composed in `modules/shared` when needed

## Example: Vehicle Info Screen

This shows how route-level pages orchestrate feature and base modules without cross-feature imports:

```tsx
// src/app/vehicles/[vin]/page.tsx
import { VehicleCard } from '@base/vehicles/components/VehicleCard';
import { useInsuranceStatus } from '@features/insurance/hooks/useInsuranceStatus';
import { useMotStatus } from '@features/mot/hooks/useMotStatus';
import type { ServiceStatus } from '@shared/types/service-status';
import { StatusCard } from '@shared/status/components/StatusCard';

export default function VehicleInfoPage({ params }: { params: { vin: string } }) {
  const motStatus: ServiceStatus = useMotStatus(params.vin);
  const insuranceStatus: ServiceStatus = useInsuranceStatus(params.vin);

  return (
    <VehicleCard vin={params.vin}>
      <StatusCard type="insurance" status={insuranceStatus} />

      <StatusCard type="mot" status={motStatus} />
    </VehicleCard>
  );
}
```
