import { AlertTriangle, CircleDollarSign, Clock3, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/modules/common/money/format";
import { Reveal } from "@/modules/ui/components/Reveal";
import type { DashboardViewModel } from "../types";
import { MetricCard } from "./MetricCard";

type DashboardMetricsSectionProps = {
	dashboard: DashboardViewModel;
};

export const DashboardMetricsSection = ({ dashboard }: DashboardMetricsSectionProps) => (
	<Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" delay={0.04} duration={0.16} y={8}>
		<MetricCard
			accent="highlight"
			icon={<CircleDollarSign aria-hidden className="size-5" />}
			label="Cash available"
			meta="Bank balance in the active operating account"
			value={formatCurrency(dashboard.cashAvailableCents)}
		/>

		<MetricCard
			icon={<ShieldCheck aria-hidden className="size-5" />}
			label="Runway"
			meta="Based on payroll, essential bills, and active tools"
			value={`${dashboard.runwayDays} days`}
		/>

		<MetricCard
			icon={<AlertTriangle aria-hidden className="size-5" />}
			label="Cash at risk"
			meta="Overdue receivables plus cash buffer exposure"
			value={formatCurrency(dashboard.cashAtRiskCents)}
		/>

		<MetricCard
			icon={<Clock3 aria-hidden className="size-5" />}
			label="Pending approvals"
			meta="Requests waiting on a manager or finance"
			value={String(dashboard.pendingApprovalCount)}
		/>
	</Reveal>
);
