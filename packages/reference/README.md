# Reference packages

CashLift remains a single application repository. Extract code into `packages/*` only after a second product needs the same primitive and the slice is proven in `docs/engineering/canonical-examples.md`.

Planned extraction order:

1. Shared Biome/TypeScript presets when a sibling app exists.
2. Generic UI primitives that no longer depend on finance modules.
3. Architecture check scripts once they are parameterized for multiple apps.

Until then, copy canonical examples from the CashLift app tree rather than depending on this folder.
