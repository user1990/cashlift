import type { DashboardViewModel } from "../types";
import {
	getPrototypeFactLine,
	PrototypeActionList,
	type PrototypeCashAction,
	type PrototypeEmphasis,
	PrototypeHeader,
	PrototypeRelatedWork,
	PrototypeWeekList,
} from "./prototypeShared";

type ActionStackVariantProps = {
	dashboard: DashboardViewModel;
	emphasis: PrototypeEmphasis;
	onSelectAction: (id: string) => void;
	onSelectWeek: (week: string) => void;
	selectedAction?: PrototypeCashAction;
	selectedWeek?: string;
};

export const ActionStackVariant = ({
	dashboard,
	emphasis,
	onSelectAction,
	onSelectWeek,
	selectedAction,
	selectedWeek,
}: ActionStackVariantProps) => (
	<div className="flex min-w-0 flex-col gap-5">
		<div className="order-2 md:order-1">
			<PrototypeHeader
				companyName={dashboard.companyName}
				factLine={getPrototypeFactLine({
					actionTitle: selectedAction?.title,
					cashAvailableCents: dashboard.cashAvailableCents,
					cashBufferTargetCents: dashboard.cashBufferTargetCents,
				})}
			/>
		</div>

		<div className="order-1 min-w-0 md:order-2">
			<PrototypeActionList
				actions={dashboard.actionInbox}
				emphasized={emphasis === "action"}
				onSelect={onSelectAction}
				selectedId={selectedAction?.id}
			/>
		</div>

		<div className="order-3 grid min-w-0 gap-5">
			<PrototypeRelatedWork actionType={selectedAction?.type} dashboard={dashboard} />

			<PrototypeWeekList
				chartData={dashboard.forecastChartData}
				emphasized={emphasis === "week"}
				onSelect={onSelectWeek}
				selectedWeek={selectedWeek}
			/>
		</div>
	</div>
);
