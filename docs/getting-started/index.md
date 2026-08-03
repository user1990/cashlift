---
title: Getting started
description: Start the application in its safe local demo mode.
---

CashLift requires Node 24 and pnpm. The repository pins the Node version in `.nvmrc` and `.node-version`; select it before running package commands.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Local development defaults to demo mode, so it needs no Clerk or Supabase credentials.

## Public product demo

The public demo is deliberately separate from the development workspace. Use `/demo` for the audit walkthrough and `/demo/workspace` for the read-only Studio Nova product tour. It uses checked-in fixture data and does not call protected workspace APIs or show mutation controls.

## Useful commands

```bash
pnpm docs:dev
pnpm docs:build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm check:code
pnpm test:e2e
```

Install Playwright browsers once before running end-to-end tests:

```bash
pnpm test:e2e:install
```
