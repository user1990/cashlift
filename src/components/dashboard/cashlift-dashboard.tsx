"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowUpRight,
	CalendarClock,
	CheckCircle2,
	CircleDollarSign,
	Gauge,
	Lightbulb,
	PiggyBank,
	ShieldCheck,
	Target,
	TrendingUp,
	WalletCards,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { z } from "zod";
import { AppButton } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ProgressMeter } from "@/components/ui/progress-meter";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { AppTextField } from "@/components/ui/text-field";
import {
	getDebtPayoffOrder,
	getEmergencyFundTarget,
	getGoalProgress,
	getMonthlyIncome,
	getMonthlyObligations,
	getNetWorth,
	getNetWorthDirection,
	getSafeToSpendToday,
	getSpendingLeaks,
	getSuggestedMonthlyContribution,
	getUnusedSubscriptionSavings,
	getUpcomingBills,
} from "@/lib/finance/calculations";
import {
	centsToDollars,
	formatCompactCurrency,
	formatCurrency,
	percentage,
} from "@/lib/finance/format";
import type { FinancialDataset } from "@/lib/finance/types";

type CashliftDashboardProps = {
	dataset: FinancialDataset;
};

const quickIncomeSchema = z.object({
	amount: z.number().min(1, "Enter a positive amount."),
	label: z.string().min(2, "Name the source."),
});

type QuickIncomeForm = z.infer<typeof quickIncomeSchema>;

export function CashliftDashboard({ dataset }: CashliftDashboardProps) {
	const dashboardQuery = useQuery({
		initialData: dataset,
		queryFn: async () => dataset,
		queryKey: ["cashlift-dashboard", dataset.profile.userId],
	});
	const activeDataset = dashboardQuery.data;
	const chartsReady = useHasMounted();
	const [debtStrategy, setDebtStrategy] = useState<"snowball" | "avalanche">(
		"avalanche",
	);
	const safeToSpend = getSafeToSpendToday(activeDataset);
	const monthlyIncome = getMonthlyIncome(activeDataset);
	const monthlyObligations = getMonthlyObligations(activeDataset);
	const upcomingBills = getUpcomingBills(
		activeDataset.bills,
		activeDataset.subscriptions,
	);
	const unusedSubscriptionSavings = getUnusedSubscriptionSavings(
		activeDataset.subscriptions,
	);
	const spendingLeaks = getSpendingLeaks(activeDataset.transactionPatterns);
	const payoffOrder = getDebtPayoffOrder(activeDataset.debts, debtStrategy);
	const emergencyFundTarget = getEmergencyFundTarget(
		activeDataset.profile.monthlyEssentialExpensesCents,
	);
	const netWorthDirection = getNetWorthDirection(
		activeDataset.netWorthSnapshots,
	);
	const dailyChallenge =
		activeDataset.dailyChallenges[
			new Date().getDate() % activeDataset.dailyChallenges.length
		];

	const netWorthChartData = activeDataset.netWorthSnapshots.map((snapshot) => ({
		netWorth: centsToDollars(getNetWorth(snapshot)),
		week: snapshot.weekStart.slice(5),
	}));

	const leakChartData = spendingLeaks.map((leak) => ({
		leak: centsToDollars(leak.monthlyLeakCents),
		merchant: leak.merchant.replace(" ", "\n"),
	}));

	const emergencyProgress =
		(activeDataset.profile.currentEmergencyFundCents /
			emergencyFundTarget.sixMonthsCents) *
		100;

	return (
		<main className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A]">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
				<DashboardHeader name={activeDataset.profile.displayName} />

				<section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
					<MetricCard
						accent="indigo"
						icon={<Gauge aria-hidden className="size-5" />}
						label="Safe to spend today"
						meta="After bills, minimum debt payments, and goal funding"
						value={formatCurrency(safeToSpend)}
					/>
					<MetricCard
						icon={<CircleDollarSign aria-hidden className="size-5" />}
						label="Projected monthly income"
						meta="Salary, retainer, and stable side work"
						value={formatCurrency(monthlyIncome)}
					/>
					<MetricCard
						icon={<WalletCards aria-hidden className="size-5" />}
						label="Locked obligations"
						meta="Bills, subscriptions, and debt minimums"
						value={formatCurrency(monthlyObligations)}
					/>
				</section>

				<section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
					<Panel>
						<PanelHeader
							eyebrow="Today"
							title="Money actions that move the number"
						/>
						<div className="grid gap-3 md:grid-cols-3">
							<ActionTile
								icon={<CheckCircle2 aria-hidden className="size-4" />}
								label={dailyChallenge.title}
								meta={dailyChallenge.action}
								value={`+${formatCurrency(dailyChallenge.impactCents)}`}
							/>
							<ActionTile
								icon={<Target aria-hidden className="size-4" />}
								label="Fund the highest priority goal"
								meta={`Move ${formatCurrency(
									getSuggestedMonthlyContribution(
										activeDataset.savingsGoals[0],
									) / 4,
								)} this week to stay on pace.`}
								value="Goal"
							/>
							<ActionTile
								icon={<ArrowUpRight aria-hidden className="size-4" />}
								label="Attack the first debt"
								meta={`${payoffOrder[0].label} is the next target by ${debtStrategy}.`}
								value={formatCompactCurrency(payoffOrder[0].balanceCents)}
							/>
						</div>
					</Panel>

					<QuickEntryPanel />
				</section>

				<section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
					<BillsPanel
						upcomingBills={upcomingBills}
						unusedSubscriptionSavings={unusedSubscriptionSavings}
					/>
					<NetWorthPanel
						chartData={netWorthChartData}
						chartsReady={chartsReady}
						changeCents={netWorthDirection.changeCents}
						currentCents={netWorthDirection.currentCents}
					/>
				</section>

				<section className="grid gap-4 xl:grid-cols-3">
					<SavingsGoalsPanel dataset={activeDataset} />
					<DebtPlannerPanel
						debts={payoffOrder}
						strategy={debtStrategy}
						onStrategyChange={setDebtStrategy}
					/>
					<EmergencyFundPanel
						currentCents={activeDataset.profile.currentEmergencyFundCents}
						progress={emergencyProgress}
						sixMonthTargetCents={emergencyFundTarget.sixMonthsCents}
						threeMonthTargetCents={emergencyFundTarget.threeMonthsCents}
					/>
				</section>

				<section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
					<LeakDetectorPanel
						chartData={leakChartData}
						chartsReady={chartsReady}
						leaks={spendingLeaks}
					/>
					<IncomeIdeasPanel dataset={activeDataset} />
				</section>

				<p className="pb-4 text-xs leading-5 text-[#6B6B6B]">
					Cashlift provides educational suggestions from your inputs. It is not
					financial, legal, or tax advice.
				</p>
			</div>
		</main>
	);
}

function useHasMounted() {
	return useSyncExternalStore(
		() => () => undefined,
		() => true,
		() => false,
	);
}

function DashboardHeader({ name }: { name: string }) {
	return (
		<header className="sticky top-0 z-20 -mx-4 border-b border-[#E8E8EC]/90 bg-[#FAFAFA]/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
			<div className="mx-auto flex max-w-[1280px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-normal text-indigo-600">
						Cashlift
					</p>
					<h1 className="text-2xl font-semibold tracking-normal text-[#0A0A0A] sm:text-3xl">
						{name}&apos;s cashflow command center
					</h1>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<AppButton variant="ghost">Review leaks</AppButton>
					<AppButton variant="primary">
						<PiggyBank aria-hidden className="size-4" />
						Move cash
					</AppButton>
				</div>
			</div>
		</header>
	);
}

function MetricCard({
	accent,
	icon,
	label,
	meta,
	value,
}: {
	accent?: "indigo";
	icon: React.ReactNode;
	label: string;
	meta: string;
	value: string;
}) {
	return (
		<Panel
			className={
				accent === "indigo" ? "border-indigo-200 bg-indigo-50/40" : undefined
			}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-[#6B6B6B]">{label}</p>
					<p className="mt-2 font-mono text-4xl font-semibold tracking-normal text-[#0A0A0A]">
						{value}
					</p>
					<p className="mt-2 max-w-sm text-sm leading-5 text-[#6B6B6B]">
						{meta}
					</p>
				</div>
				<div className="rounded-lg border border-[#E8E8EC] bg-white p-2 text-indigo-600">
					{icon}
				</div>
			</div>
		</Panel>
	);
}

function ActionTile({
	icon,
	label,
	meta,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	meta: string;
	value: string;
}) {
	return (
		<div className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3">
			<div className="mb-3 flex items-center justify-between gap-3">
				<span className="rounded-md bg-white p-2 text-indigo-600">{icon}</span>
				<span className="font-mono text-sm font-semibold text-[#0A0A0A]">
					{value}
				</span>
			</div>
			<p className="text-sm font-semibold text-[#0A0A0A]">{label}</p>
			<p className="mt-1 text-xs leading-5 text-[#6B6B6B]">{meta}</p>
		</div>
	);
}

function QuickEntryPanel() {
	const form = useForm<QuickIncomeForm>({
		defaultValues: {
			amount: 75,
			label: "Marketplace sale",
		},
		resolver: zodResolver(quickIncomeSchema),
	});
	const preview = useWatch({ control: form.control, name: "amount" });

	return (
		<Panel>
			<PanelHeader eyebrow="Manual input" title="Log a quick cash lift" />
			<form
				className="space-y-3"
				onSubmit={form.handleSubmit(() => form.reset())}
			>
				<Controller
					control={form.control}
					name="label"
					render={({ field }) => (
						<AppTextField
							label="Source"
							onBlur={field.onBlur}
							onChange={field.onChange}
							placeholder="Overtime, resale, refund"
							value={field.value}
						/>
					)}
				/>
				<Controller
					control={form.control}
					name="amount"
					render={({ field }) => (
						<AppTextField
							inputMode="decimal"
							label="Amount"
							onBlur={field.onBlur}
							onChange={(value) => field.onChange(Number(value))}
							placeholder="75"
							value={String(field.value)}
						/>
					)}
				/>
				<div className="flex items-center justify-between gap-3 rounded-lg bg-[#FAFAFA] p-3 text-sm">
					<span className="text-[#6B6B6B]">Potential monthly lift</span>
					<span className="font-mono font-semibold">
						{formatCurrency((Number(preview) || 0) * 100)}
					</span>
				</div>
				<AppButton className="w-full" type="submit" variant="primary">
					Save manual entry
				</AppButton>
			</form>
		</Panel>
	);
}

function BillsPanel({
	upcomingBills,
	unusedSubscriptionSavings,
}: {
	upcomingBills: Array<{
		amountCents: number;
		daysUntilDue: number;
		id: string;
		label: string;
	}>;
	unusedSubscriptionSavings: number;
}) {
	return (
		<Panel>
			<PanelHeader
				action={
					<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
						{formatCurrency(unusedSubscriptionSavings)} leak
					</span>
				}
				eyebrow="Bills + subscriptions"
				title="Upcoming obligations"
			/>
			<div className="divide-y divide-[#E8E8EC]">
				{upcomingBills.map((item) => (
					<div
						className="flex items-center justify-between gap-4 py-3"
						key={item.id}
					>
						<div className="flex items-center gap-3">
							<span className="rounded-md bg-[#F7F7F8] p-2 text-[#6B6B6B]">
								<CalendarClock aria-hidden className="size-4" />
							</span>
							<div>
								<p className="text-sm font-medium text-[#0A0A0A]">
									{item.label}
								</p>
								<p className="text-xs text-[#6B6B6B]">
									Due in {item.daysUntilDue} day
									{item.daysUntilDue === 1 ? "" : "s"}
								</p>
							</div>
						</div>
						<span className="font-mono text-sm font-semibold">
							{formatCurrency(item.amountCents)}
						</span>
					</div>
				))}
			</div>
		</Panel>
	);
}

function SavingsGoalsPanel({ dataset }: { dataset: FinancialDataset }) {
	return (
		<Panel>
			<PanelHeader eyebrow="Goals" title="Savings pace" />
			<div className="space-y-4">
				{dataset.savingsGoals.map((goal) => (
					<div className="space-y-2" key={goal.id}>
						<ProgressMeter label={goal.label} value={getGoalProgress(goal)} />
						<div className="flex items-center justify-between gap-3 text-xs text-[#6B6B6B]">
							<span>{formatCurrency(goal.currentCents)} saved</span>
							<span>
								Suggest {formatCurrency(getSuggestedMonthlyContribution(goal))}
								/mo
							</span>
						</div>
					</div>
				))}
			</div>
		</Panel>
	);
}

function DebtPlannerPanel({
	debts,
	onStrategyChange,
	strategy,
}: {
	debts: FinancialDataset["debts"];
	onStrategyChange: (strategy: "snowball" | "avalanche") => void;
	strategy: "snowball" | "avalanche";
}) {
	return (
		<Panel>
			<PanelHeader
				action={
					<SegmentedControl
						label="Debt payoff strategy"
						onChange={onStrategyChange}
						options={[
							{ label: "Avalanche", value: "avalanche" },
							{ label: "Snowball", value: "snowball" },
						]}
						value={strategy}
					/>
				}
				eyebrow="Debt"
				title="Payoff order"
			/>
			<div className="space-y-3">
				{debts.map((debt, index) => (
					<div
						className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3"
						key={debt.id}
					>
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-semibold text-[#0A0A0A]">
								{index + 1}. {debt.label}
							</p>
							<span className="font-mono text-sm">
								{formatCurrency(debt.balanceCents)}
							</span>
						</div>
						<p className="mt-1 text-xs text-[#6B6B6B]">
							{percentage(debt.interestRate)} APR · minimum{" "}
							{formatCurrency(debt.minimumPaymentCents)}
						</p>
					</div>
				))}
			</div>
		</Panel>
	);
}

function NetWorthPanel({
	chartData,
	chartsReady,
	changeCents,
	currentCents,
}: {
	chartData: Array<{ netWorth: number; week: string }>;
	chartsReady: boolean;
	changeCents: number;
	currentCents: number;
}) {
	return (
		<Panel>
			<PanelHeader
				action={
					<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
						<TrendingUp aria-hidden className="size-3" />
						{formatCurrency(changeCents)} WoW
					</span>
				}
				eyebrow="Direction"
				title={`Net worth ${formatCurrency(currentCents)}`}
			/>
			<div className="h-64 min-w-0">
				{chartsReady ? (
					<ResponsiveContainer height="100%" width="100%">
						<AreaChart data={chartData}>
							<CartesianGrid stroke="#E8E8EC" vertical={false} />
							<XAxis axisLine={false} dataKey="week" tickLine={false} />
							<YAxis
								axisLine={false}
								tickFormatter={(value) => `$${value}k`}
								tickLine={false}
							/>
							<Tooltip formatter={(value) => [`$${value}`, "Net worth"]} />
							<Area
								dataKey="netWorth"
								fill="#6366F1"
								fillOpacity={0.12}
								stroke="#6366F1"
								strokeWidth={2}
								type="monotone"
							/>
						</AreaChart>
					</ResponsiveContainer>
				) : (
					<ChartPlaceholder />
				)}
			</div>
		</Panel>
	);
}

function EmergencyFundPanel({
	currentCents,
	progress,
	sixMonthTargetCents,
	threeMonthTargetCents,
}: {
	currentCents: number;
	progress: number;
	sixMonthTargetCents: number;
	threeMonthTargetCents: number;
}) {
	return (
		<Panel>
			<PanelHeader eyebrow="Safety" title="Emergency fund target" />
			<div className="space-y-4">
				<div className="rounded-lg bg-[#FAFAFA] p-4">
					<div className="mb-3 flex items-center gap-2 text-indigo-600">
						<ShieldCheck aria-hidden className="size-5" />
						<span className="text-sm font-semibold text-[#0A0A0A]">
							Six-month runway
						</span>
					</div>
					<p className="font-mono text-3xl font-semibold">
						{formatCurrency(sixMonthTargetCents)}
					</p>
					<p className="mt-1 text-sm text-[#6B6B6B]">
						Three-month floor: {formatCurrency(threeMonthTargetCents)}
					</p>
				</div>
				<ProgressMeter
					label={`${formatCurrency(currentCents)} ready`}
					value={progress}
				/>
			</div>
		</Panel>
	);
}

function LeakDetectorPanel({
	chartData,
	chartsReady,
	leaks,
}: {
	chartData: Array<{ leak: number; merchant: string }>;
	chartsReady: boolean;
	leaks: ReturnType<typeof getSpendingLeaks>;
}) {
	const topLeak = leaks[0];

	return (
		<Panel>
			<PanelHeader
				action={
					<span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
						Cut {formatCurrency(topLeak.monthlyLeakCents)}/mo first
					</span>
				}
				eyebrow="Leaks"
				title="Recurring unnecessary spend"
			/>
			<div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
				<div className="h-56 min-w-0">
					{chartsReady ? (
						<ResponsiveContainer height="100%" width="100%">
							<BarChart data={chartData}>
								<CartesianGrid stroke="#E8E8EC" vertical={false} />
								<XAxis axisLine={false} dataKey="merchant" tickLine={false} />
								<YAxis axisLine={false} tickLine={false} />
								<Tooltip formatter={(value) => [`$${value}`, "Monthly leak"]} />
								<Bar dataKey="leak" fill="#6366F1" radius={[6, 6, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<ChartPlaceholder />
					)}
				</div>
				<div className="space-y-2">
					{leaks.slice(0, 4).map((leak) => (
						<div
							className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3"
							key={leak.id}
						>
							<div className="flex items-center justify-between gap-3">
								<p className="text-sm font-semibold">{leak.merchant}</p>
								<p className="font-mono text-sm">
									{formatCurrency(leak.monthlyLeakCents)}
								</p>
							</div>
							<p className="mt-1 text-xs text-[#6B6B6B]">
								{leak.monthlyOccurrences}x/month ·{" "}
								{percentage(leak.avoidableScore)} avoidable
							</p>
						</div>
					))}
				</div>
			</div>
		</Panel>
	);
}

function ChartPlaceholder() {
	return (
		<div className="flex h-full min-h-0 items-end gap-2 rounded-lg bg-[#FAFAFA] p-4">
			{[48, 72, 56, 84, 68].map((height) => (
				<div
					className="flex-1 rounded-t-md bg-indigo-100"
					key={height}
					style={{ height: `${height}%` }}
				/>
			))}
		</div>
	);
}

function IncomeIdeasPanel({ dataset }: { dataset: FinancialDataset }) {
	const totalPotential = useMemo(
		() =>
			dataset.incomeIdeas.reduce(
				(total, idea) => total + idea.expectedMonthlyCents,
				0,
			),
		[dataset.incomeIdeas],
	);

	return (
		<Panel>
			<PanelHeader
				action={
					<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
						{formatCurrency(totalPotential)}/mo
					</span>
				}
				eyebrow="Income"
				title="Ideas board"
			/>
			<div className="grid gap-3 md:grid-cols-3">
				{dataset.incomeIdeas.map((idea) => (
					<div
						className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3"
						key={idea.id}
					>
						<div className="mb-3 flex items-center justify-between gap-3">
							<span className="rounded-md bg-white p-2 text-indigo-600">
								<Lightbulb aria-hidden className="size-4" />
							</span>
							<span className="font-mono text-sm font-semibold">
								{formatCurrency(idea.expectedMonthlyCents)}
							</span>
						</div>
						<p className="text-sm font-semibold">{idea.title}</p>
						<p className="mt-1 text-xs leading-5 text-[#6B6B6B]">
							{idea.nextStep}
						</p>
					</div>
				))}
			</div>
		</Panel>
	);
}
