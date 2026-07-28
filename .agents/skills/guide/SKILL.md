---
name: guide
description: Coding conventions, file structure, Git/PR/commit rules, React/Zod/React Query patterns, and i18n rules. Trigger when writing TS/React code, naming things, structuring files, creating branches/commits/PRs, or looking up team conventions.
---

# Frontend Guide

Use this skill for implementation conventions. For code examples and deeper rationale, read `.agents/docs/guide.md` only when needed.

## Stack

See `package.json`. Non-obvious choices: React Compiler, Tailwind CSS v4, Fallow, React Doctor, next-intl, react-aria-components.

## File And Module Conventions

- `src/modules/*` contains business/product modules. Support layers live in `src/ui`, `src/services`, `src/utilities`, and route orchestration lives in `src/app`.
- Business modules should not import other business modules by default. Compose in `src/app`, or extract a shared primitive module such as `modules/money`.
- Do not repeat module names in filenames: prefer `api.ts` over `payments.api.ts`.
- Hook files use suffixes: `useThingQuery.ts`, `useThingMutation.ts`, `useThingStore.ts`, or `useThing.ts`.
- Keep Zod schemas in `schemas.ts` and models/types in `types.ts` unless local convention says otherwise.
- Use the existing `@/*` alias; confirm paths in the local `tsconfig.json` before importing.

## TypeScript And JavaScript

- Static module constants use `UPPER_SNAKE_CASE`; runtime locals use `camelCase`.
- Avoid single-letter variables except `i` in loops.
- Type properties: required first, optional second; alphabetize within each group.
- Use `property?: T` when absence is valid; reserve `property: T | undefined` for required keys/arguments that must be supplied explicitly.
- Prefer `T[]` over `Array<T>` for inline array types; extract named types for reused object shapes.
- Use numeric separators for large numeric literals with four or more digits.
- Use explicit absence checks for optional numeric values when `0` is meaningful; do not use truthiness to distinguish a missing value from zero.
- For user-visible character counts, use `utilities/text/countCharacters`; do not use `.length` or inline `Intl.Segmenter`.
- Boolean names prefer adjective form (`active`, `selected`) unless `is/has` is clearer. With nouns, put the noun first (`modalVisible`).
- Function names should describe behavior. Reserve `handleX` for functions that directly receive an event object.
- Getter utilities name the measured result before scope: `getRemainingTeamBudget`, `getInvoiceRiskTotal`; avoid scope-first names like `getTeamBudgetRemaining`.
- Display formatters accept raw domain values and own rounding/sign handling. Pass raw cents to `formatCurrency`; do not wrap values in `Math.abs` at call sites.
- Percent strings come from `getPercentage`, not `percentage`.

## React

- Use the shortest component name that gives enough context; avoid collisions with primitives such as `Icon` or `Dropdown`.
- Put the exported component at the top of the file. Keep file-private helpers below it: `function getThingClassName(...)` for class/logic helpers and `function renderThing(...)` or `function thingPart(...)` for single-use JSX slices.
- Split a helper into its own file only when it is reused, exported as a composable unit, or owns a distinct subtree with its own imports. Otherwise keep it in the parent file as a bottom-of-file helper.
- Put blank lines between distinct JSX blocks.
- Extract a repeated static JSX value (such as an ID used by `aria-labelledby` and `id`) into a named module constant.
- In JSX maps, destructure item properties in the callback. When `key` is present, put `key` first; when `className` is present, put `className` last.
- Inline trivial one-off formatting. For non-trivial repeated logic, prefer `function helperName(...) {}` near the bottom of the file.
- Component props expose only the data the component renders. Aggregate datasets belong at page, composition, query, or view-model boundaries—not leaf components.
- Derive stable unique list keys alongside data when natural fields can repeat.
- Use `key` for intentional component state resets when switching entity identity; avoid it when preserving local state or avoiding expensive remounts matters.
- Extract and export React Query query keys so mutations can invalidate them.
- Use React Query instead of manual async `useEffect`.
- Use `useOptimistic` for user-triggered mutations that need instant feedback; call optimistic updates inside `startTransition` for async actions and keep server validation/auth as source of truth.
- Use `<Activity>` only for UI likely to return where local/DOM state should survive hiding; avoid it for large one-way trees because hidden work still re-renders at low priority.
- Use `useEffectEvent` only for event-like callbacks fired by Effects that need latest props/state without resubscribing.
- Use `use` only with framework/cached promises or conditional context reads; do not create uncached promises during client render.
- Use React DOM resource preloading APIs only for proven critical resources or anticipated navigation/module warming.
- Trust React Compiler by default; add `useMemo`/`useCallback` only for semantic stability or measured need.
- Zod schemas: constants for static schemas, functions for dynamic schemas, hooks only when schema construction needs hooks/translations.
- `cn()` conditions use logical expressions, not object syntax.
- Prefer CSS `:has()` over React state/handlers/props when the state only exists to style a parent based on descendant structure/native state. See `styling/SKILL.md` for details.
- Prefer native View Transitions for snapshot-based page/UI transitions before adding animation dependencies.
- Declare `children` explicitly in props; avoid `React.PropsWithChildren`.
- Prefer `{!items.length && <li>…</li>}` over `{items.length === 0 ? <li>…</li> : null}` for empty-state JSX.
- Component boolean props should be optional by default and default to `false` in the component unless the boolean is truly required domain data.
- Do not present a trend, comparison, date, or financial amount unless it is derived from the current input. Prefer a truthful neutral label to fabricated precision.
- For browser-current labels, keep the server snapshot deterministic and derive the browser value after hydration with the established `useSyncExternalStore` pattern.
- If one mutation can create a conflicting decision, disable every conflicting action while it is pending; do not lock only the clicked control.
- Avoid `returnObjects: true` for object-shaped translations; it is acceptable for translated arrays.

## Security

- Render user text through JSX by default. Use `dangerouslySetInnerHTML` only with sanitized, reviewed HTML.
- Do not store auth/session tokens in `localStorage` or `sessionStorage`.
- Protect cookie-authenticated state-changing requests with CSRF validation unless equivalent protection exists.
- Validate external input at server boundaries with Zod/equivalent, then authorize before querying or mutating.
- Use parameterized queries/query builders only.
- Keep CSP and browser hardening headers restrictive.

## Git

- Branches are short-lived and typed: `feat/`, `fix/`, `refactor/`, `test/`, `docs/`, `chore/`, `release/`, `hotfix/`.
- PR titles use `Scope: Description`.
- Commit messages are imperative, capitalized, no trailing period, and at most 72 characters.

## Testing

For tests, load `.agents/skills/testing/SKILL.md`.
