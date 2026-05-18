import type { MoneyCents } from "@/modules/money/types";
import type { CompanyRole } from "@/modules/workspace/types";

export type ActionPriority = "critical" | "high" | "medium" | "low";

export type ActionStatus = "open" | "done";

export type CashActionType = "approval" | "collection" | "vendor-leak" | "cash-buffer" | "forecast";

export type CashAction = {
	description: string;
	dueDate: string;
	id: string;
	impactCents: MoneyCents;
	owner: string;
	priority: ActionPriority;
	status: ActionStatus;
	title: string;
	type: CashActionType;
	visibleTo: CompanyRole[];
};
