import type { KeyboardEvent } from "react";
import { formatCurrency, formatPreciseCompactCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import { cn } from "@/ui/utils/cn";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";

export type PrototypeVariantId = "a" | "b" | "c" | "d";

export type PrototypeCashAction = DashboardViewModel["actionInbox"][number];

export type PrototypeEmphasis = "action" | "week";

export const PROTOTYPE_VARIANTS = [
	{ href: "?variant=a", id: "a", label: "A · List stack" },
	{ href: "?variant=b", id: "b", label: "B · Workbench" },
	{ href: "?variant=c", id: "c", label: "C · Outlook first" },
	{ href: "?variant=d", id: "d", label: "D · Day stages" },
] as const satisfies readonly { href: string; id: PrototypeVariantId; label: string }[];

export const ACTION_BEAT_LABELS = {
	approval: "Approve",
	"cash-buffer": "Cash remaining",
	collection: "Collect",
	forecast: "Outlook",
	"vendor-leak": "Cut",
} as const;

export const PROTOTYPE_PANEL_CLASS_NAME =
	"rounded-lg border border-white/10 bg-shell-elevated/45 p-5 text-shell-foreground shadow-none backdrop-blur-sm max-md:bg-shell-elevated/90 max-md:backdrop-blur-none";

export function getPrototypeVariant(value: string | null): PrototypeVariantId {
	if (value === "b" || value === "c" || value === "d") {
		return value;
	}

	return "a";
}

export function getPrototypeFactLine({
	actionTitle,
	cashAvailableCents,
	cashBufferTargetCents,
}: {
	cashAvailableCents: MoneyCents;
	cashBufferTargetCents: MoneyCents;
	actionTitle?: string;
}) {
	const remaining = `Cash remaining ${formatPreciseCompactCurrency(cashAvailableCents)} against a ${formatPreciseCompactCurrency(cashBufferTargetCents)} buffer`;

	return actionTitle ? `${actionTitle}. ${remaining}` : remaining;
}

export function getPrototypeWeekFactLine({
	cashAvailableCents,
	cashBufferTargetCents,
	week,
	weekBalanceCents,
}: {
	cashAvailableCents: MoneyCents;
	cashBufferTargetCents: MoneyCents;
	week: string;
	weekBalanceCents: MoneyCents;
}) {
	return `${formatDashboardDate(week)} ends at ${formatPreciseCompactCurrency(weekBalanceCents)}. Cash remaining ${formatPreciseCompactCurrency(cashAvailableCents)} against a ${formatPreciseCompactCurrency(cashBufferTargetCents)} buffer`;
}

export const PrototypePanel = ({ children, title }: { children: React.ReactNode; title: string }) => (
	<section className={PROTOTYPE_PANEL_CLASS_NAME}>
		<h2 className="mb-4 text-l+ text-panel-foreground">{title}</h2>

		{children}
	</section>
);

export const PrototypeHeader = ({ companyName, factLine }: { companyName: string; factLine: string }) => (
	<header className="min-w-0">
		<h1 className="font-semibold text-3xl+ text-panel-foreground tracking-normal">{companyName}</h1>

		<p className="mt-1 text-m+ text-shell-muted">{factLine}</p>
	</header>
);

type PrototypeActionListProps = {
	actions: PrototypeCashAction[];
	onSelect: (id: string) => void;
	emphasized?: boolean;
	selectedId?: string;
};

export const PrototypeActionList = ({
	actions,
	emphasized = false,
	onSelect,
	selectedId,
}: PrototypeActionListProps) => {
	const selectedIndex = actions.findIndex(({ id }) => id === selectedId);

	return (
		<PrototypePanel title="Cash actions">
			{actions.length ? (
				<div
					aria-activedescendant={selectedId ? `prototype-action-${selectedId}` : undefined}
					aria-label="Cash actions"
					role="listbox"
					tabIndex={-1}
					onKeyDown={(event) =>
						handleListKeyDown(event, selectedIndex, actions.length, (index) => {
							const next = actions[index];

							if (next) {
								onSelect(next.id);
								document.getElementById(`prototype-action-${next.id}`)?.focus();
							}
						})
					}
				>
					{actions.map((action) => (
						<PrototypeActionRow
							key={action.id}
							action={action}
							emphasized={emphasized}
							onSelect={onSelect}
							selected={action.id === selectedId}
						/>
					))}
				</div>
			) : (
				<p className="text-m text-muted-foreground">No open Cash Actions for this range.</p>
			)}
		</PrototypePanel>
	);
};

const PrototypeActionRow = ({
	action,
	emphasized,
	onSelect,
	selected,
}: {
	action: PrototypeCashAction;
	emphasized: boolean;
	onSelect: (id: string) => void;
	selected: boolean;
}) => {
	const { description, dueDate, id, impactCents, owner, title, type } = action;

	return (
		<button
			aria-selected={selected}
			id={`prototype-action-${id}`}
			role="option"
			tabIndex={selected ? 0 : -1}
			type="button"
			onClick={() => onSelect(id)}
			className={getSelectableRowClassName(emphasized, selected)}
		>
			<span className="min-w-0">
				<span className="mb-1 flex flex-wrap gap-x-2 text-muted-foreground text-s">
					<span>{ACTION_BEAT_LABELS[type]}</span>

					<span>Due {formatDashboardDate(dueDate)}</span>

					<span>{owner}</span>
				</span>

				<span className="block font-semibold text-m+ text-panel-foreground">{title}</span>

				<span className="mt-1 block text-m text-muted-foreground leading-6">{description}</span>
			</span>

			<span className="shrink-0 font-mono font-semibold text-l+ text-panel-foreground">
				{formatCurrency(impactCents)}
			</span>
		</button>
	);
};

type PrototypeWeekListProps = {
	chartData: DashboardViewModel["forecastChartData"];
	onSelect: (week: string) => void;
	emphasized?: boolean;
	selectedWeek?: string;
};

export const PrototypeWeekList = ({
	chartData,
	emphasized = false,
	onSelect,
	selectedWeek,
}: PrototypeWeekListProps) => {
	const selectedIndex = chartData.findIndex(({ week }) => week === selectedWeek);

	return (
		<PrototypePanel title="13-week cash outlook">
			{chartData.length ? (
				<div
					aria-activedescendant={selectedWeek ? `prototype-week-${selectedWeek}` : undefined}
					aria-label="13-week cash outlook weeks"
					role="listbox"
					tabIndex={-1}
					onKeyDown={(event) =>
						handleListKeyDown(event, selectedIndex, chartData.length, (index) => {
							const next = chartData[index];

							if (next) {
								onSelect(next.week);
								document.getElementById(`prototype-week-${next.week}`)?.focus();
							}
						})
					}
					className="grid gap-1"
				>
					{chartData.map(({ balance, rowKey, week }) => {
						const selected = week === selectedWeek;

						return (
							<button
								key={rowKey}
								aria-selected={selected}
								id={`prototype-week-${week}`}
								role="option"
								tabIndex={selected ? 0 : -1}
								type="button"
								onClick={() => onSelect(week)}
								className={getSelectableRowClassName(emphasized, selected)}
							>
								<span>{formatDashboardDate(week)}</span>

								<span className="font-mono text-panel-foreground">
									{formatPreciseCompactCurrency(Math.round(balance * 100))}
								</span>
							</button>
						);
					})}
				</div>
			) : (
				<p className="text-m text-muted-foreground">No 13-week outlook for this range.</p>
			)}
		</PrototypePanel>
	);
};

export const PrototypeRelatedWork = ({
	actionType,
	dashboard,
}: {
	dashboard: DashboardViewModel;
	actionType?: PrototypeCashAction["type"];
}) => {
	if (actionType === "approval") {
		return (
			<PrototypePanel title="Approve">
				<PrototypeSimpleList
					empty="No pending spend requests."
					items={dashboard.pendingApprovals.map(({ amountCents, id, requester, vendor }) => ({
						amountCents,
						id,
						meta: requester,
						title: vendor,
					}))}
				/>
			</PrototypePanel>
		);
	}

	if (actionType === "collection") {
		return (
			<PrototypePanel title="Collect">
				<PrototypeSimpleList
					empty="No overdue collections."
					items={dashboard.overdueInvoices.map(({ amountCents, client, id, owner }) => ({
						amountCents,
						id,
						meta: `Owner: ${owner}`,
						title: client,
					}))}
				/>
			</PrototypePanel>
		);
	}

	if (actionType === "vendor-leak") {
		return (
			<PrototypePanel title="Cut">
				<PrototypeSimpleList
					empty="No vendor leaks need action."
					items={dashboard.vendorLeaks.map(({ amountCents, id, vendor }) => ({
						amountCents,
						id,
						title: vendor,
					}))}
				/>
			</PrototypePanel>
		);
	}

	return (
		<PrototypePanel title="Cash remaining">
			<p className="font-mono font-semibold text-3xl+ text-panel-foreground">
				{formatPreciseCompactCurrency(dashboard.cashAvailableCents)}
			</p>

			<p className="mt-2 text-m text-muted-foreground">
				against a {formatPreciseCompactCurrency(dashboard.cashBufferTargetCents)} buffer
			</p>
		</PrototypePanel>
	);
};

type PrototypeSimpleItem = {
	amountCents: MoneyCents;
	id: string;
	title: string;
	meta?: string;
};

const PrototypeSimpleList = ({ empty, items }: { empty: string; items: PrototypeSimpleItem[] }) =>
	items.length ? (
		<ul>
			{items.map(({ amountCents, id, meta, title }) => (
				<li
					key={id}
					className="flex min-h-11 items-start justify-between gap-3 border-white/10 border-b py-3 last:border-b-0"
				>
					<span className="min-w-0">
						<span className="block font-semibold text-m+ text-panel-foreground">{title}</span>

						{meta && <span className="mt-1 block text-muted-foreground text-s">{meta}</span>}
					</span>

					<span className="shrink-0 font-mono text-m+">{formatCurrency(amountCents)}</span>
				</li>
			))}
		</ul>
	) : (
		<p className="text-m text-muted-foreground">{empty}</p>
	);

export function getSelectableRowClassName(emphasized: boolean, selected: boolean) {
	return cn(
		"grid min-h-11 w-full gap-3 rounded-lg px-3 py-3 text-left outline-none transition-[background-color,box-shadow] duration-150 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
		"focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
		selected && emphasized && "bg-primary/10 ring-1 ring-primary/40",
		selected && !emphasized && "bg-white/5",
		!selected && "hover:bg-white/5",
	);
}

export function getSelectedAction(actions: PrototypeCashAction[], actionId: string | undefined) {
	return actions.find(({ id }) => id === actionId) ?? actions[0];
}

export function getSelectedWeek(
	chartData: DashboardViewModel["forecastChartData"],
	week: string | undefined,
	lowestProjectedCashDate: string | undefined,
) {
	if (week && chartData.some((point) => point.week === week)) {
		return week;
	}

	if (lowestProjectedCashDate && chartData.some((point) => point.week === lowestProjectedCashDate)) {
		return lowestProjectedCashDate;
	}

	return chartData[0]?.week;
}

function handleListKeyDown(
	event: KeyboardEvent<HTMLDivElement>,
	selectedIndex: number,
	length: number,
	selectIndex: (index: number) => void,
) {
	if (length === 0) {
		return;
	}

	const currentIndex = selectedIndex < 0 ? 0 : selectedIndex;

	if (event.key === "ArrowDown" || event.key === "ArrowRight") {
		event.preventDefault();
		selectIndex(Math.min(currentIndex + 1, length - 1));
		return;
	}

	if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
		event.preventDefault();
		selectIndex(Math.max(currentIndex - 1, 0));
		return;
	}

	if (event.key === "Home") {
		event.preventDefault();
		selectIndex(0);
		return;
	}

	if (event.key === "End") {
		event.preventDefault();
		selectIndex(length - 1);
	}
}
