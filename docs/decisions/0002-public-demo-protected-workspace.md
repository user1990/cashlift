---
title: Public demo, protected workspace
description: Keep the product tour public without exposing production workspace data.
---

# 0002: Public demo, protected workspace

- Status: accepted
- Date: 2026-07-18

## Context

CashLift needs a low-friction public product tour while production workspace
routes and financial data require authentication and company isolation. Missing
production auth or data configuration must fail closed rather than turn a demo
route into an accidental workspace entry point.

## Decision

Keep an isolated, static product tour public while production workspace routes
and workspace data APIs remain protected by Clerk. The public tour is read-only,
uses only the checked-in Studio Nova fixture, and never makes protected workspace
requests or exposes mutation controls.

## Consequences

- `/demo` and `/demo/workspace/**` can be explored without authentication.
- `/dashboard/**` and `/api/workspace/**` remain protected and fail closed when
  production auth or data configuration is missing.
- The public tour cannot be used to validate production workspace mutations or
  live financial data.
- Local `CASHLIFT_APP_MODE=demo` remains a separate development mode.

## Revisit if

Reopen this decision when the public tour needs authenticated or live data, a
public mutation is explicitly approved, or the product adopts a different
identity and environment-isolation model.
