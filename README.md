# CashLift

CashLift is a B2B cash decision command center for service firms. It helps
teams approve spend, chase receivables, protect cash buffers, and prevent
financial leaks before money leaves the company.

The app loads company finance data through a server repository (Supabase with
Clerk-backed row-level security). Marketing and `/demo` stay public; `/app` and
`/api/workspace/dataset` are protected when running in production mode.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- React Aria Components for accessible UI primitives
- TanStack Query for client refetches against the workspace dataset API
- React Hook Form + Zod for demo, contact, signup, and spend request forms
- Recharts for dashboard visualizations
- next-intl for locale-ready copy
- Clerk and Supabase integration boundaries without committed credentials

Domain language and relationships live in [CONTEXT.md](./CONTEXT.md). ADRs for
demo vs workspace and Supabase RLS are under [docs/adr](./docs/adr/).

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm fallow
pnpm build
pnpm doctor
pnpm test:e2e
```

Install Playwright browsers once (Chromium is enough for the smoke suite):

```bash
pnpm test:e2e:install
```

## Environment

`CASHLIFT_APP_MODE` is `demo` or `production`. If unset, local development
defaults to **demo**; **CI** and **NODE_ENV=production** default to **production**
(fail closed when required variables are missing).

### Demo mode (`CASHLIFT_APP_MODE=demo`)

- `/app` and `/api/workspace/dataset` serve the demo company dataset (no Clerk
  session required for `/app`).
- Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Optional: `SUPABASE_DEMO_COMPANY_ID` (defaults to `studio-nova` in code when
  unset).

### Production mode (`CASHLIFT_APP_MODE=production`)

- `/app` and `/api/workspace/dataset` require Clerk sign-in and a Supabase JWT
  from the Clerk **`supabase`** JWT template.
- Required:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

`SUPABASE_DEMO_COMPANY_ID` is only read in **demo** mode.

### Supabase dashboard setup

Use the Supabase project dashboard values from **Project Settings → API Keys**:

- Copy **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
- Copy the **Publishable key** into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Do not use the database password in the frontend app env.

Then check **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000` for local development.
- Redirect URLs: add `http://localhost:3000/**`.

Apply row-level security policies so authenticated users only read their
company’s rows (see `supabase/production-rls-policies.sql`). Enable RLS before
exposing tables to the Data API.

No real credentials should be committed.
