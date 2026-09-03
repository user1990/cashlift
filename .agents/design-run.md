# Design run

- **Date:** 2026-09-03
- **Request:** Facelift `/demo/workspace/settings` to match other dashboard glass cockpits; add more company-workspace context, features, and configs.
- **Host:** Existing CashLift app (`/demo/workspace` and `/dashboard`). Not a standalone one-pager.
- **Classification:** Surface polish. Same operating cockpit as invoices, vendors, team, cash, budgets, and approvals. Not a scroll journey.
- **Brief:** Sufficient — match the liquid-glass dashboard language and surface more truthful workspace configuration from the current dataset.
- **Phase:** Polish against the existing glass cockpit. Impeccable / prototype / stop-slop packs are not installed in this repo; CashLift `architecture`, `styling`, `guide`, `web-interface-guidelines`, and `testing` skills own implementation.
- **Design memory:** `PRODUCT.md` and `DESIGN.md` created from `CONTEXT.md` and the shipped dashboard glass system.
- **Constraints:** Do not invent amounts, connectors, or persistable toggles. Public demo stays read-only. Money movement stays off (ADR 0004).
- **Status:** implemented; automated tests passing; browser verification next
