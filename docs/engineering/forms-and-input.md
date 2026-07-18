---
title: Forms and input
description: Build accessible forms from a single runtime contract.
---

Use React Hook Form for form state and the feature's Zod schema as the resolver. This keeps client-side feedback aligned with the validation performed at the server boundary.

## Form rules

- Define the input schema and inferred values type beside the owning feature.
- Supply complete `defaultValues`; do not switch fields from uncontrolled to controlled during a session.
- Use the shared controlled fields in `src/ui/components` so labels, descriptions, error messages, keyboard behavior, and focus handling remain consistent.
- Preserve browser autocomplete hints for common inputs such as name, organization, and email.
- Show a real submitted state after success. Reset deliberately when the user starts a new submission.

Client validation improves feedback, but it is not authorization. Parse every submitted value again in the route handler or server action that accepts it.
