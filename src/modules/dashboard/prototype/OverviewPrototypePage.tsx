"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FinancialDataset } from "@/modules/workspace/types";
import { buildDashboardViewModel } from "../view-model";
import { ActionStackVariant } from "./ActionStackVariant";
import { DayStagesVariant, getDayStageFromActionType } from "./DayStagesVariant";
import { OutlookLedVariant } from "./OutlookLedVariant";
import {
	getPrototypeVariant,
	getSelectedAction,
	getSelectedWeek,
	PROTOTYPE_VARIANTS,
	type PrototypeEmphasis,
} from "./prototypeShared";
import { WorkbenchVariant } from "./WorkbenchVariant";

type OverviewPrototypePageProps = {
	dataset: FinancialDataset;
};

export const OverviewPrototypePage = ({ dataset }: OverviewPrototypePageProps) => {
	const searchParams = useSearchParams();
	const variant = getPrototypeVariant(searchParams.get("variant"));
	const dashboard = buildDashboardViewModel({
		dataset,
		role: dataset.profile.defaultRole,
	});
	const [actionId, setActionId] = useState(dashboard.actionInbox[0]?.id);
	const [emphasis, setEmphasis] = useState<PrototypeEmphasis>("action");
	const [stage, setStage] = useState(getDayStageFromActionType(dashboard.actionInbox[0]?.type));
	const [week, setWeek] = useState(dashboard.lowestProjectedCashDate);
	const selectedAction = getSelectedAction(dashboard.actionInbox, actionId);
	const selectedWeek = getSelectedWeek(dashboard.forecastChartData, week, dashboard.lowestProjectedCashDate);

	const selectAction = (id: string) => {
		const nextAction = dashboard.actionInbox.find(({ id: cashActionId }) => cashActionId === id);

		setActionId(id);
		setEmphasis("action");
		setStage(getDayStageFromActionType(nextAction?.type));
	};

	const selectWeek = (nextWeek: string) => {
		if (nextWeek !== selectedWeek) {
			setWeek(nextWeek);
		}

		setEmphasis("week");
		setStage("outlook");
	};

	return (
		<div className="pb-24">
			<p className="mb-4 text-muted-foreground text-s">Throwaway prototype. Not the live Overview.</p>

			{renderPrototypeVariant({
				dashboard,
				emphasis,
				onSelectAction: selectAction,
				onSelectStage: setStage,
				onSelectWeek: selectWeek,
				selectedAction,
				selectedStage: stage,
				selectedWeek,
				variant,
			})}

			<nav
				aria-label="Prototype variants"
				className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap justify-center gap-1 rounded-lg border border-white/10 bg-shell-elevated/90 p-2 shadow-none backdrop-blur-md max-md:backdrop-blur-none"
			>
				{PROTOTYPE_VARIANTS.map(({ href, id, label }) => (
					<Link
						key={id}
						aria-current={id === variant ? "page" : undefined}
						href={href}
						className={
							id === variant
								? "inline-flex min-h-11 items-center rounded-lg bg-primary/10 px-3 text-m text-panel-foreground ring-1 ring-primary/40"
								: "inline-flex min-h-11 items-center rounded-lg px-3 text-m text-muted-foreground hover:bg-white/5 hover:text-panel-foreground"
						}
					>
						{label}
					</Link>
				))}
			</nav>
		</div>
	);
};

function renderPrototypeVariant({
	dashboard,
	emphasis,
	onSelectAction,
	onSelectStage,
	onSelectWeek,
	selectedAction,
	selectedStage,
	selectedWeek,
	variant,
}: {
	dashboard: ReturnType<typeof buildDashboardViewModel>;
	emphasis: PrototypeEmphasis;
	onSelectAction: (id: string) => void;
	onSelectStage: (stage: ReturnType<typeof getDayStageFromActionType>) => void;
	onSelectWeek: (week: string) => void;
	selectedStage: ReturnType<typeof getDayStageFromActionType>;
	variant: ReturnType<typeof getPrototypeVariant>;
	selectedAction?: ReturnType<typeof getSelectedAction>;
	selectedWeek?: string;
}) {
	if (variant === "b") {
		return (
			<WorkbenchVariant
				dashboard={dashboard}
				emphasis={emphasis}
				onSelectAction={onSelectAction}
				onSelectWeek={onSelectWeek}
				selectedAction={selectedAction}
				selectedWeek={selectedWeek}
			/>
		);
	}

	if (variant === "c") {
		return (
			<OutlookLedVariant
				dashboard={dashboard}
				emphasis={emphasis}
				onSelectAction={onSelectAction}
				onSelectWeek={onSelectWeek}
				selectedAction={selectedAction}
				selectedWeek={selectedWeek}
			/>
		);
	}

	if (variant === "d") {
		return (
			<DayStagesVariant
				dashboard={dashboard}
				onSelectAction={onSelectAction}
				onSelectStage={onSelectStage}
				onSelectWeek={onSelectWeek}
				selectedAction={selectedAction}
				selectedStage={selectedStage}
				selectedWeek={selectedWeek}
			/>
		);
	}

	return (
		<ActionStackVariant
			dashboard={dashboard}
			emphasis={emphasis}
			onSelectAction={onSelectAction}
			onSelectWeek={onSelectWeek}
			selectedAction={selectedAction}
			selectedWeek={selectedWeek}
		/>
	);
}
