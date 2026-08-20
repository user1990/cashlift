import { formatCurrency, formatPreciseCompactCurrency } from "@/modules/money/format";
import { cn } from "@/ui/utils/cn";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import {
	ACTION_BEAT_LABELS,
	getPrototypeFactLine,
	type PrototypeCashAction,
	PrototypeHeader,
	PrototypePanel,
} from "./prototypeShared";

type DayStageId = "collect" | "approve" | "outlook" | "cut" | "remaining";

type DayStagesVariantProps = {
	dashboard: DashboardViewModel;
	onSelectAction: (id: string) => void;
	onSelectStage: (stage: DayStageId) => void;
	onSelectWeek: (week: string) => void;
	selectedAction?: PrototypeCashAction;
	selectedStage: DayStageId;
	selectedWeek?: string;
};

const DAY_STAGES = [
	{ id: "collect", label: "Collect" },
	{ id: "approve", label: "Approve" },
	{ id: "outlook", label: "Outlook" },
	{ id: "cut", label: "Cut" },
	{ id: "remaining", label: "Cash remaining" },
] as const satisfies readonly { id: DayStageId; label: string }[];

export const DayStagesVariant = ({
	dashboard,
	onSelectAction,
	onSelectStage,
	onSelectWeek,
	selectedAction,
	selectedStage,
	selectedWeek,
}: DayStagesVariantProps) => (
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
			<PrototypePanel title="Today">
				<div className="mb-4 flex flex-wrap gap-1">
					{DAY_STAGES.map(({ id, label }) => (
						<button
							key={id}
							type="button"
							onClick={() => onSelectStage(id)}
							className={cn(
								"min-h-11 rounded-lg px-3 text-m outline-none transition-[background-color,box-shadow] duration-150",
								"focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
								id === selectedStage
									? "bg-primary/10 text-panel-foreground ring-1 ring-primary/40"
									: "text-muted-foreground hover:bg-white/5 hover:text-panel-foreground",
							)}
						>
							{label}
						</button>
					))}
				</div>

				<DayStageSurface
					dashboard={dashboard}
					selectedStage={selectedStage}
					selectedWeek={selectedWeek}
					onSelectWeek={onSelectWeek}
				/>
			</PrototypePanel>
		</div>

		<div className="order-3">
			<PrototypePanel title="Ranked Cash Actions">
				<ul className="grid gap-1">
					{dashboard.actionInbox.map(({ id, title, type }) => (
						<li key={id}>
							<button
								type="button"
								onClick={() => onSelectAction(id)}
								className={cn(
									"flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-m outline-none transition-[background-color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
									id === selectedAction?.id
										? "bg-white/5 text-panel-foreground"
										: "text-muted-foreground hover:bg-white/5 hover:text-panel-foreground",
								)}
							>
								<span>{title}</span>

								<span className="text-s">{ACTION_BEAT_LABELS[type]}</span>
							</button>
						</li>
					))}
				</ul>
			</PrototypePanel>
		</div>
	</div>
);

export function getDayStageFromActionType(type: PrototypeCashAction["type"] | undefined): DayStageId {
	if (type === "collection") {
		return "collect";
	}

	if (type === "approval") {
		return "approve";
	}

	if (type === "vendor-leak") {
		return "cut";
	}

	if (type === "forecast") {
		return "outlook";
	}

	return "remaining";
}

function DayStageSurface({
	dashboard,
	onSelectWeek,
	selectedStage,
	selectedWeek,
}: {
	dashboard: DashboardViewModel;
	onSelectWeek: (week: string) => void;
	selectedStage: DayStageId;
	selectedWeek?: string;
}) {
	if (selectedStage === "collect") {
		return (
			<StageRows
				empty="No overdue collections."
				rows={dashboard.overdueInvoices.map(({ amountCents, client, id, owner }) => ({
					amount: formatCurrency(amountCents),
					id,
					meta: `Owner: ${owner}`,
					title: client,
				}))}
			/>
		);
	}

	if (selectedStage === "approve") {
		return (
			<StageRows
				empty="No pending spend requests."
				rows={dashboard.pendingApprovals.map(({ amountCents, id, requester, vendor }) => ({
					amount: formatCurrency(amountCents),
					id,
					meta: requester,
					title: vendor,
				}))}
			/>
		);
	}

	if (selectedStage === "cut") {
		return (
			<StageRows
				empty="No vendor leaks need action."
				rows={dashboard.vendorLeaks.map(({ amountCents, id, vendor }) => ({
					amount: formatCurrency(amountCents),
					id,
					title: vendor,
				}))}
			/>
		);
	}

	if (selectedStage === "outlook") {
		return (
			<ul className="grid gap-1">
				{dashboard.forecastChartData.map(({ balance, rowKey, week }) => (
					<li key={rowKey}>
						<button
							type="button"
							onClick={() => onSelectWeek(week)}
							className={cn(
								"flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left outline-none transition-[background-color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
								week === selectedWeek ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-white/5",
							)}
						>
							<span>{formatDashboardDate(week)}</span>

							<span className="font-mono">{formatPreciseCompactCurrency(Math.round(balance * 100))}</span>
						</button>
					</li>
				))}
			</ul>
		);
	}

	return (
		<div>
			<p className="font-mono font-semibold text-3xl+ text-panel-foreground">
				{formatPreciseCompactCurrency(dashboard.cashAvailableCents)}
			</p>

			<p className="mt-2 text-m text-muted-foreground">
				against a {formatPreciseCompactCurrency(dashboard.cashBufferTargetCents)} buffer
			</p>
		</div>
	);
}

function StageRows({
	empty,
	rows,
}: {
	empty: string;
	rows: Array<{ amount: string; id: string; title: string; meta?: string }>;
}) {
	return rows.length ? (
		<ul>
			{rows.map(({ amount, id, meta, title }) => (
				<li
					key={id}
					className="flex min-h-11 items-start justify-between gap-3 border-white/10 border-b py-3 last:border-b-0"
				>
					<span className="min-w-0">
						<span className="block font-semibold text-m+ text-panel-foreground">{title}</span>

						{meta && <span className="mt-1 block text-muted-foreground text-s">{meta}</span>}
					</span>

					<span className="font-mono">{amount}</span>
				</li>
			))}
		</ul>
	) : (
		<p className="text-m text-muted-foreground">{empty}</p>
	);
}
