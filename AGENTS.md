# Agent Orchestrator

**Always read this file first when given a task.** This orchestrator guides you through the workflow and skill selection process.

## Workflow

### Step 1: Search Before Building

**Before adding new hooks, components, utilities, or packages**, search the codebase to check if something similar already exists. Use a fast, cheap sub-agent (`explore` with `"quick"` thoroughness) to:

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
- Which modules or packages are involved (feature, base, shared, ui, common, services)
- What skills are relevant

### Step 3: Respect Module Boundaries

Our architecture enforces strict import rules. The **architecture** skill ([.agents/skills/architecture/SKILL.md](.agents/skills/architecture/SKILL.md)) is the source of truth for the module-type table, path aliases, and structure. One rule repeated here because it's the one most often violated: **feature modules must never import from other feature modules** — orchestrate at the route level.

### Step 4: Pick the Relevant Skills

Match the task to the skills listed under **## Skills** below — read each matching `SKILL.md` before implementing. Most tasks combine two or three (e.g. UI work pulls architecture + styling + guide). A skill's frontmatter description names the trigger; when in doubt, open the skill file.

### Step 5: Match Local Conventions, Then Execute

Before writing or modifying code, **read 2–3 nearby files of the same kind** (component, hook, utility, test, index, etc.) and replicate their patterns exactly — export style, function definition style, type placement, file structure, naming, ordering. Never rely on AI defaults when the codebase has established conventions.

Apply the skills with full context:

- Use correct import paths — alias config is per-app. Check the local `tsconfig.json` first; most apps use `"baseUrl": "src"` with `modules/...` imports. The **architecture** skill has the full breakdown.
- Follow patterns from the guide and architecture
- Maintain consistency with the existing codebase

### Step 6: Delegate Wide Searches

For tasks that span many files or need broad code exploration, delegate via your agent's sub-agent mechanism (Claude Code: `Explore` subagent; Cursor: Composer + background agents). Pass the sub-agent enough context — design tokens, existing patterns, types being created elsewhere — so it doesn't rediscover conventions on its own.

## Skills

Skills live under `.agents/skills/<name>/SKILL.md` with frontmatter (`name`, `description`) describing their trigger. Neither Cursor nor Claude Code auto-discovers this path, so this table is the routing hint — open the matching `SKILL.md` for full content.

| Skill | Use for |
| --- | --- |
| [architecture](.agents/skills/architecture/SKILL.md) | Module boundaries, path aliases, where code lives |
| [guide](.agents/skills/guide/SKILL.md) | Conventions, file structure, Git/PR format, React patterns |
| [styling](.agents/skills/styling/SKILL.md) | Tailwind, `cn()`, cva, design tokens, SCSS migration |
| [testing](.agents/skills/testing/SKILL.md) | Drivers, mocking rules, RTL selectors |
| [figma](.agents/skills/figma/SKILL.md) | Implementing UI from Figma (requires Figma MCP) |
| [create-pr](.agents/skills/create-pr/SKILL.md) | Open or update PRs using the repo's template |
| [create-translation-task](.agents/skills/create-translation-task/SKILL.md) | Translation tasks in Jira |

## Key Principles

1. **Search first** — Search the codebase (project scope, then `packages/*`) before importing or creating something that might already exist. Use a fast sub-agent for this.
2. **Module boundaries** — Never let feature modules import from other feature modules; orchestrate at the route level.
3. **Skill selection** — Use multiple skills when relevant (e.g. UI work needs search + architecture + styling + guide).
4. **Consistency** — Before writing code, read nearby files of the same kind and replicate their conventions exactly. Never fall back to generic AI defaults when the codebase has established patterns.
5. **Verification** — Confirm imports and exports exist (search + architecture) before using them.
6. **Design tokens** — Use theme tokens from Tailwind config; avoid arbitrary pixel/color values.
7. **Safety & privacy** — Never commit credentials or secrets; sanitize at boundaries; avoid telemetry that captures PII.

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

## When in Doubt

1. Search the codebase for similar functionality (project scope first, then `packages/*`).
2. Read [.agents/skills/architecture/SKILL.md](.agents/skills/architecture/SKILL.md) for module rules and paths.
3. Apply the skills that match the task type.
4. Ask the user for clarification if the task is ambiguous.

## Quick Reference

- **Package manager:** pnpm
- **Monorepo tool:** Turborepo
- **Conventions:** [.agents/skills/guide/SKILL.md](.agents/skills/guide/SKILL.md)
- **Directory guide:** [.agents/README.md](.agents/README.md) — what goes in skills vs docs
