---
name: ship-pr
description: Run a CashLift pull request from scope through review, verification, feedback resolution, and handoff. Trigger on ship/create/open/update/review PR, address or resolve review feedback, or prepare a branch for merge.
---

# Ship PR

Run one accountable PR cycle. Keep a short state ledger: goal, mode, risk, base
SHA, head SHA, PR, checks, open feedback, next gate.

## Modes and authority

Infer the narrowest mode from the request:

- **Review**: inspect and report only. No edits, staging, commits, pushes, PR
  comments, or thread resolution.
- **Feedback**: fetch and classify existing GitHub feedback; remain read-only.
- **Ship**: edit the requested implementation or docs, verify, commit, push,
  and create/update the PR. A request to ship authorizes those repository and
  GitHub mutations, but not merge or deploy.
- **Resolve**: address valid feedback, verify, commit, push, reply, and resolve
  the exact thread. Ask only when feedback conflicts with the specification or
  requires a product choice.
- **Merge/deploy**: do this only when explicitly requested, after the gates in
  this document pass.

State the selected mode and risk before acting. Preserve unrelated dirty work;
use a fresh worktree from the intended base when the current checkout is dirty.

## 1. Pin the change

Read root `AGENTS.md`, then load only relevant local skills. For non-trivial
PRs, read `.agents/skills/visual-recap/SKILL.md`. Read the PR body, linked issue
or spec, relevant ADRs under `docs/decisions/`, and applicable architecture,
security, testing, styling, or guide skills before judging the change.

Capture immutable SHAs before review:

```bash
git fetch origin
BASE_SHA=$(git merge-base origin/main HEAD)
HEAD_SHA=$(git rev-parse HEAD)
git status --short --branch
git diff --name-status "$BASE_SHA" "$HEAD_SHA"
git log --oneline "$BASE_SHA..$HEAD_SHA"
```

Review the pinned range, not a moving branch. Include tracked uncommitted files
only when the user explicitly wants a working-tree review; otherwise report
them separately. Inspect complete files, callers, tests, and relevant history
around every changed boundary. Continue through the entire diff.

## 2. Classify risk and load context

- **Low**: isolated docs, tests, or mechanical changes; focused checks.
- **Medium**: user-visible UI, shared contracts, dependencies, or multi-module
  behavior; full relevant tests and preview/manual inspection.
- **High**: auth, authorization, payments, PII, API/data boundaries, migrations,
  security headers, or broad refactors; security review, targeted tests,
  production-like verification, and a second semantic pass.

Never infer intent from code alone. Reconcile the diff with the request, PR
description, linked spec, ADRs, and repository rules. Search for callers and
consumers before proposing interface changes.

## 3. Review the whole diff

Look for introduced, actionable defects—not preferences. Check:

- correctness, edge cases, failure and loading states, and data integrity;
- integration, module boundaries, auth/authorization, privacy, and secrets;
- user behavior, accessibility, responsive layout, and browser-time claims;
- tests that prove changed business behavior and meaningful error paths;
- maintainability and Fowler smells: duplication, long routines, large
  conditionals, primitive obsession, data clumps, repeated branching,
  shotgun surgery, divergent change, feature envy, speculative abstraction,
  message chains, middlemen, and weak module boundaries.

Apply this evidence gate to each candidate finding. Report it only if it is
introduced by the pinned diff, concrete and actionable, demonstrable from code
or a reproducible check, likely to matter, and likely to be fixed. Do not report
formatting, hypothetical misuse without a reachable path, or pre-existing debt.

For each finding use an exact changed line (or the smallest overlapping range),
severity, impact, evidence, and fix:

```text
P1 — path/to/file.ts:42
Problem: <specific failure and affected path>
Evidence: <test, trace, or direct code path>
Fix: <smallest safe correction>
```

Use `P0` for release-blocking/data-loss/security emergencies, `P1` for likely
major regressions, `P2` for normal defects, and `P3` for minor robustness.
If none pass the gate, say `No findings.` and state residual test or review
limits. Keep findings separate from the overall readiness assessment.

## 4. Verify proportionally

Run deterministic checks from `package.json` after selecting the repository’s
Node version. At minimum use `git diff --check` and the narrowest relevant
lint, typecheck, unit, e2e, security, or code-diagnostic commands. For changed
browser behavior, verify the rendered flow at the required viewport; static
checks are not browser proof. For high-risk work, include the relevant security
checks and a final independent semantic pass.

Record command, result, and any environment limitation. Separate failures
introduced by the change from pre-existing or infrastructure failures; do not
call a blocked check green.

## 5. Prepare the PR (Ship mode)

Create a feature branch from the pinned intended base when needed. Stage named
files only. Use a capitalized imperative commit subject of 72 characters or
fewer. Run checks before pushing, then:

```bash
git push -u origin HEAD
gh pr view --json number,title,body,url,isDraft,headRefOid,mergeable,statusCheckRollup
```

Create a draft if no PR exists. Use `<Scope>: Sentence case summary` for the
title. Write a concise body with Description, Verification, Risk, and Preview;
include a design link only if supplied. Never invent preview URLs—use the
Vercel bot/status URL or write `Deployment pending`. Generate the repository
visual recap for non-trivial changes and preserve only its current
marker-delimited block.

## 6. Run the ship loop

After every push, refresh the remote head SHA and PR state. The loop is complete
only when the same remote head has passed all required checks and has no valid
unresolved feedback:

1. Wait for CI/deployment using the available GitHub wait/monitor mechanism;
   do not busy-poll or code through an intentional gate.
2. Fix failed checks at their root, run the relevant checks locally, commit, and
   push. Restart the loop because the head changed.
3. For medium/high risk, inspect the preview and request/await the applicable
   automated and human review before declaring readiness.
4. Fetch review comments, reviews, and issue discussion. Classify each as
   valid defect, already fixed, out of scope, duplicate, or intentional design.
   Address valid defects; record the reason for every non-change.
5. For each addressed inline thread, reply and resolve the exact thread only
   after the fix is pushed and verified. Use this format:

```text
@user1990 Fixed in [`<short-sha>`](<full-commit-url>): <one-sentence resolution>.

Verification: `<check 1>`, `<check 2>`.
```

Use the actual reviewer login, exact thread URL, and exact commit URL. Never
claim resolution before GitHub shows the reply and resolved state.

For CLI access, gather all three feedback surfaces rather than only the review
summary:

```bash
PR_NUMBER=$(gh pr view --json number --jq '.number')
gh api "repos/{owner}/{repo}/pulls/$PR_NUMBER/reviews"
gh api "repos/{owner}/{repo}/pulls/$PR_NUMBER/comments"
gh api "repos/{owner}/{repo}/issues/$PR_NUMBER/comments"
```

Use the GitHub connector or `gh api graphql` for inline-thread node IDs and the
`resolveReviewThread` mutation. Keep the exact URL beside each item in the
ledger so the final report and reply cannot drift from the addressed thread.

Rebase only when the branch is genuinely unmergeable or the user requests it;
preserve authored commits when possible and rerun the full relevant checks after
rebasing.

## 7. Readiness and handoff

Before handoff or an explicitly requested merge, confirm: intended diff only;
remote head matches the reviewed SHA; required CI is green; deployment status
is known; approvals are present; valid feedback is cleared; title/body and
recap describe the current head; and the PR is mergeable. A clean task worktree
does not excuse unrelated changes in another checkout.

Merge or deploy only with explicit authority and the repository’s supported
command. Otherwise stop at a ready PR and report the remaining human gate.

Use the smallest useful final report:

```text
PR: <url> (<status>)
Head: [`<short-sha>`](<full-commit-url>)
Checks: <results>
Feedback: <resolved links and any intentional/out-of-scope items>
Risk: <low|medium|high>; remaining gate: <none or exact gate>
```

For a review-only run, lead with findings or `No findings.` and do not imply
that edits, pushes, comments, or resolutions occurred.

## Model policy

Use the least expensive model that can satisfy the risk gate; the skill cannot
force the session model, so state the selected model in the ledger/report.

- Default orchestration and routine PRs: `gpt-5.6-terra`, medium reasoning.
- High-risk review, security/data boundaries, or unresolved disagreement:
  `gpt-5.6-sol`, high; use xhigh only when the evidence remains ambiguous.
- Repeated CI triage, feedback classification, or formatting: `gpt-5.6-luna`,
  low/medium; do not use it as the sole high-risk approval pass.
- Treat `gpt-5.3-codex-spark` as optional research preview for rapid,
  text-only low-risk iteration, never as the default release gate.

Higher reasoning consumes more time and tokens. Avoid Ultra/max by default;
reserve subagent-heavy modes for genuinely complex, high-risk work. Availability
and account pricing can vary; see the current [Codex model guidance](https://developers.openai.com/codex/models)
and [OpenAI model catalog](https://developers.openai.com/api/docs/models).
