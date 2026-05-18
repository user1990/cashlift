import { parseISO } from "date-fns";
import type { CompanyRole, FinancialDataset } from "@/modules/workspace/types";
import type { ActionPriority } from "./types";

const ACTION_PRIORITY_WEIGHTS = {
	critical: 4,
	high: 3,
	medium: 2,
	low: 1,
} as const satisfies Record<ActionPriority, number>;

export const getVisibleCashActions = (dataset: FinancialDataset, role: CompanyRole) =>
	dataset.cashActions
		.filter((action) => action.status === "open" && action.visibleTo.includes(role))
		.toSorted((left, right) => {
			const priorityDelta = ACTION_PRIORITY_WEIGHTS[right.priority] - ACTION_PRIORITY_WEIGHTS[left.priority];

			if (priorityDelta !== 0) {
				return priorityDelta;
			}

			const dateDelta = parseISO(left.dueDate).getTime() - parseISO(right.dueDate).getTime();

			if (dateDelta !== 0) {
				return dateDelta;
			}

			return right.impactCents - left.impactCents;
		});
