# Agentic E2E Goals

Use these goals for local exploratory passes against demo mode. They complement deterministic Playwright tests; they are not required CI checks.

## Runner Guidance

- Prefer Playwright MCP or another browser-native agent controller over shell-only browser scripting.
- Start the app through the normal Playwright config so `CASHLIFT_APP_MODE=demo` is used.
- Do not use production data, real credentials, or live customer records.
- Run each goal 3-5 times before turning a finding into a deterministic test.
- Record the goal, result, duration, failure point, and whether a fixed Playwright test should be added.

## Goals

1. Open the demo workspace, review the approvals queue, approve the pending spend request, and confirm the UI reports no pending requests.
2. Open the demo workspace, navigate to vendor leaks, and confirm the monthly savings signal is visible with the listed leak candidates.
3. Start from the marketing demo page, open the interactive demo app, and confirm the workspace explains the next cash action without signing in.

## When To Use

- Before demos or releases when the product journey changed.
- When a user reports a confusing workspace flow that is hard to express as a single assertion.
- When a deterministic E2E failure needs a reproduction narrative before code changes.
