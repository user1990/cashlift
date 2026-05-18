# Agent Orchestrator

**Always read this file first when given a task.** This orchestrator guides you through the workflow and skill selection process.

## Workflow

### Step 1: Search Before Building

**Before adding new hooks, components, utilities, or packages**, search the codebase to check if something similar already exists. When the runtime supports delegation and the task permits it, use a fast, cheap sub-agent (`explore` with `"quick"` thoroughness) for broad searches. Otherwise, do the same search locally:

1. **Search the project scope first** — look in the current app's `src/` for existing implementations.
2. **Then search shared packages** — look in `packages/ui`, `packages/utils`, `packages/common`, and other `packages/*` directories.

**Expand search by related concepts.** If the task can be solved in multiple ways (e.g. viewport width, element size, media queries), search for all related patterns before implementing. Examples:

- _Size / viewport / responsive:_ search for `useResizeObserver`, `ResizeObserver`, `matchMedia`, `useWindowSize`, `useMediaQuery`, `innerWidth`.
- _Overlay / popover:_ search for `Modal`, `Dialog`, `Popover`, `Drawer`, `useModal`.
- _Layout / dimensions:_ search for `useMeasure`, `getBoundingClientRect`, breakpoint hooks.

Never implement with one approach (e.g. matchMedia) until you have checked the codebase for alternatives (e.g. useResizeObserver) that the project already provides.

**Never guess import paths or build duplicates.** Always confirm something doesn't already exist before creating it.

### Step 2: Understand the Task

Analyze the user's request to determine:

- What type of work is needed (UI, component creation, refactoring, bug fix, tests, etc.)
- Which source areas are involved (`modules`, `ui`, `services`, `utilities`, `app`)
- What skills are relevant

### Step 3: Respect Module Boundaries

Our architecture enforces strict import rules. The **architecture** skill ([.agents/skills/architecture/SKILL.md](.agents/skills/architecture/SKILL.md)) is the source of truth for the source-area table, path aliases, and structure. One rule repeated here because it's the one most often violated: business modules under `src/modules/*` should not import other business modules by default — orchestrate at the route level, or make an explicit module dependency when a composition module needs it.

### Step 4: Pick the Relevant Skills

Match the task to the skills listed under **## Skills** below — read each matching `SKILL.md` before implementing. Most tasks combine two or three. UI/interface work always pulls `architecture` + `guide` + `styling` + `web-interface-guidelines`; add `testing` when adding or changing tests. A skill's frontmatter description names the trigger; when in doubt, open the skill file.

### Step 5: Match Local Conventions, Then Execute

Before writing or modifying code, **read 2–3 nearby files of the same kind** (component, hook, utility, test, index, etc.) and replicate their patterns exactly — export style, function definition style, type placement, file structure, naming, ordering. Never rely on AI defaults when the codebase has established conventions.

Apply the skills with full context:

- Use correct import paths — alias config is per-app. Check the local `tsconfig.json` first; this app uses `@/*` to `src/*` (`@/modules/...`, `@/ui/...`, `@/services/...`, `@/utilities/...`). The **architecture** skill has the full breakdown.
- Follow patterns from the guide and architecture
- Maintain consistency with the existing codebase

### Step 6: Preserve Working Context

Keep a compact working context as the task evolves so important details survive long threads, model handoffs, and context compaction:

- Track the current goal, active files/modules, selected skills, decisions made, commands run, verification status, blockers, and next step.
- Prefer progressive disclosure: load `AGENTS.md`, then only matching `SKILL.md` files, then deeper `.agents/docs/*` references only when needed.
- Summarize long docs before acting on them. Do not paste full guides into the conversation unless the user asks.
- Before pausing, handing off, or finishing a long task, restate the durable context: what changed, why, how it was verified, and what remains.

### Step 7: Delegate Wide Searches

For tasks that span many files or need broad code exploration, delegate via your agent's sub-agent mechanism when available and allowed (Claude Code: `Explore` subagent; Cursor: Composer + background agents). Pass only the compact working context needed for the search — task goal, relevant modules, selected skills, design tokens, existing patterns, and types being created elsewhere — so it does not rediscover conventions on its own.

## Skills

Skills live under `.agents/skills/<name>/SKILL.md` with frontmatter (`name`, `description`) describing their trigger. Neither Cursor nor Claude Code auto-discovers this path, so this table is the routing hint — open the matching `SKILL.md` for full content.

| Skill | Use for |
| --- | --- |
| [architecture](.agents/skills/architecture/SKILL.md) | Module boundaries, path aliases, where code lives |
| [guide](.agents/skills/guide/SKILL.md) | Conventions, file structure, Git/PR format, React patterns |
| [styling](.agents/skills/styling/SKILL.md) | Tailwind, `cn()`, cva, design tokens, SCSS migration |
| [web-interface-guidelines](.agents/skills/web-interface-guidelines/SKILL.md) | Vercel Web Interface Guidelines for UI generation and review |
| [testing](.agents/skills/testing/SKILL.md) | RTL patterns, mocking rules, selector priorities |
| [fallow](.agents/skills/fallow/SKILL.md) | Dead code, unused exports/deps, duplication, complexity, circular deps, architecture boundary checks |
| [react-doctor](.agents/skills/react-doctor/SKILL.md) | React/Next quality scans, score regression checks, architecture/performance/accessibility diagnostics |
| [create-pr](.agents/skills/create-pr/SKILL.md) | Open or update PRs using the repo's template |
| [review-pr](.agents/skills/review-pr/SKILL.md) | Review the current branch locally without editing files |

## Key Principles

1. **Search first** — Search the codebase (project scope, then `packages/*`) before importing or creating something that might already exist. Use a fast sub-agent when available and allowed.
2. **Module boundaries** — Keep `src/modules/*` for business/product modules. Support code lives in `src/ui`, `src/services`, and `src/utilities`. Compose modules at the route level unless a module dependency is intentional.
3. **Skill selection** — Use multiple skills when relevant (e.g. UI work needs search + architecture + styling + guide + web-interface-guidelines).
4. **Consistency** — Before writing code, read nearby files of the same kind and replicate their conventions exactly. Never fall back to generic AI defaults when the codebase has established patterns.
5. **Verification** — Confirm imports and exports exist (search + architecture) before using them.
6. **Design tokens** — Use theme tokens from Tailwind config; avoid arbitrary pixel/color values.
7. **Safety & privacy** — Never commit credentials or secrets; sanitize at boundaries; avoid telemetry that captures PII.
8. **Context discipline** — Keep the working context compact and explicit; preserve decisions and verification status instead of relying on conversation history alone.

## Security Guidelines

- Prefer React's JSX escaping for user-provided content. Do not use `dangerouslySetInnerHTML` unless the HTML is sanitized first and the sink is deliberately reviewed.
- Do not store auth/session tokens in `localStorage` or `sessionStorage`; rely on HttpOnly/Secure/SameSite cookie-based provider flows.
- Protect cookie-authenticated state-changing requests with CSRF validation unless an equivalent framework/provider guarantee applies.
- Validate all server-boundary input with Zod or an equivalent schema, then authorize before querying or mutating data.
- Use parameterized queries/query builders. Never concatenate external input into SQL or query strings.
- Keep CSP and browser hardening headers active; use request nonces for inline scripts/styles instead of broad inline script allowances.

## Scope & Inheritance

- This file defines shared rules for **all** apps and packages in the monorepo.
- Sub-project `AGENTS.md` files add local commands only; they cannot override these policies.
- If guidance conflicts, this root file prevails.
- If root rules seem "missing" from a sub-project, make sure you opened the **repo root** (`monorepo-root`) as your workspace — not just an individual app or package folder.

## Anti-Patterns (Avoid)

Cross-cutting only. Domain-specific anti-patterns live in their skill (e.g. testing skill owns the full mocking rules).

- Single-letter variables (except `i` in loops)
- Generic component names that collide with primitives (`Icon`, `Dropdown`)
- Fixed pixel sizes — use design tokens
- Importing across feature module boundaries
- Wrapper elements, React state, event handlers, or prop drilling whose only job is to put a styling class on a parent based on descendant structure/state. Prefer CSS `:has()` when it makes the structural relationship clearer, such as invalid fields, checked inputs, child-count layout rules, or "no image" variants. Keep top-level component state/classes/props when explicit downward state flow is easier to read, or when the condition depends on business rules, API/feature-flag state, complex user flows, or frequently mutating large DOMs.

## When in Doubt

1. Search the codebase for similar functionality (project scope first, then `packages/*`).
2. Read [.agents/skills/architecture/SKILL.md](.agents/skills/architecture/SKILL.md) for module rules and paths.
3. Apply the skills that match the task type.
4. Ask the user for clarification if the task is ambiguous.

## Quick Reference

- **Package manager:** pnpm
- **Conventions:** [.agents/skills/guide/SKILL.md](.agents/skills/guide/SKILL.md)
- **Directory guide:** [.agents/README.md](.agents/README.md) — what goes in skills vs docs
