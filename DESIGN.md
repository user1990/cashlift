# Design

## Workspace cockpits

Dashboard routes share one liquid-glass operating cockpit. Settings must feel like those routes, not like an older opaque settings sheet.

Observable rules:

- Section pages use `GlassCard` with status, priority, queue, and support atmospheres. Do not reintroduce `Panel` plus `WorkspaceSectionHeader` on a dashboard section page.
- Status cards lead with `{company} · {surface}`, a derived `h1`, and three metrics from the current dataset.
- Priority cards use the active glass intensity. Queue and support cards stay quieter.
- Cards sit on photographic cockpit atmospheres with translucent `bg-panel` overlays and `backdrop-blur-xl`. Borders stay `white/10` unless the card is the active priority surface (`border-primary/30`).
- Lists divide with `divide-white/10`. Money uses `ExploreMoney`. Cross-surface movement uses `ExploreLink`, not a second button language.
- Every displayed amount, count, date, and comparison is derived from the current input. Prefer a truthful label over fabricated precision.

## Settings

- Settings is a configuration inventory, not a mock editor. Do not show persistable controls without a mutation path.
- Public-demo copy names mocked QuickBooks / Xero / bank-feed fixtures. Live workspace copy names company records and does not invent connectors.
- Money movement is an explicit Off configuration, paired with text, not color alone.
- Cash buffer and monthly payroll on settings are guardrail facts used in cash decisions. They are not payroll execution or fund movement.
- Distinguish the public Studio Nova tour from a live company workspace in the status kicker and data-source row.

## Motion

Honor `prefers-reduced-motion`. Animate `transform` and `opacity` only. Do not use `transition-all`.
