import type { CashActionType } from "@/modules/cash-actions/types";

const ACTION_DESTINATIONS = {
	approval: "approvals",
	"cash-buffer": "cash",
	collection: "invoices",
	forecast: "cash",
	"vendor-leak": "vendors",
} as const satisfies Record<CashActionType, string>;

export const getCashActionDestination = (type: CashActionType, basePath: string) =>
	`${basePath}/${ACTION_DESTINATIONS[type]}`;
