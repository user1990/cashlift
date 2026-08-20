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

type WorkbenchVariantProps = {
	dashboard: DashboardViewModel;
	emphasis: PrototypeEmphasis;
	onSelectAction: (id: string) => void;
	onSelectWeek: (week: string) => void;
	selectedAction?: PrototypeCashAction;
	selectedWeek?: string;
};

export const WorkbenchVariant = ({
	dashboard,
	emphasis,
	onSelectAction,
	onSelectWeek,
	selectedAction,
	selectedWeek,
}: WorkbenchVariantProps) => (
	<div className="flex min-w-0 flex-col gap-5">
		<div className="order-2 xl:order-1">
			<PrototypeHeader
				companyName={dashboard.companyName}
				factLine={getPrototypeFactLine({
					actionTitle: selectedAction?.title,
					cashAvailableCents: dashboard.cashAvailableCents,
					cashBufferTargetCents: dashboard.cashBufferTargetCents,
				})}
			/>
		</div>

		<div className="order-1 grid min-w-0 items-start gap-5 xl:order-2 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
			<PrototypeActionList
				actions={dashboard.actionInbox}
				emphasized={emphasis === "action"}
				onSelect={onSelectAction}
				selectedId={selectedAction?.id}
			/>

			<div className="grid min-w-0 gap-5">
				<PrototypeRelatedWork actionType={selectedAction?.type} dashboard={dashboard} />

				<PrototypeWeekList
					chartData={dashboard.forecastChartData}
					emphasized={emphasis === "week"}
					onSelect={onSelectWeek}
					selectedWeek={selectedWeek}
				/>
			</div>
		</div>
	</div>
);
