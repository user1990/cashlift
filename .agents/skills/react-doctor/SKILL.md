---
name: react-doctor
description: Use after React or Next.js code changes, before committing React code, or when improving CashLift code quality. Runs React Doctor score checks for lint, dead code, accessibility, bundle size, performance, correctness, and architecture diagnostics.
version: "1.0.0"
---

# React Doctor

React Doctor scans React codebases for security, performance, correctness, accessibility, bundle-size, dead-code, and architecture issues. It outputs a 0-100 health score.

## CashLift Workflow

After React or Next.js changes, run:

```bash
pnpm doctor:diff
```

For a full local audit, run:

```bash
pnpm doctor
```

CI runs React Doctor on pull requests, compares PR output with `main`, and comments with the report diff. Scheduled audits run daily and upload the full report as a workflow artifact. Do not claim the scheduled job auto-fixes issues unless a real agent runner and GitHub credentials are added.

Fix diagnostics by severity: errors first, then warnings. Re-run the same command and make sure the score does not regress.

## Diagnostics

Use React Doctor output as a focused code-quality signal, not as an automatic rewrite plan.

- For unclear findings, run `npx -y react-doctor@latest . --offline --explain <file:line>`.
- Do not delete dead-code or type-export findings based only on Knip output; first confirm with `rg`, TypeScript, and tests.
- Prefer narrow source fixes over broad `react-doctor.config.json` ignores.
- If a suppression is necessary, use the narrowest `react-doctor-disable-next-line` comment and document why the flagged pattern is intentional.

## Useful Commands

```bash
pnpm doctor:diff
pnpm doctor
pnpm doctor:score
```

| Command | Purpose |
| --- | --- |
| `pnpm doctor:diff` | Scan files changed against `main` |
| `pnpm doctor` | Full offline scan of the app |
| `pnpm doctor:score` | Output only the numeric score |
