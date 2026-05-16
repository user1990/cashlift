<p align="center">
  <img src="./src/app/logo.svg" width="110" alt="CashLift Logo" />
</p>

<h1 align="center">CashLift</h1>

<p align="center">
  Cash decision command center for service firms.
</p>

<p align="center">
  Approve spend. Recover receivables. Protect runway.
</p>

<p align="center">
  <a href="#why-cashlift">Why CashLift</a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#architecture">Architecture</a>
  ·
  <a href="#getting-started">Getting Started</a>
  ·
  <a href="#security">Security</a>
  ·
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-App%20Router-black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-blue">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-RLS-green">
  <img alt="Clerk" src="https://img.shields.io/badge/Auth-Clerk-purple">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-lightgrey">
</p>

---

<p align="center">
  <img src="./src/app/dashboard.png" width="100%" alt="CashLift Dashboard" />
</p>

---

# Why CashLift

Most finance tooling explains what already happened.

CashLift helps operators control cash before damage happens.

Built for agencies, consultancies, studios, and service businesses that need:

- spend governance
- receivable visibility
- operational cash control
- approval accountability
- liquidity awareness
- fewer spreadsheet workflows

CashLift combines workflow controls, finance visibility, and workspace-level
security into a single operational system.

---

# Features

## Financial Operations

- Spend approval workflows
- Receivables tracking
- Cash buffer monitoring
- Financial leak detection
- Workspace-scoped finance views
- Operational finance dashboards

## Platform

- Public marketing + demo experience
- Protected production workspace
- Clerk authentication boundaries
- Supabase row-level security
- Locale-ready architecture
- Accessible UI primitives

## Developer Experience

- TypeScript strict mode
- Next.js App Router
- E2E smoke coverage
- Architecture decision records
- CI-safe production defaults
- Boundary validation tooling

---

# Screenshots

## Executive Dashboard

<p align="center">
  <img src="./docs/screenshots/dashboard.png" width="100%" alt="Executive Dashboard" />
</p>

## Spend Approval Flow

<p align="center">
  <img src="./docs/screenshots/approvals.png" width="100%" alt="Spend Approval Flow" />
</p>

## Receivables Workspace

<p align="center">
  <img src="./docs/screenshots/receivables.png" width="100%" alt="Receivables Workspace" />
</p>

---

# Architecture

```text
                         ┌─────────────────────┐
                         │     Marketing       │
                         │    Public Routes    │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │      Demo Mode      │
                         │ Shared Demo Dataset │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────▼──────────────────┐
                 │       Production Workspace          │
                 │                                     │
                 │  Clerk Authentication               │
                 │  Supabase JWT Verification          │
                 │  Row-Level Security Enforcement     │
                 │  Workspace Data Isolation           │
                 └─────────────────────────────────────┘
```

---

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | React Aria Components |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Internationalization | next-intl |
| Authentication | Clerk |
| Database | Supabase |
| Security | Supabase RLS |

---

# Project Structure

```text
app/                        Next.js routes
components/                 Shared UI components
features/                   Domain feature modules
lib/                        Shared infrastructure
hooks/                      Shared hooks
providers/                  App providers
supabase/                   SQL + RLS policies
docs/adr/                   Architecture decisions
public/                     Static assets
tests/                      Automated tests
```

---

# Getting Started

## Install Dependencies

```bash
pnpm install
```

## Start Development Server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

# Quality Checks

## Lint

```bash
pnpm lint
```

## Type Safety

```bash
pnpm typecheck
```

## Unit Tests

```bash
pnpm test
```

## Architecture Validation

```bash
pnpm fallow
```

## Production Build

```bash
pnpm build
```

## Diagnostics

```bash
pnpm doctor
```

## End-to-End Tests

```bash
pnpm test:e2e
```

Install Playwright browsers once:

```bash
pnpm test:e2e:install
```

---

# Environment Modes

`CASHLIFT_APP_MODE` supports:

- `demo`
- `production`

If unset:

- local development defaults to `demo`
- CI defaults to `production`
- production builds fail closed

---

## Mode Comparison

| Mode | Auth | Dataset | Intended Use |
|---|---|---|---|
| Demo | Optional | Shared demo company | Product walkthroughs |
| Production | Required | Workspace-scoped | Real operations |

---

## Demo Mode

```bash
CASHLIFT_APP_MODE=demo
```

### Behavior

- `/app` serves demo company data
- `/api/workspace/dataset` uses shared dataset
- authentication optional

### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

### Optional

```env
SUPABASE_DEMO_COMPANY_ID=
```

---

## Production Mode

```bash
CASHLIFT_APP_MODE=production
```

### Behavior

- authenticated workspace access required
- Supabase JWT validation enabled
- row-level security enforced

### Required Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

---

# Supabase Setup

## API Configuration

Use values from:

```text
Project Settings → API Keys
```

| Supabase Value | Environment Variable |
|---|---|
| Project URL | NEXT_PUBLIC_SUPABASE_URL |
| Publishable Key | NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY |

Never expose:

- database passwords
- service role keys
- production secrets

---

## Authentication Configuration

```text
Authentication → URL Configuration
```

### Site URL

```text
http://localhost:3000
```

### Redirect URLs

```text
http://localhost:3000/**
```

---

## Row-Level Security

Apply policies from:

```text
supabase/production-rls-policies.sql
```

Production assumes:

- RLS enabled
- authenticated JWT verification active
- workspace isolation enforced

---

# Security

CashLift follows a fail-closed production model.

## Protections

- Clerk authentication
- Supabase JWT validation
- Workspace-level row isolation
- Protected production APIs
- Environment variable enforcement
- No committed credentials

## Security Boundaries

| Area | Protection |
|---|---|
| Authentication | Clerk |
| Authorization | Supabase RLS |
| Workspace Isolation | Company-scoped policies |
| APIs | Protected in production |
| Secrets | Environment variables only |

---

# ADRs

Architecture decisions live under:

```text
docs/adr/
```

Includes:

- demo vs production separation
- Supabase RLS strategy
- auth boundary decisions
- dataset architecture decisions

---

# Roadmap

## Platform

- [ ] Multi-workspace support
- [ ] Audit timelines
- [ ] Approval escalation chains
- [ ] Role-based permissions
- [ ] Activity feeds

## Finance Intelligence

- [ ] Cash forecasting engine
- [ ] Vendor exposure analytics
- [ ] Aging receivable automation
- [ ] Payment anomaly detection
- [ ] Liquidity trend analysis

## Integrations

- [ ] Slack approvals
- [ ] QuickBooks sync
- [ ] Stripe reconciliation
- [ ] Banking integrations
- [ ] Webhook platform

---

# Contributing

```bash
git clone <repo>
pnpm install
pnpm dev
```

Before opening PRs:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

---

# License

MIT
