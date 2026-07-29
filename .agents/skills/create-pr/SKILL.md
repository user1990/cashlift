---
name: create-pr
description: Create or update a PR for this single app — optional design link, Vercel preview link, and concise PR body from commits. Trigger on "create pr", "open pr", "update pr", `/create-pr`.
---

# Create PR

Create or update PRs for this single app with a lightweight template.

## GitHub Access

Examples below use the `gh` CLI, which is assumed to be installed in local shells. In environments where `gh` is not available (e.g. Claude Code on the web), use the equivalent `mcp__github__*` MCP tools instead — for example `mcp__github__list_pull_requests`, `mcp__github__pull_request_read`, `mcp__github__create_pull_request`, `mcp__github__update_pull_request`. Never fall back to constructing raw GitHub API calls.

## Workflow

1. Gather context (parallel)
2. Branch, commit & push (if needed)
3. Generate PR title & create draft PR (if no PR exists)
4. Get optional design link
5. Get Vercel preview URL
6. Generate a system recap when useful
7. Generate PR body
8. Present and execute

## Step 1: Gather Context

Run these in parallel:

```bash
# Changed files relative to main
git diff main...HEAD --name-only

# Uncommitted changes
git status -u
git diff HEAD

# Commit messages for description
git log main...HEAD --pretty=format:"%s" --reverse

# Current branch name
git rev-parse --abbrev-ref HEAD

# Check for existing PR on this branch
gh pr view --json number,title,body,url,isDraft 2>/dev/null

# Check push status
git status -sb
```

## Step 2: Branch, Commit & Push (if needed)

**Skip this step if the branch already has commits ahead of `main` and is pushed.**

### Create branch (if on `main` or no feature branch)

Use this branch format:

`{type}/{topic}-{short-description}`

Examples:
- `feat/cashflow-chart`
- `fix/input-validation`

Allowed types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.

### Commit (if there are uncommitted changes)

- Stage relevant files by name (avoid `git add -A`)
- Write a commit message: capitalized, imperative mood, <=72 chars, no period
- Use HEREDOC format for the commit message
- If pre-commit hooks fail on unrelated pre-existing errors, inform the user and ask before using `--no-verify`

### Push (if not already pushed or ahead of remote)

- Push branch to remote: `git push -u origin HEAD`

## Step 3: Generate PR Title & Create Draft PR

**Skip create step if a PR already exists for the branch.**

### Generate PR title

Use this format:

`<Scope>: Sentence case summary`

Rules:
- Scope is mandatory and must be the first word
- Scope starts with uppercase
- No issue identifiers in title
- Keep summary concise and outcome-focused

Examples:
- `Dashboard: Add repayment projections`
- `Calculator: Fix monthly income parsing in calculator form`

### Create draft PR (if no PR exists yet)

Create a draft PR so CI/Vercel can attach preview context:

```bash
gh pr create --draft --title "Dashboard: Add repayment projections" --body ""
```

## Step 4: Get Optional Design Link

Design link handling is intentionally simple:

- If user provides a Figma link, include it
- If no design link is provided, omit design section entirely
- Do not query external issue trackers automatically unless user asks

## Step 5: Get Vercel Preview URL

This repository is a single app, so include one preview item only.

Try in this order:

### Option A: Vercel bot PR comment (preferred)

```bash
PR_NUMBER=$(gh pr view --json number --jq '.number' 2>/dev/null)
gh pr view "$PR_NUMBER" --json comments \
  --jq '.comments[] | select(.author.login | test("vercel")) | .body'
```

Extract the first preview URL from the comment body.

### Option B: GitHub commit status (fallback)

```bash
HEAD_SHA=$(git rev-parse HEAD)
gh api "repos/{org}/{repo}/commits/$HEAD_SHA/statuses" \
  --jq '[.[] | select(.context | startswith("Vercel"))] | .[0]'
```

If status is failure, add a build failed note with logs URL.

### Option C: Deployment pending

If neither source has a URL yet, write `Deployment pending`.

Never fabricate preview domains.

## Step 6: Generate a System Recap

Read `.agents/skills/visual-recap/SKILL.md` and generate a recap block when the
PR is non-trivial: it spans multiple system primitives, or changes an API,
schema, authentication, authorization, financial-data boundary, mutation,
shared contract, or module boundary.

Skip the recap for a small, obvious change that reviews faster as a plain diff.
State that decision instead of producing filler.

Generate from the pushed diff and current
`docs/contributing/architecture/primitives.yaml`. Return the marker-delimited
block to this workflow; do not update the PR separately before presenting the
complete body.

## Step 7: Generate PR Body

Use this structure:

```markdown
## References

- [Design]({FIGMA_URL})

## Preview

- {preview_url_or_status}

## Description

{CONCISE_SUMMARY_FROM_COMMITS — 2-4 sentences max}

## Visuals

{USER_PROVIDED_OR_OMIT_SECTION_ENTIRELY}

{SYSTEM_RECAP_BLOCK_OR_OMIT}
```

Rules:
- Omit References section if no design link was provided
- Omit Visuals section if no visuals provided
- Append the complete system recap block after the human-authored sections when Step 6 generated one
- Regenerate an existing system recap from the current pushed diff and preserve its marker-delimited location
- Keep Description concise and readable

## Step 8: Present and Execute

1. Show composed title and body
2. Ask: `Update this PR?`
3. If approved, write the exact body to a temporary file and run:
   `gh pr edit {NUMBER} --title "..." --body-file {BODY_FILE}`
4. If user did not ask for draft, mark ready: `gh pr ready {NUMBER}`

If user asks for draft, leave PR in draft state.

## Edge Cases

- **No commits ahead of main**: warn user, do not create PR
- **Unpushed commits**: push first (`git push -u origin HEAD`)
- **Preview unavailable**: set Preview to `Deployment pending`
- **Pre-commit hook failures**: if unrelated/pre-existing, ask before bypassing hooks
