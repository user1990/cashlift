---
name: worktree
description: Create and use isolated Git worktrees for parallel Codex work. Use when the user asks to work in a separate worktree, isolate a task, avoid touching current changes, work in parallel, or start from a clean checkout.
---

# Worktree Isolation

Create a separate Git worktree for the task so Codex can work without colliding with changes in the main checkout or another session.

## Defaults

- Worktree parent directory: `../cashlift-worktrees/`
- Branch prefix: `codex/`
- Base ref: `origin/main`
- Package manager: `pnpm`

Use local `HEAD` as the base only when the user explicitly asks to base the worktree on the current branch or unpushed branch state.

## Before Creating A Worktree

Run read-only checks:

```bash
git status -sb
git branch --show-current
git worktree list
git fetch origin
```

If the requested worktree name or branch already exists, report it and either reuse it when that is clearly intended or choose a specific non-conflicting name.

## Create A Worktree

Use a short kebab-case task name:

```bash
mkdir -p ../cashlift-worktrees
git worktree add ../cashlift-worktrees/<task-name> -b codex/<task-name> origin/main
cd ../cashlift-worktrees/<task-name>
source "$HOME/.nvm/nvm.sh" && nvm use
pnpm install --frozen-lockfile
```

Skip `pnpm install --frozen-lockfile` when dependencies are already present and current enough for the requested task.

## Local Ignored Files

A worktree is a fresh checkout, so ignored files like `.env` and `.env.local` are not copied automatically by Git.

If the task needs ignored local files, copy only the minimum required files from the main checkout after confirming they are gitignored. Do not print secrets or file contents.

Suggested include list:

```gitignore
.env
.env.local
.env.development.local
```

## Working Rules

- Keep all task edits inside the worktree path.
- Do not modify the original checkout after entering the worktree.
- Do not commit, push, delete branches, or remove worktrees unless the user asks.
- Preserve unrelated work in every checkout.
- When finished, report the worktree path, branch, verification, and any remaining cleanup.

## Cleanup

When the user asks to remove a completed worktree:

```bash
git worktree list
git worktree remove ../cashlift-worktrees/<task-name>
git branch -d codex/<task-name>
```

Use `git branch -D` or `git worktree remove --force` only with explicit user approval because those can discard work.
