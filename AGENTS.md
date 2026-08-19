# Agent Orchestrator

Always read this file first. It defines workflow for this repo. Do not override these rules.

## Workflow

1. Search before building.
   - Before adding hooks, components, utilities, packages, or import paths, search existing code first.
   - Start in the current app's `src/`, then expand to `packages/*` when relevant.
   - Search related concepts, not just the first implementation idea.
   - Use a fast sub-agent only when the runtime/user permits it and the search genuinely spans many files.

2. Understand the task.
   - Identify the work type: UI, component creation, refactor, bug fix, tests, API/data, docs, PR/review, or diagnostics.
   - Identify the source area: `src/app`, `src/modules`, `src/ui`, `src/services`, `src/utilities`, or `packages/*`.
   - Pick only the skills needed for this task.

3. Respect module boundaries.
   - Read `.agents/skills/architecture/SKILL.md` before creating files, changing imports, or deciding where code belongs.

4. Load skills progressively.
   - Read only matching `SKILL.md` files under `.agents/skills/` first.
   - Read `.agents/docs/*` only when the skill says deeper examples or rationale are needed.
   - UI work usually starts with `architecture` and `styling`; add `guide`, `web-interface-guidelines`, and `testing` as needed.
   - Read `.agents/skills/security/SKILL.md` before touching `src/app/api/**`, `src/proxy.ts`, server data loading, Supabase repositories, Clerk session code, environment variables, or CI security steps. This skill is mandatory for that work, not optional.

5. Match local conventions before editing.
   - Read 2-3 nearby files of the same kind before writing code.
   - Replicate local export style, type placement, function style, test shape, file naming, import ordering, and component structure.
   - Keep page and parent components lean. Put the exported component first and file-private helpers at the bottom of the same file. Split into a colocated component file only when the helper is reused, exported, or owns its own subtree/imports.
   - Confirm aliases in the local `tsconfig.json`; this app uses `@/*` to `src/*`.

6. Keep context compact.
   - Track goal, active files/modules, loaded skills, decisions, commands, verification, blockers, and next step.
   - Do not paste full guides or long command output into the conversation unless asked.
   - For long work, restate the durable summary before pausing or finishing.

7. Prevent known review regressions.
   - Read `.agents/skills/guide/SKILL.md` when UI or data-display work touches claims, dates, mutations, or component props.

8. Review the system change.
   - Read `.agents/skills/visual-recap/SKILL.md` when planning a non-trivial change, creating or updating a non-trivial PR, or when the user asks for a visual plan, system review, or PR recap.
   - For CashLift PRs, the repository-local GitHub-rendered recap is authoritative. Use a hosted Agent-Native Plan recap only when the user explicitly asks for the hosted or interactive variant.

## Non-Negotiables

- Never guess imports or duplicate existing helpers/components.
- Never import across feature/module boundaries casually.
- Keep exported components focused on composition. File-private JSX and class-name helpers belong at the bottom of the same file unless they are reused, exported, or own a distinct subtree.
- Do not invent trends, comparisons, dates, or monetary values. Derive each displayed value from the current input, or omit the claim.
- A mutation that can conflict with another control must lock every conflicting control until it settles, and its pending-state behavior needs a test.
- Treat browser time as client state. Do not bake a build-time date into a current-status label; preserve the server render and test the client behavior when time affects a decision.
- Validate server-boundary input with Zod or equivalent, authorize before data access, and avoid SQL/query string concatenation. `.agents/skills/security/SKILL.md` defines the required parse/authenticate/authorize/query order.
- Keep request protections in `src/proxy.ts`: state-changing workspace API requests need the origin check, and hardening headers stay restrictive.
- Do not store auth/session tokens in localStorage or sessionStorage.
- Do not commit secrets or telemetry that captures PII.
- Keep telemetry identifiers to request/correlation IDs; do not attach Clerk user IDs or other direct identifiers unless a documented, approved need requires it.

## Quick Reference

- Package manager: `pnpm`
- Runtime: shell commands must auto-select Node from `.nvmrc` / `.node-version` before any `pnpm` command. `pnpm` can fail before project scripts run on older Node versions.
- Conventions: `.agents/skills/guide/SKILL.md`
- Security rules: `.agents/skills/security/SKILL.md`
- Directory guide: `.agents/README.md`
- Security checks: `pnpm security:check`, `pnpm security:audit`
- Code diagnostics: `pnpm check:code` (Fallow), `pnpm check:react` (React Doctor)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
