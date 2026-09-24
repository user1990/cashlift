import { getPercentage } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import type { DashboardViewModel } from "../types";

export type CashInsightsPresentation = ReturnType<typeof buildCashInsightsPresentation>;

export const buildCashInsightsPresentation = (dashboard: DashboardViewModel) => {
	const surplusCents = Math.max(0, dashboard.cashAvailableCents - dashboard.cashBufferTargetCents);
	const shortfallCents = Math.max(0, dashboard.cashBufferTargetCents - dashboard.cashAvailableCents);
	const bufferSharePercent = getSharePercent(dashboard.cashBufferTargetCents, dashboard.cashAvailableCents);
	const payrollSharePercent = getSharePercent(dashboard.monthlyPayrollCents, dashboard.cashAvailableCents);
	const cashWork = dashboard.actionInbox.find((action) => action.type === "cash-buffer" || action.type === "forecast");

	return {
		aboveBuffer: shortfallCents === 0,
		bufferShareLabel: bufferSharePercent === undefined ? undefined : getPercentage(bufferSharePercent),
		bufferSharePercent,
		cashWork,
		payrollShareLabel: payrollSharePercent === undefined ? undefined : getPercentage(payrollSharePercent),
		payrollSharePercent,
		shortfallCents,
		surplusCents,
	};
};

function getSharePercent(part: MoneyCents, whole: MoneyCents) {
	if (whole === 0) {
		return;
	}

	return (part / whole) * 100;
}
