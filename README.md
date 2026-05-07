# CashLift

CashLift is a personal finance command center focused on increasing cash,
finding financial leaks, and making better daily money decisions.

The scaffold uses mocked financial data behind repository interfaces so the UI,
domain models, and calculations work immediately while staying ready for Clerk
auth and Supabase persistence.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- React Aria Components for accessible UI primitives
- TanStack Query for server/repository data
- React Hook Form + Zod for manual financial entry
- Recharts for dashboard visualizations
- next-intl for locale-ready copy
- Clerk and Supabase integration boundaries without committed credentials

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
```

## Environment

The app runs without environment variables in demo mode. Add these when wiring
real services:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

No real credentials should be committed.
