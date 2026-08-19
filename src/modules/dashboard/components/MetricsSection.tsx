import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { Panel } from "@/ui/components/layout/Panel";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { MetricItem } from "./MetricItem";

type MetricsSectionProps = {
	dashboard: DashboardViewModel;
};

export const MetricsSection = ({ dashboard }: MetricsSectionProps) => {
	const lowestProjectedCashCents = dashboard.lowestProjectedCashCents;
	const lowestProjectedCashDate = dashboard.lowestProjectedCashDate;
	const belowBuffer =
		lowestProjectedCashCents !== undefined && lowestProjectedCashCents < dashboard.cashBufferTargetCents;

	return (
		<Panel className="grid gap-0 p-0 md:grid-cols-3">
			<MetricItem
				detail={`Buffer ${formatPreciseCompactCurrency(dashboard.cashBufferTargetCents)}`}
				label="Cash on hand"
				value={formatPreciseCompactCurrency(dashboard.cashAvailableCents)}
			/>

			<MetricItem
				detail={
					lowestProjectedCashDate ? formatDashboardDate(lowestProjectedCashDate) : "No 13-week outlook for this range"
				}
				label="Lowest projected cash"
				value={lowestProjectedCashCents === undefined ? "None" : formatPreciseCompactCurrency(lowestProjectedCashCents)}
				warning={belowBuffer}
			/>

			<MetricItem
				detail={getAtRiskDetail(dashboard)}
				label="Money at risk"
				value={formatPreciseCompactCurrency(dashboard.cashAtRiskCents)}
				warning={dashboard.cashAtRiskCents > 0}
			/>
		</Panel>
	);
};

function getAtRiskDetail(dashboard: DashboardViewModel) {
	const invoiceRiskCents = dashboard.invoiceRiskCents;
	const bufferRiskCents = dashboard.bufferRiskCents;

	if (invoiceRiskCents === 0 && bufferRiskCents === 0) {
		return "No overdue invoices or buffer gap";
	}

	const parts: string[] = [];

	if (invoiceRiskCents > 0) {
		parts.push(`${formatPreciseCompactCurrency(invoiceRiskCents)} overdue`);
	}

	if (bufferRiskCents > 0) {
		parts.push(`${formatPreciseCompactCurrency(bufferRiskCents)} buffer gap`);
	}

	return parts.join(" · ");
}
