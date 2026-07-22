---
name: review-pr
description: Review the current local branch against main without editing files. Use when the user wants PR-style feedback locally in the Codex thread instead of comments on GitHub. Trigger on "review pr", "local pr review", "review branch", `/review-pr`.
---

# Review PR

Review the current branch locally and return PR-style findings in the chat. Do not make code changes.

## Workflow

1. Read `AGENTS.md` first, then load relevant skills for the review scope when needed:
   - `architecture` for module boundaries, aliases, and import rules
   - `testing` for test expectations and mocking rules
   - `guide` for repo conventions
   - `styling` for UI, Tailwind, design token, or SCSS changes
   - Use `pnpm check:code` for Fallow dead-code and duplication checks
2. Gather context in parallel:

```bash
# Changed files relative to main
git diff main...HEAD --name-only

# Branch diff
git diff main...HEAD

# Uncommitted changes
git status -u
git diff HEAD

# Commit messages for intent
git log main...HEAD --pretty=format:"%s" --reverse

# Current branch name
git rev-parse --abbrev-ref HEAD

# Fallow audit
pnpm check:code
```

3. Include both committed branch changes and uncommitted changes in the review unless the user asks otherwise.
4. Focus on:
   - Regressions
   - Missing tests
   - Risky behavior changes
   - Security or privacy issues
   - Violations of `AGENTS.md`
   - Cross-module imports, re-export barrels, and Fallow allowlist changes that weaken ownership
   - Leaf components receiving aggregate datasets, UI claims unsupported by their input, stale browser-time labels, or mutations that leave conflicting controls enabled
5. Prioritize real bugs and user-visible risks over style feedback.
6. Do not edit files, stage changes, commit, push, create or update PRs, comment on GitHub, or resolve review threads.

## Output

Lead with findings, ordered by severity. For each finding include:

- Severity: `P0`, `P1`, `P2`, or `P3`
- File and line reference
- Problem
- Suggested fix

If no issues are found, say that clearly and mention any residual test gaps or review limits.

## Starter Prompt

Review my current branch against main. Focus on regressions, missing tests, risky behavior changes, security/privacy issues, and violations of AGENTS.md. Do not edit files. Return findings with file/line references, severity, and suggested fixes.
