---
name: useeffectevent-refactor
description: Scan React components for useEffect hooks that read reactive values only to perform non-reactive logic (logging, notifications, listener callbacks, guard checks) and migrate them to React's native useEffectEvent (stable in React 19.2). Use this whenever the user asks to find, fix, audit, clean up, or refactor useEffect dependency arrays, stale closures, unnecessary Effect re-runs, or mentions "useEffectEvent", "effect event", "stale closure", or "dependency array". Also trigger proactively when reviewing or refactoring any React component containing useEffect for code quality, performance, or correctness reasons — don't wait for the user to name the hook explicitly.
user-invocable: true
---

# useEffectEvent Refactor

You are a migration assistant that converts `useEffect` hooks with over-broad or under-broad dependency arrays into hooks that use `useEffectEvent` for their non-reactive logic.

Follow these 6 phases exactly. Do not skip phases or reorder them.

---

## Phase 1: Discovery

Scan the target file(s) or project for effect code:

1. Use Grep to find all `useEffect(` and `useLayoutEffect(` call sites:
   - Pattern: `use(Layout)?Effect\(`
   - Search in `**/*.{ts,tsx,js,jsx}`
2. Use Grep to check whether `useEffectEvent` is already imported anywhere, and check `package.json` for the `react` version:
   - Pattern: `from ['"]react['"]` combined with `useEffectEvent`
   - If `react` in `package.json` is `<19.2.0`, flag this in the Phase 3 report — the codebase can't use native `useEffectEvent` yet, and every candidate should be marked "blocked: requires react >=19.2" rather than migrated.
3. Read each file containing an effect call site. For every effect, capture: the full effect body, its dependency array, and any nested callbacks/listeners registered inside it (`.on(`, `.addEventListener(`, `.then(`, `setTimeout(`, `setInterval(`, subscription callbacks, etc).

**Exclude** from scanning:

- `node_modules/`
- `*.test.*` and `*.spec.*` files
- Build output directories (`lib/`, `build/`, `dist/`)

---

## Phase 2: Classification

**Guiding principle (from the React docs): only extract logic that is genuinely an event fired from inside the Effect** — a callback response, a tick, a "connected" notification. `useEffectEvent` is not a general-purpose tool for making an inconvenient dependency disappear. If a value should legitimately cause the Effect to re-run, it must stay a dependency, even if that's annoying. Misusing it this way hides real bugs (the canonical bad example: wrapping a page-view logger in an Effect Event so it stops receiving the updated URL, silently under-logging).

For each effect found, classify every value referenced in its body into one of two buckets. Apply these checks in order — the first match for a given value determines its bucket:

### Bucket A — reactive/identity values (must stay in deps)

1. The value determines _what_ the effect connects to, fetches, or subscribes to (e.g. `roomId` in `createConnection(roomId)`) — if it changes, the effect must tear down and re-run.
2. The value is read directly in the effect's top-level synchronization logic (not inside a nested callback/listener), and changing it changes the effect's behavior on this run, not just on some future callback firing.
3. The value's change should observably affect the outcome of the _next_ time the callback fires (not just an ambient setting read at time of firing) — if omitting it would mean the Effect misses/uses stale info about something it should track, it's Bucket A, not Bucket B, even if it's only read inside a nested callback. (This is the case the docs warn about: a URL read inside a logging call is Bucket A, because missing an update means the log is wrong — not merely "less optimal.")

### Bucket B — non-reactive "latest value" reads (candidates to extract)

1. Used only inside a nested callback/listener registered by the effect (an event handler, `.then()`, timeout, websocket/subscription callback) — the effect doesn't need to restart just because these change, AND missing an intermediate update doesn't produce incorrect behavior, only a very slightly later-observed one (e.g. a mute toggle, a theme for styling a toast, a "canMove" gate).
2. Used purely for logging, analytics, notifications/toasts, or guard checks where staleness-by-one-render has no correctness consequence (`if (!hasLoadedInitialData.current) return`).
3. Used as a pagination/infinite-scroll condition (`hasNextPage`, `isFetchingNextPage`) where the actual triggering dependency is something else (e.g. `lastItem`).
4. A callback prop (`onSuccess`, `onError`) invoked inside the effect but not used to decide whether the effect re-runs.

### Not a candidate — skip, don't touch

- Every value in the deps array is Bucket A.
- The effect has no listener/callback/async boundary — a single synchronous block where every value is structurally required (e.g. `element.style.color = color`).
- The value is already a stable identity: a `useState` setter, `useReducer` dispatch, or a `useRef` object.
- **A value sits in the deps array next to a comment suggesting it's there only to silence exhaustive-deps.** Do NOT auto-classify this as Bucket B — that comment often marks a place where a developer already suppressed a real bug. Surface it as "ambiguous — needs manual review: possible pre-existing suppressed dependency bug" instead of migrating it automatically.
- Classification is ambiguous, or the value fails the Bucket-A/B checks above with any doubt about correctness impact. When in doubt, leave it alone and note it in the report as "ambiguous — needs manual review" rather than guessing.

An effect is a **migration candidate** if it has at least one Bucket-B value that is:

- **present in deps** (unwanted re-run — perf issue), or
- **missing from deps** (latent stale-closure bug — flag as higher priority than the perf-only cases, since it's an actual correctness bug).

---

## Phase 3: Dry-Run Report

**ALWAYS print this report before asking the user to select components. This report must be visible to the user before Phase 4.**

Print a structured report. Do NOT apply any changes yet.

```
## useEffectEvent Migration Report

### Summary
- Files scanned: X
- Effects found: Y
- Migration candidates: Z  |  Not candidates: W

### Migration Candidates

#### `path/to/file.tsx` — ComponentName, effect at line N
**Issue:** unwanted re-run | stale-closure bug (missing dep)
**Bucket-B value(s):** theme, onSuccess
**Current deps:** [roomId, theme]
**Proposed:** extract `onConnected` as a useEffectEvent, new deps: [roomId]

### Not Candidates (will be skipped)

#### `path/to/file.tsx` — ComponentName, effect at line N
**Reason:** all values are Bucket A / no candidate values / ambiguous — needs manual review
```

This report MUST be printed as text output in the conversation — not collapsed, not just implied. The user needs to read it before selecting effects in Phase 4.

---

## Phase 4: User Confirmation

**You MUST explicitly ask the user which candidates to migrate before editing anything.** Use whatever structured question/selection mechanism is available in the current environment (e.g. a multi-select question tool). Do not silently apply all changes, and do not proceed on assumption.

- Default to all candidates selected; let the user deselect any they want to skip.
- Each option should show: component/file, and a one-line description of the issue (e.g. "src/hooks/useRoomConnection.ts:42 — theme causes unwanted reconnect").
- If no structured selection tool is available, ask in plain text and wait for the user's reply before proceeding.

**Wait for the user's response before proceeding.** If the user selects nothing or declines, abort with: "Migration aborted. No changes were made."

Only proceed to Phase 5 with the effects the user confirmed.

---

## Phase 5: Apply Migrations

For each confirmed effect:

1. Add `useEffectEvent` to the existing `import { ... } from 'react'` (or add a new import if none exists). If Phase 1 flagged the project as `react <19.2.0`, stop and report this as blocked instead of editing.
2. Extract the Bucket-B logic into a named `useEffectEvent` callback placed just above the `useEffect` that uses it. Name it for what it does (`onConnected`, `notifyRoomChange`, `syncApiPrivileges`) — not `handler` or `effectEvent`.
3. Call that function from inside the `useEffect` (or from inside the nested listener/callback where the logic originally lived).
4. Remove the Bucket-B value(s) from the dependency array. **Do not** add the `useEffectEvent`-wrapped function itself to the dependency array — its identity is intentionally unstable across renders, so including it would make the Effect re-run every render; the linter flags this as an error.
5. Leave every Bucket-A value in the dependency array untouched.
6. If the dependency array becomes empty after removals, use `[]` cleanly.
7. Print progress as you go:
   ```
   [1/N] Migrated ComponentName's effect in path/to/file.tsx
   ```

### Example

Before:

```tsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on("connected", () => {
    showNotification("Connected!", theme);
  });
  return () => connection.disconnect();
}, [roomId, theme]);
```

After:

```tsx
const onConnected = useEffectEvent(() => {
  showNotification("Connected!", theme);
});

useEffect(() => {
  const connection = createConnection(roomId);
  connection.on("connected", () => {
    onConnected();
  });
  return () => connection.disconnect();
}, [roomId]);
```

`roomId` stayed (Bucket A — determines the connection). `theme` moved into the effect event and dropped out of deps (Bucket B — only read when the callback fires).

### Safety Rules

These rules are non-negotiable. Violating them corrupts user code.

1. **When in doubt, skip.** If a pattern is ambiguous, leave it out of the candidate list in Phase 3 rather than guessing during Phase 5.
2. **Only call a `useEffectEvent`-returned function from inside `useEffect`, `useLayoutEffect`, `useInsertionEffect`, or another Effect Event in the same component** (including their nested callbacks). Never pass it down as a prop, call it from a plain event handler outside an Effect, or call it during render — if that pattern already exists in the code, flag it as a bug rather than "fixing" it further (it's also a lint error, not just a style issue).
3. **`useEffectEvent` itself must be called at the top level of the component or a custom Hook** — never inside a loop, condition, or nested function. If the Bucket-B logic you're extracting only conditionally exists, extract a component/Hook boundary instead of trying to conditionally call `useEffectEvent`.
4. **Don't wrap the entire effect body** in `useEffectEvent` — only the non-reactive portion. Synchronization logic (connecting, subscribing, fetching by a Bucket-A id) stays directly in the `useEffect` body.
5. **Never remove imports still used elsewhere in the file.** Check every remaining line for references before removing an import.
6. **Preserve all non-migration logic** — other effects, state, handlers, types — untouched.
7. **Preserve component structure and public API** — props, ref forwarding, exported types — identical to before.
8. **Do not introduce TypeScript errors.** If the project has a lint/typecheck script (check `package.json`), run it on changed files after editing and fix anything it surfaces before finishing.

---

## Phase 6: Final Report

After all migrations are applied, print:

```
## Migration Complete

### Changed (X effects)
- `path/to/file.tsx` — ComponentName: what moved out of deps, and whether it was a stale-closure bug fix or a re-run optimization

### Unchanged / Skipped (Y effects)
- `path/to/file.tsx` — ComponentName: reason skipped (not a candidate / user deselected / blocked on react version / ambiguous)

### Next Steps
- Run your test suite / manually exercise the affected components to confirm behavior is unchanged
- Re-run your linter — the exhaustive-deps rule should now pass cleanly on migrated effects
```

---

## useEffectEvent Reference (for migration accuracy)

`useEffectEvent` — stable in React 19.2, `import { useEffectEvent } from 'react'`. Call it at the **top level of the component** (or a custom Hook) — never inside a loop or condition.

- Wraps a callback so the returned Effect Event function always reads the **latest committed props/state** at the time it's called, even though the closure was created on an earlier render.
- **Identity is intentionally _not_ stable** — it changes on every render, on purpose. This is a deliberate runtime assertion: if you (incorrectly) put it in a dependency array, the Effect will re-run on every render, making the misuse obvious immediately instead of silently. Never rely on it having a stable reference, and never include it in a dependency array regardless.
- Solves the two-bad-options problem: adding a value to `useEffect` deps causes unwanted re-runs (teardown/reconnect/refetch) when the effect doesn't actually need to restart for that value; omitting it causes a stale-closure bug where the effect keeps using an outdated value.
- Valid call sites only: inside `useEffect`, `useLayoutEffect`, `useInsertionEffect`, or from within **another Effect Event defined in the same component**. Never valid during render, as a prop passed to a child component, or called from a plain (non-Effect) event handler — the linter enforces this and treats it as an error, not a warning.
- The callback can accept parameters and return a value; the caller decides what to pass in (e.g. `onConnected(roomId)`), it isn't limited to reading only closed-over values.
- **Do not use `useEffectEvent` merely to make an inconvenient dependency go away.** It exists for logic that is genuinely an event fired from inside an Effect (a callback, a tick, a "connected" notification) — not as a shortcut to silence the exhaustive-deps lint rule for a value the Effect should legitimately react to. Using it that way hides real bugs (e.g. wrapping a page-view logger so it stops receiving updated URLs). See Phase 2's caution on lint-silencing comments.
