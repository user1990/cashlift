"use client";

import { useState } from "react";
import type { CompanyRole, FinancialDataset } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { ChartsSection } from "./ChartsSection";
import { MetricsSection } from "./MetricsSection";
import { OverviewHeader } from "./OverviewHeader";
import { QueuesSection } from "./QueuesSection";

type OverviewProps = {
	dataset: FinancialDataset;
};

export const Overview = ({ dataset }: OverviewProps) => {
	const [role] = useState<CompanyRole>(() => dataset.profile.defaultRole);
	const dashboard = buildDashboardViewModel({ dataset, role });

	return (
		<div className="space-y-5">
			<OverviewHeader dashboard={dashboard} />

			<ChartsSection dashboard={dashboard} />

			<QueuesSection dashboard={dashboard} />

			<MetricsSection dashboard={dashboard} />
		</div>
	);
};
