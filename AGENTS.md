# Agent Orchestrator

Always read this file first. It defines workflow for this repo. Do not override these rules.

## Workflow

1. Search before building.
   - Before adding hooks, components, utilities, packages, or import paths, search existing code first.
   - Start in the current app's `src/`, then expand to `packages/*` when relevant.
   - Search related concepts, not just the first implementation idea. Examples: responsive work should check `useResizeObserver`, `ResizeObserver`, `matchMedia`, `useWindowSize`, `useMediaQuery`, `innerWidth`, `useMeasure`, `getBoundingClientRect`, and breakpoint hooks.
   - Use a fast sub-agent only when the runtime/user permits it and the search genuinely spans many files. Small searches should be local.

2. Understand the task.
   - Identify the work type: UI, component creation, refactor, bug fix, tests, API/data, docs, PR/review, or diagnostics.
   - Identify the source area: `src/app`, `src/modules`, `src/ui`, `src/services`, `src/utilities`, or `packages/*`.
   - Pick only the skills needed for this task.

3. Respect module boundaries.
   - `src/app/**` composes routes and may import modules, UI, services, and utilities.
   - `src/modules/*` owns business/product code. Business modules should not import other business modules by default; compose at the route level unless the dependency is explicit.
   - `src/ui` is generic UI and may import only `ui` and `utilities`.
   - `src/services` may import only `services` and `utilities`.
   - `src/utilities` must stay domain-agnostic and not import app/module/UI/service code.
   - Read `.agents/skills/architecture/SKILL.md` before creating files, changing imports, or deciding where code belongs.

4. Load skills progressively.
   - Read only matching `SKILL.md` files first.
   - Read `.agents/docs/*` only when the skill says deeper examples/rationale are needed.
   - UI work usually starts with `architecture` and `styling`; add `guide` for React/file/naming/data conventions, `web-interface-guidelines` for accessibility/forms/responsive review, and `testing` when tests change.

5. Match local conventions before editing.
   - Read 2-3 nearby files of the same kind before writing code.
   - Replicate local export style, type placement, function style, test shape, file naming, import ordering, and component structure.
   - Keep page and parent components lean. When a TSX file defines nontrivial child components, cards, list items, legends, menus, summaries, or repeated UI blocks inline, extract each one into its own colocated component file without asking first.
   - Confirm aliases in the local `tsconfig.json`; this app uses `@/*` to `src/*`.

6. Keep context compact.
   - Track goal, active files/modules, loaded skills, decisions, commands, verification, blockers, and next step.
   - Do not paste full guides or long command output into the conversation unless asked.
   - For long work, restate the durable summary before pausing or finishing.

7. Prevent known review regressions.
   - Give presentational components the smallest owning model or primitive props they render; pass an aggregate dataset only at an explicit composition or view-model boundary.
   - Do not invent trends, comparisons, dates, or monetary values. Derive each displayed value from the current input, or omit the claim.
   - A mutation that can conflict with another control must lock every conflicting control until it settles, and its pending-state behavior needs a test.
   - Treat browser time as client state. Do not bake a build-time date into a current-status label; preserve the server render and test the client behavior when time affects a decision.

## Skill Routing

| Skill | Use for |
| --- | --- |
| `architecture` | Module boundaries, aliases, file placement, source ownership |
| `guide` | Coding conventions, React patterns, naming, Git/PR/commit rules |
| `worktree` | Isolated Git worktrees for parallel tasks or avoiding current checkout changes |
| `styling` | Tailwind, `cn()`, cva, design tokens, responsive styling |
| `web-interface-guidelines` | UI generation/review, forms, accessibility, focus, loading, motion |
| `testing` | RTL tests, mocking boundaries, selectors, fixtures, assertions |
| `create-pr` | Create or update PRs |
| `get-pr-comments` | Fetch and summarize review comments from the active pull request |
| `review-pr` | Local PR-style branch review |

Code diagnostics use package scripts: `pnpm check:code` for Fallow and `pnpm check:react` for React Doctor. There are no repo-local `fallow` or `react-doctor` skills.

## Non-Negotiables

- Never guess imports or duplicate existing helpers/components.
- Never import across feature/module boundaries casually.
- Do not leave nontrivial child components inline inside page or parent TSX files. Split them into separate colocated component files by default so the parent stays focused on composition.
- Prefer design tokens and theme-backed utilities; avoid arbitrary pixels/colors unless justified.
- Prefer CSS `:has()` for styling-only parent state when clearer than React state.
- Validate server-boundary input with Zod or equivalent, authorize before data access, and avoid SQL/query string concatenation.
- Do not store auth/session tokens in localStorage or sessionStorage.
- Do not commit secrets or telemetry that captures PII.
- Keep telemetry identifiers to request/correlation IDs; do not attach Clerk user IDs or other direct identifiers unless a documented, approved need requires it.

## Quick Reference

- Package manager: `pnpm`
- Runtime: shell commands must auto-select Node from `.nvmrc` / `.node-version` before any `pnpm` command. `pnpm` can fail before project scripts run on older Node versions.
- Conventions: `.agents/skills/guide/SKILL.md`
- Directory guide: `.agents/README.md`

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.
<!-- END:nextjs-agent-rules -->
