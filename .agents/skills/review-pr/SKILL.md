---
name: review-pr
description: Review the current local branch against main or fetch and summarize PR feedback from GitHub. Use for local PR-style review ("review pr", "review branch", `/review-pr`) or when the user asks to get PR comments, summarize PR feedback, or list actionable pull request feedback.
---

# Review PR

Review the current branch locally and return PR-style findings in the chat. Do not make code changes unless the user asks.

## Local Branch Review

1. Read `AGENTS.md` first, then load relevant skills for the review scope when needed:
   - `architecture` for module boundaries, aliases, and import rules
   - `testing` for test expectations and mocking rules
   - `guide` for repo conventions
   - `styling` for UI, Tailwind, and design token changes
   - Use `pnpm check:code` for Fallow dead-code and duplication checks
2. Gather context in parallel:

```bash
git diff main...HEAD --name-only
git diff main...HEAD
git status -u
git diff HEAD
git log main...HEAD --pretty=format:"%s" --reverse
git rev-parse --abbrev-ref HEAD
pnpm check:code
```

3. Include both committed branch changes and uncommitted changes unless the user asks otherwise.
4. Focus on regressions, missing tests, risky behavior changes, security or privacy issues, `AGENTS.md` violations, cross-module imports, Fallow allowlist weakening, unsupported UI claims, stale browser-time labels, and mutations that leave conflicting controls enabled.
5. Prioritize real bugs and user-visible risks over style feedback.
6. Do not edit files, stage changes, commit, push, create or update PRs, comment on GitHub, or resolve review threads unless the user asks.

### Local Review Output

Lead with findings, ordered by severity. For each finding include severity (`P0`–`P3`), file and line reference, problem, and suggested fix. If no issues are found, say that clearly and mention residual test gaps or review limits.

## Fetch PR Feedback

When the user wants GitHub review comments instead of a local diff review:

1. Resolve the active PR for the current branch.
2. Fetch review comments and discussion comments.
3. Group feedback by severity and actionability.
4. Return a grouped summary, a priority-ordered action list, and open questions that still need clarification.
