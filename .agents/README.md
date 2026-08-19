# .agents/ Directory

This directory contains AI agent instructions organized into **skills** (actionable workflows) and **docs** (reference material).

## Skills vs Docs

### Skills (`skills/`)

Actionable instructions that AI agents trigger on specific tasks. Each skill:

- Has **YAML frontmatter** with `name` and `description` (used for automatic triggering)
- Contains **imperative instructions** — step-by-step workflows the agent follows
- Is **concise** (<500 lines ideal) — enough to act on without overwhelming context
- Covers **one responsibility** — styling, testing, architecture, etc.

**Add to skills when:**

- The content tells the agent **how to do something** (workflow, conventions, patterns)
- It should trigger automatically based on task type (e.g. "style a component" → `skills/styling/SKILL.md`)
- It contains rules, conventions, or patterns the agent must follow during implementation
- It's referenced in the orchestrator's decision tree

**Examples:** coding conventions, testing patterns, styling rules, fix workflows, design implementation

### Context Budget Rules

Agents should preserve important context without loading every guide at once:

- Keep `SKILL.md` files actionable and preferably under 500 lines.
- Move detailed examples, inventories, and long explanations to `docs/`, then link to them from the relevant skill.
- Put only trigger-critical rules in `AGENTS.md`; task-specific rules belong in skills.
- Load in this order: `AGENTS.md` → matching `SKILL.md` files → referenced `docs/` files only when the task needs deeper detail.
- When a task is long-running, maintain a compact working summary: goal, files/modules, decisions, commands, verification, blockers, next step.

### Docs (`docs/`)

Reference material the agent (or human) can consult for context. Each doc:

- Is a **plain `.md` file** in `docs/` — no `SKILL.md` wrapper, no kebab-case directory
- Needs **no YAML frontmatter** — docs are never auto-dispatched
- Contains **informational content** — analysis, catalogs, migration logs, comparisons
- Can be **any length** — detail is valuable for reference
- Is **not triggered automatically** — read on demand when context is needed

**Add to docs when:**

- The content explains **what happened** or **what exists** (analysis, report, catalog)
- It's a one-time investigation, migration log, or compatibility report
- It provides lookup tables, package catalogs, or architectural inventories
- It won't be stale quickly or is tied to a specific point in time

**Examples:** migration notes, dependency analysis, package catalogs, before/after comparisons

## Naming Convention

- **Skills** live in their own **kebab-case** directory with a single **`SKILL.md`** file (matches the common agent skill layout).
- **Docs** are **plain `.md` files** directly inside `docs/` with a kebab-case filename — no wrapper directory.

```
skills/
├── architecture/SKILL.md
├── baseline-javascript/SKILL.md
├── create-pr/SKILL.md
├── guide/SKILL.md
├── review-pr/SKILL.md
├── security/SKILL.md
├── styling/SKILL.md
├── testing/SKILL.md
├── visual-recap/SKILL.md
├── web-interface-guidelines/SKILL.md
└── worktree/SKILL.md

docs/
├── guide.md
├── styling.md
├── testing.md
└── web-interface-guidelines.md
```

**Path rules:**
- Skills → `skills/<kebab-name>/SKILL.md` (directory is the stable identifier; filename is always `SKILL.md`)
- Docs → `docs/<kebab-name>.md` (flat markdown files)

## Frontmatter Format

Only **skills** use YAML frontmatter — it drives automatic dispatch. Docs don't need it.

```yaml
---
name: skill-name
description: When to trigger and what it does. Be specific about trigger phrases and task types.
---
```

## Adding New Content

1. Determine if it's a **skill** (actionable workflow) or **doc** (reference material)
2. Create the file:
   - Skill → `skills/<kebab-topic>/SKILL.md` (new directory per topic, with frontmatter)
   - Doc → `docs/<kebab-topic>.md` (plain markdown, no frontmatter)
3. If it's a skill, add it to the orchestrator's decision tree in `CLAUDE.md` / root `AGENTS.md`

## Decision Checklist

| Question | Skill | Doc |
| --- | --- | --- |
| Does it tell the agent how to do something? | ✅ | |
| Should it trigger automatically on certain tasks? | ✅ | |
| Does it contain rules/conventions to follow? | ✅ | |
| Does it explain what happened or what exists? | | ✅ |
| Is it a one-time analysis or investigation? | | ✅ |
| Is it a lookup table or catalog? | | ✅ |
