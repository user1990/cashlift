---
title: Canonical examples
description: Verified reference implementations other products should copy before inventing new patterns.
---

CashLift is a reference implementation for React/Next.js business applications. Copy these examples before adding new patterns.

| Pattern | Code | Tests |
| --- | --- | --- |
| Mutation with conflicting controls locked | `src/modules/spend-requests/hooks/useSpendRequestDecision.ts` | `src/modules/dashboard/cockpits/ApprovalsCockpit.test.tsx` |
| Demo workspace approval journey | `src/modules/dashboard/cockpits/ApprovalsCockpit.tsx` | `e2e/demo-approval-workflow.spec.ts` (outcome); pending-lock in `ApprovalsCockpit.test.tsx` |
| Keyboard activation on primary action | `src/modules/spend-requests/components/ApprovalDecisionActions.tsx` | `e2e/keyboard-approvals.spec.ts` |
| URL-state navigation shell | `src/modules/page-shell/navigation.ts` | `src/modules/page-shell/navigation.test.ts` |
| Form field primitive | `src/ui/components/forms/TextField.tsx` | `src/ui/components/forms/EmailAutocompleteField.test.tsx` |
| Money display primitive | `src/modules/money/components/MoneyDisplay.tsx` | `src/modules/money/components/MoneyDisplay.stories.tsx` |
| Translation message source | `src/services/i18n/messages/en.json` | `src/modules/page-shell/navigation.ts` (Overview and Spend approvals labels) |

When documentation, code, and tests disagree, treat the failing check as the bug and align all three.
