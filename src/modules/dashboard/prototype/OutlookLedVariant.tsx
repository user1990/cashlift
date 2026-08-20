import type { DashboardViewModel } from "../types";
import {
	getPrototypeFactLine,
	getPrototypeWeekFactLine,
	PrototypeActionList,
	type PrototypeCashAction,
	type PrototypeEmphasis,
	PrototypeHeader,
	PrototypeRelatedWork,
	PrototypeWeekList,
} from "./prototypeShared";

type OutlookLedVariantProps = {
	dashboard: DashboardViewModel;
	emphasis: PrototypeEmphasis;
	onSelectAction: (id: string) => void;
	onSelectWeek: (week: string) => void;
	selectedAction?: PrototypeCashAction;
	selectedWeek?: string;
};

export const OutlookLedVariant = ({
	dashboard,
	emphasis,
	onSelectAction,
	onSelectWeek,
	selectedAction,
	selectedWeek,
}: OutlookLedVariantProps) => {
	const selectedWeekPoint = dashboard.forecastChartData.find(({ week }) => week === selectedWeek);
	const factLine =
		emphasis === "week" && selectedWeek && selectedWeekPoint
			? getPrototypeWeekFactLine({
					cashAvailableCents: dashboard.cashAvailableCents,
					cashBufferTargetCents: dashboard.cashBufferTargetCents,
					week: selectedWeek,
					weekBalanceCents: Math.round(selectedWeekPoint.balance * 100),
				})
			: getPrototypeFactLine({
					actionTitle: selectedAction?.title,
					cashAvailableCents: dashboard.cashAvailableCents,
					cashBufferTargetCents: dashboard.cashBufferTargetCents,
				});

	return (
		<div className="flex min-w-0 flex-col gap-5">
			<div className="order-2 xl:order-1">
				<PrototypeHeader companyName={dashboard.companyName} factLine={factLine} />
			</div>

			<div className="order-1 grid min-w-0 items-start gap-5 xl:order-2 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
				<PrototypeWeekList
					chartData={dashboard.forecastChartData}
					emphasized={emphasis === "week"}
					onSelect={onSelectWeek}
					selectedWeek={selectedWeek}
				/>

				<div className="grid min-w-0 gap-5">
					<PrototypeActionList
						actions={dashboard.actionInbox}
						emphasized={emphasis === "action"}
						onSelect={onSelectAction}
						selectedId={selectedAction?.id}
					/>

					<PrototypeRelatedWork actionType={selectedAction?.type} dashboard={dashboard} />
				</div>
			</div>
		</div>
	);
};
