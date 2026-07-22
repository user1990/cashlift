---
name: guide
description: Coding conventions, file structure, Git/PR/commit rules, React/Zod/React Query patterns, and i18n rules. Trigger when writing TS/React code, naming things, structuring files, creating branches/commits/PRs, or looking up team conventions.
---

# Frontend Guide

Use this skill for implementation conventions. For deeper rationale, extended examples, and historical workflow details, read `.agents/docs/guide.md` only when needed.

## Stack

Node.js 22.13+, pnpm 11, TypeScript, React, Next.js App Router, React Compiler, Turbopack, Clerk, Supabase, TanStack Query, React Hook Form, Zod, Tailwind CSS v4, react-aria-components, lucide-react, motion, next-intl, Recharts, Vitest, Testing Library, Playwright, Biome, Sentry, Vercel Analytics/Speed Insights, Fallow, React Doctor, Lefthook.

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
- Prefer `T[]` over `Array<T>` for inline array types; extract named types for reused object shapes.
- Use numeric separators for large numeric literals with four or more digits.
- Use explicit absence checks for optional numeric values when `0` is meaningful; do not use truthiness to distinguish a missing value from zero.
- For user-visible character counts, use `utilities/text/countCharacters`; do not use `.length` or inline `Intl.Segmenter`.
- Boolean names prefer adjective form (`active`, `selected`) unless `is/has` is clearer. With nouns, put the noun first (`modalVisible`).
- Function names should describe behavior. Reserve `handleX` for functions that directly receive an event object.

## React

- Use the shortest component name that gives enough context; avoid collisions with primitives such as `Icon` or `Dropdown`.
- Put blank lines between distinct JSX blocks.
- In JSX maps, destructure item properties in the callback and put `key` first on the rendered element.
- Inline trivial one-off formatting. For non-trivial repeated logic, prefer `function helperName(...) {}` near the bottom of the file.
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
- Prefer CSS `:has()` over React state/handlers/props when the state only exists to style a parent based on descendant structure/native state.
- Prefer native View Transitions for snapshot-based page/UI transitions before adding animation dependencies.
- Declare `children` explicitly in props; avoid `React.PropsWithChildren`.
- Component boolean props should be optional by default and default to `false` in the component unless the boolean is truly required domain data.
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

## Testing Pointer

For tests, load `.agents/skills/testing/SKILL.md`. Core reminders: test behavior, use accessible queries, prefer top-level components, group related assertions, use real services over mocks where possible, use `it.each` for repetitive cases, and assert translated content rather than keys.
