import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { Reveal } from "@/modules/ui/components/Reveal";
import type { DashboardViewModel } from "../types";
import { CashOutlookChart } from "./CashOutlookChart";
import { SpendMixChart } from "./SpendMixChart";

type DashboardChartsSectionProps = {
	chartsReady: boolean;
	dashboard: DashboardViewModel;
};

export const DashboardChartsSection = ({ chartsReady, dashboard }: DashboardChartsSectionProps) => (
	<Reveal className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]" delay={0.12} duration={0.16} y={8}>
		<Panel>
			<PanelHeader eyebrow="13-week cash" title="Cash outlook from accounting-style data" />

			<CashOutlookChart chartData={dashboard.forecastChartData} chartsReady={chartsReady} />
		</Panel>

		<Panel>
			<PanelHeader eyebrow="Team budgets" title="Committed spend by team" />

			<SpendMixChart chartData={dashboard.spendChartData} chartsReady={chartsReady} />
		</Panel>
	</Reveal>
);
