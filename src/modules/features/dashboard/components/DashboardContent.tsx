"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { CompanyRole, FinancialDataset } from "@/modules/base/finance/types";
import { Reveal } from "@/modules/ui/components/Reveal";
import { buildDashboardViewModel } from "../view-model";
import { DashboardActionInboxSection } from "./DashboardActionInboxSection";
import { DashboardChartsSection } from "./DashboardChartsSection";
import { DashboardFooterActions } from "./DashboardFooterActions";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardHeroSection } from "./DashboardHeroSection";
import { DashboardMetricsSection } from "./DashboardMetricsSection";
import { DashboardQueuesSection } from "./DashboardQueuesSection";

type DashboardContentProps = {
	dataset: FinancialDataset;
};

export const DashboardContent = ({ dataset }: DashboardContentProps) => {
	const chartsReady = useMounted();
	const [role, setRole] = useState<CompanyRole>(() => dataset.profile.defaultRole);
	const dashboard = useMemo(() => buildDashboardViewModel({ dataset, role }), [dataset, role]);

	return (
		<main className="min-h-screen bg-shell text-shell-foreground">
			<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
				<DashboardHeader companyName={dashboard.companyName} />

				<DashboardHeroSection role={role} setRole={setRole} />

				<DashboardMetricsSection dashboard={dashboard} />

				<DashboardActionInboxSection dashboard={dashboard} />

				<DashboardChartsSection chartsReady={chartsReady} dashboard={dashboard} />

				<Reveal delay={0.16} duration={0.16} y={8}>
					<DashboardQueuesSection dashboard={dashboard} />
				</Reveal>

				<DashboardFooterActions />
			</div>
		</main>
	);
};

function useMounted() {
	return useSyncExternalStore(
		() => () => undefined,
		() => true,
		() => false,
	);
}
