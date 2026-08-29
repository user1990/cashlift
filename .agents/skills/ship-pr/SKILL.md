---
name: ship-pr
description: Run a CashLift pull request from scope through review, verification, feedback resolution, and handoff. Trigger on ship/create/open/update/review PR, address or resolve review feedback, or prepare a branch for merge.
---

# Ship PR

Use narrowest mode. For multi-step Ship/Resolve, ledger: mode, risk, SHAs, PR,
checks, feedback, gate.

## Modes and authority

Later sections apply only to named modes.

- **Review**: pin, inspect, verify, and report. Read-only.
- **Feedback**: pin the PR/head, fetch all feedback once, classify, and report.
  Do not review the diff or run local checks unless requested.
- **Ship**: implement, verify, commit, push, create/update the PR, and complete
  required CI/feedback gates, including valid feedback resolution; never merge
  or deploy.
- **Resolve**: fix valid feedback for an existing PR, verify, commit, push,
  reply, and resolve the exact addressed thread. Ask on specification or
  product-choice conflicts.
- **Merge/deploy**: act only when explicitly requested after readiness passes.

After inspection, state mode and provisional risk. Preserve dirty
work. Write modes use a clean requested branch/head worktree; never reset or
switch the dirty checkout.

## 1. Pin the change (all modes)

Read root `AGENTS.md`, request, and PR body/spec. Load triggered skills and ADRs
under `docs/decisions/`; follow root visual-recap rules.

For an existing PR, record its `number`, `url`, `baseRefName`, `baseRefOid`,
`headRefName`, and `headRefOid`:

```bash
gh pr view <number> --json number,url,baseRefName,baseRefOid,headRefName,headRefOid
```

Set `BASE_SHA` and `HEAD_SHA` to those OIDs, fetch missing objects, and review
`BASE_SHA...HEAD_SHA`. In Ship/Resolve, local `HEAD` must equal the PR head
before editing. Without a PR, pin the intended-base merge-base and local
`HEAD`. Record status, paths, commits.

Review the pinned range, not a moving branch. Report uncommitted files
separately unless requested. Start with changed hunks/units; expand to files,
callers/tests, consumers, or history only when risk or evidence requires it.

## 2. Classify risk and load context (Review, Ship, Resolve)

- **Low**: isolated docs, tests, or mechanical changes; focused checks.
- **Medium**: UI, shared contracts, dependencies, or multi-module behavior;
  relevant tests; preview when applicable.
- **High**: auth/authorization, payments, PII, API/data boundaries, migrations,
  security headers, or broad refactors; production-like verification, security
  checks, and a second semantic pass.

Reconcile request/spec, ADRs, and repository rules. Search callers/consumers
before proposing interface changes.

## 3. Review the whole diff (Review, Ship, Resolve)

Check correctness/data integrity; boundaries/security/privacy; user behavior,
accessibility, responsive layout, browser-time claims; tests for changed
behavior and meaningful error paths; and concrete maintainability risk.

Report a finding only when it is introduced by the pinned diff, concrete,
actionable, demonstrable from code or a reproducible check, and materially
likely to matter. Do not filter by expected author acceptance. Do not report
formatting, unreachable hypothetical misuse, or pre-existing debt.

Use an exact changed line and:

```text
P1 — path/to/file.ts:42
Problem: <failure and affected path>
Evidence: <test, trace, or code path>
Fix: <smallest safe correction>
```

Use P0 for release-blocking/data-loss/security emergencies, P1 for major
regressions, P2 for normal defects, and P3 for minor robustness. If none pass
the gate, say `No findings.` and state residual limits.

## 4. Verify proportionally (Review, Ship, Resolve)

Always run `git diff --check`. For code, select the repository Node version and
run only checks needed to prove changed behavior. Docs/instruction-only changes
may stop after diff, structure, and reference validation unless risk requires
more. Browser changes require rendered-flow verification; high-risk work
requires security checks and a second semantic pass. Record commands, results,
limits;
never call a blocked check green.

## 5. Prepare the PR (Ship, Resolve)

In Ship mode, create a feature branch from the pinned base when needed. In both
modes, stage named files only, use a capitalized imperative subject of 72
characters or fewer, and run checks before pushing:

```bash
git push -u origin HEAD
gh pr view --json number,title,body,url,isDraft,headRefOid,mergeable,statusCheckRollup
```

Before remote mutation, read current state and avoid duplicates. In Ship, create
a draft if needed and
use `<Scope>: Sentence case summary`; include Description, Verification, Risk,
and Preview. Never invent preview URLs. Follow root visual-recap rules.

## 6. Feedback and ship loop (Feedback, Ship, Resolve)

Feedback mode fetches all three surfaces once, classifies each item as valid
defect, already fixed, out of scope, duplicate, or intentional design, reports,
and stops. Ship and Resolve continue after every push until the same remote head
has passed required checks and has no valid unresolved feedback:

1. Wait for required CI/deployment with the available monitor; never busy-poll.
2. Fix failed checks at root, verify locally, commit, push, and restart for the
   new head.
3. For medium/high risk, inspect an applicable preview and await only review
   required by repository policy or the user.
4. Fetch reviews, inline comments, and issue comments; address valid defects
   and record reasons for every non-change.
5. Before replying or resolving, verify the response is not already present.
   Reply and resolve the exact addressed thread only after its fix is pushed and
   verified, using the actual reviewer login, thread URL, and commit URL. Use:
   `@<login> Fixed in [<sha>](<commit-url>): <resolution>. Verification: <check>.`

```bash
PR_NUMBER=$(gh pr view --json number --jq '.number')
gh api "repos/{owner}/{repo}/pulls/$PR_NUMBER/reviews"
gh api "repos/{owner}/{repo}/pulls/$PR_NUMBER/comments"
gh api "repos/{owner}/{repo}/issues/$PR_NUMBER/comments"
```

Use the GitHub connector or `gh api graphql` for `resolveReviewThread`. If CLI
authentication fails, use one connector fallback; otherwise mark the surface
unverified and do not claim readiness. If no monitor is available for a required
pending gate, report that exact gate. Rebase only when genuinely unmergeable or
requested, preserving authored commits and rerunning relevant checks.

## 7. Readiness and handoff (Ship, Resolve; Review when requested)

Feedback mode stops after classification unless readiness was requested. For
handoff or an explicitly requested merge, confirm intended diff, remote head
identity, required CI, required deployment/approvals, valid feedback, applicable
title/body/recap state, and mergeability. An unavailable required surface is
unverified, not green. Optional human review must not block readiness. Merge or
deploy only with explicit authority.

Use the smallest report:

```text
PR: <url> (<status>)
Head: <short-sha>
Checks: <results>
Feedback: <links and intentional/out-of-scope items>
Risk: <low|medium|high>; remaining gate: <none or exact gate>
```

For Review, lead with findings or `No findings.` and do not imply edits,
pushes, comments, or resolutions occurred.
