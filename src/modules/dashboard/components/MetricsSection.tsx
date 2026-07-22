import { ShieldCheck, Wallet, WalletCards } from "lucide-react";
import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { Panel } from "@/ui/components/Panel";
import type { DashboardViewModel } from "../types";
import { MetricItem } from "./MetricItem";

type MetricsSectionProps = {
	dashboard: DashboardViewModel;
};

export const MetricsSection = ({ dashboard }: MetricsSectionProps) => (
	<Panel className="grid gap-0 p-0 md:grid-cols-2 xl:grid-cols-4">
		<MetricItem
			direction="up"
			icon={<Wallet aria-hidden className="size-5" />}
			label="Cash on hand"
			trend="Current balance"
			value={formatPreciseCompactCurrency(dashboard.cashAvailableCents)}
			variant="primary"
		/>

		<MetricItem
			direction="up"
			icon={<WalletCards aria-hidden className="size-5" />}
			label="Committed spend"
			trend="Current commitments"
			value={formatPreciseCompactCurrency(dashboard.totalCommittedSpendCents)}
			variant="highlight"
		/>

		<MetricItem
			direction="down"
			icon={<WalletCards aria-hidden className="size-5" />}
			label="Uncommitted"
			trend="Available after commitments"
			value={formatPreciseCompactCurrency(dashboard.totalUncommittedCents)}
			variant="violet"
		/>

		<MetricItem
			direction="up"
			icon={<ShieldCheck aria-hidden className="size-5" />}
			label="At risk"
			trend="Invoice and buffer exposure"
			value={formatPreciseCompactCurrency(dashboard.cashAtRiskCents)}
			variant="warning"
		/>
	</Panel>
);
