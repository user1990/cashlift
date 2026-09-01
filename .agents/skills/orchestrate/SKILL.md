---
name: orchestrate
description: Decide when a CashLift task benefits from multiple sub-agents in one isolated environment, then plan, delegate, integrate, and verify independent workstreams. Trigger for broad features, cross-area changes, existing PRs with independent cleanup slices, or explicit parallel-agent requests; use one implementer for small, coupled, or diagnostic tasks.
---

# Orchestrate

Use this skill to decide whether parallel agent work will save time and to run
that work safely when it does. This is for one isolated CashLift environment.
For separate environments or branches, use [worktree](../worktree/SKILL.md).

This skill is adapted from [Kody's orchestrate skill](https://github.com/kentcdodds/kody/blob/main/.agents/skills/orchestrate/SKILL.md) for CashLift's
repo structure, `pnpm` commands, module boundaries, and PR Cockpit workflow.

## Routing check

Consider this skill automatically at the start of implementation or PR work
when any of these are true:

- the task has two or more independent vertical slices;
- the change crosses at least two CashLift areas such as `src/app`,
  `src/modules/*`, `src/ui`, `src/services`, tests, or docs;
- the branch or PR has a broad change surface that can be split by ownership;
- the user explicitly asks for parallel agents, delegation, or orchestration.

Run the advisory check when a branch or worktree already has meaningful
changes:

```bash
pnpm check:orchestration
pnpm check:orchestration -- --json
```

For an actual PR, first use [review-pr](../review-pr/SKILL.md) and the repo's
`pr-cockpit owner/repo#N` read workflow. A non-`main` branch is PR-like work,
not proof that a PR exists. The check can report changed areas and possible
parallelism, but it cannot reliably infer file conflicts, task dependencies,
or PR intent.

Tell the human briefly what the check found. Use one of these outcomes:

- **Parallel candidate:** name the independent slices and the integration
  owner; proceed when the runtime supports delegation.
- **Single implementer recommended:** say that the task is small, sequential,
  coupled, or conflict-heavy.
- **Human decision needed:** call out shared contracts, security, auth,
  financial behavior, or unclear ownership that makes automatic fan-out unsafe.

This notice is advisory. It must not block ordinary work or pretend that a
heuristic has proved that parallel work is faster.

## Choose the execution shape

Prefer one implementer when the task is small, the diagnosis is still unclear,
the slices depend on each other, or agents would edit the same files or shared
contracts.

Fan out only when each slice has:

- a concrete objective and acceptance criteria;
- an explicit file/module scope and exclusions;
- no simultaneous edits to the same file or contract;
- a bounded stop condition and a short return format.

Good CashLift slices include a module-local behavior change, an independent
module-local UI change, and focused tests or documentation. Do not split a
single mutation, authorization boundary, financial rule, shared UI primitive,
or schema contract across agents without first assigning one owner for that
contract.

## Safe workflow

1. Read [AGENTS.md](../../../AGENTS.md), identify the source areas, and search
   for existing implementations before planning slices.
2. Establish the checkout, branch, base, dirty files, runtime, and current
   behavior. If unrelated changes are present, create an isolated worktree
   with [worktree](../worktree/SKILL.md) before delegating.
3. Define the integration owner, shared contracts, slice boundaries, write
   permissions, acceptance criteria, stop conditions, and return format.
4. Delegate independent slices in parallel. Serialize slices that share a
   file, API/schema/type, design-system primitive, security boundary, or test
   fixture.
5. Keep iteration checks targeted. The integration owner resolves conflicts,
   reads every returned diff, and runs the relevant [testing](../testing/SKILL.md),
   [security](../security/SKILL.md), and [architecture](../architecture/SKILL.md)
   checks.
6. Perform final QA yourself. Do not declare completion from agent claims;
   verify the behavior, diff, tests, and any browser or build evidence needed
   for the task.
7. For a non-trivial PR, use the repo-local [visual recap](../visual-recap/SKILL.md).
   Use [create-pr](../create-pr/SKILL.md) for PR preparation and keep one CI
   wait path through PR Cockpit.

## Guardrails

- Shared checkout means shared state: use one isolated worktree, not a dirty
  user checkout, for concurrent writes.
- Keep the critical path first. Parallelize only non-conflicting work; do not
  create review-after-review chains for every slice.
- Keep authorization, Clerk/Supabase controls, company isolation, financial
  calculations, and consequential CashLift decisions with a clearly named
  owner. Agents may explain and test them, but must not invent authority or
  bypass controls.
- Never stage or report unrelated dirty files as part of the task. Never use
  the heuristic output as evidence that a PR exists or that CI passed.
- If delegation is unavailable, continue with one implementer and report that
  limitation; do not manufacture parallel work.

## References

- [CashLift agent workflow](../../../AGENTS.md)
- [Agent directory conventions](../../README.md)
- [Architecture and module boundaries](../architecture/SKILL.md)
- [Worktree isolation](../worktree/SKILL.md)
- [Testing rules](../testing/SKILL.md)
- [Security rules](../security/SKILL.md)
- [Local PR review workflow](../review-pr/SKILL.md)
- [Local PR creation workflow](../create-pr/SKILL.md)
- [CashLift visual recap](../visual-recap/SKILL.md)
- [Advisory checker](../../../scripts/check-orchestration.mjs)
