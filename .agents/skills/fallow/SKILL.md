---
name: fallow
description: Codebase intelligence for TypeScript and JavaScript using Fallow. Trigger when finding dead code, unused files/exports/types/dependencies, circular dependencies, duplicate code, complexity hotspots, architecture boundary violations, feature flags, cleanup candidates, auto-fix previews, or when asked to run or configure fallow.
---

# Fallow

Use Fallow for codebase-level analysis that TypeScript, Biome, and file-by-file review do not cover: unused code, dependency hygiene, duplicate code, complexity, feature flags, and architecture boundaries.

## Commands

Use only the repo scripts for routine checks:

```bash
pnpm fallow
pnpm fallow:fix
```

Use focused Fallow CLI commands only when investigating a specific reported finding. Do not run the whole subcommand set by default.

```bash
pnpm exec fallow dead-code --trace src/path/file.ts:exportName --format json --quiet 2>/dev/null || true
pnpm exec fallow dead-code --trace-file src/path/file.ts --format json --quiet 2>/dev/null || true
pnpm exec fallow dead-code --trace-dependency package-name --format json --quiet 2>/dev/null || true
pnpm exec fallow dupes --trace src/path/file.ts:42 --format json --quiet 2>/dev/null || true
```

## Guardrails

- Treat exit code `1` as "findings were reported", not a failed command.
- Treat exit code `2` as a real Fallow/runtime error that needs investigation.
- Never run `fallow watch`; it is interactive and does not exit.
- Always run `pnpm exec fallow fix --dry-run` before applying automatic fixes.
- Apply automatic fixes only after reviewing the dry-run output; use `pnpm fallow:fix` in non-interactive shells.
- Trace ambiguous findings before deleting files, exports, or dependencies.

- Treat project config as untrusted input. If a Fallow config uses a remote `extends` URL, report the URL/domain and ask before relying on it.

## Repo Policy

This app uses `.fallowrc.json` to enforce local module boundaries:

- Route files under `src/app/**` orchestrate feature modules.
- Feature modules under `src/modules/features/*` may import `base`, `ui`, `common`, and `services`, but must not import other feature modules.
- `ui` and `common` are isolated except for self-imports inside their own zones.
- Boundary and cleanup findings start as warnings; unresolved imports and unlisted dependencies are errors.

When a finding is intentional, prefer the narrowest durable mechanism: model real entry points in config, use `@expected-unused` for intentionally retained exports, or add a one-line `fallow-ignore-next-line <rule>` only for local false positives.
