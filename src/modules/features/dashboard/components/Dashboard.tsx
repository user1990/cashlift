"use client";

import {
	ArrowUpRight,
	CheckCircle2,
	CircleDollarSign,
	Gauge,
	Target,
	WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FinancialDataset } from "@/modules/base/finance/types";
import { getSuggestedMonthlyContribution } from "@/modules/base/finance/utils";
import {
	formatCompactCurrency,
	formatCurrency,
} from "@/modules/common/money/format";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { useMounted } from "../hooks/useMounted";
import type { DebtStrategy } from "../types";
import { buildDashboardViewModel } from "../view-model";
import { ActionTile } from "./ActionTile";
import { BillsPanel } from "./BillsPanel";
import { DashboardHeader } from "./DashboardHeader";
import { DebtPlannerPanel } from "./DebtPlannerPanel";
import { EmergencyFundPanel } from "./EmergencyFundPanel";
import { IncomeIdeasPanel } from "./IncomeIdeasPanel";
import { LeakDetectorPanel } from "./LeakDetectorPanel";
import { MetricCard } from "./MetricCard";
import { NetWorthPanel } from "./NetWorthPanel";
import { QuickEntryPanel } from "./QuickEntryPanel";
import { SavingsGoalsPanel } from "./SavingsGoalsPanel";

type DashboardProps = {
	dataset: FinancialDataset;
};

export const Dashboard = ({ dataset }: DashboardProps) => {
	const chartsReady = useMounted();
	const [debtStrategy, setDebtStrategy] = useState<DebtStrategy>("avalanche");
	const dashboard = useMemo(
		() => buildDashboardViewModel({ dataset, debtStrategy }),
		[dataset, debtStrategy],
	);

	return (
		<main className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A]">
			<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
				<DashboardHeader name={dataset.profile.displayName} />

				<section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
					<MetricCard
						accent="indigo"
						icon={<Gauge aria-hidden className="size-5" />}
						label="Safe to spend today"
						meta="After bills, minimum debt payments, and goal funding"
						value={formatCurrency(dashboard.safeToSpend)}
					/>

					<MetricCard
						icon={<CircleDollarSign aria-hidden className="size-5" />}
						label="Projected monthly income"
						meta="Salary, retainer, and stable side work"
						value={formatCurrency(dashboard.monthlyIncome)}
					/>

					<MetricCard
						icon={<WalletCards aria-hidden className="size-5" />}
						label="Locked obligations"
						meta="Bills, subscriptions, and debt minimums"
						value={formatCurrency(dashboard.monthlyObligations)}
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
								label={dashboard.dailyChallenge?.title ?? "Daily challenge"}
								meta={
									dashboard.dailyChallenge?.action ??
									"No challenge available for today."
								}
								value={`+${formatCurrency(dashboard.dailyChallenge?.impactCents ?? 0)}`}
							/>

							<ActionTile
								icon={<Target aria-hidden className="size-4" />}
								label="Fund the highest priority goal"
								meta={`Move ${formatCurrency(
									(dashboard.firstGoal
										? getSuggestedMonthlyContribution(dashboard.firstGoal)
										: 0) / 4,
								)} this week to stay on pace.`}
								value="Goal"
							/>

							<ActionTile
								icon={<ArrowUpRight aria-hidden className="size-4" />}
								label="Attack the first debt"
								meta={
									dashboard.firstDebt
										? `${dashboard.firstDebt.label} is the next target by ${debtStrategy}.`
										: `No debt target available for ${debtStrategy}.`
								}
								value={formatCompactCurrency(
									dashboard.firstDebt?.balanceCents ?? 0,
								)}
							/>
						</div>
					</Panel>

					<QuickEntryPanel />
				</section>

				<section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
					<BillsPanel
						upcomingBills={dashboard.upcomingBills}
						unusedSubscriptionSavings={dashboard.unusedSubscriptionSavings}
					/>

					<NetWorthPanel
						chartData={dashboard.netWorthChartData}
						chartsReady={chartsReady}
						changeCents={dashboard.netWorthDirection.changeCents}
						currentCents={dashboard.netWorthDirection.currentCents}
					/>
				</section>

				<section className="grid gap-4 xl:grid-cols-3">
					<SavingsGoalsPanel dataset={dataset} />

					<DebtPlannerPanel
						debts={dashboard.payoffOrder}
						strategy={debtStrategy}
						onStrategyChange={setDebtStrategy}
					/>

					<EmergencyFundPanel
						currentCents={dataset.profile.currentEmergencyFundCents}
						progress={dashboard.emergencyProgress}
						sixMonthTargetCents={dashboard.emergencyFundTarget.sixMonthsCents}
						threeMonthTargetCents={
							dashboard.emergencyFundTarget.threeMonthsCents
						}
					/>
				</section>

				<section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
					<LeakDetectorPanel
						chartData={dashboard.leakChartData}
						chartsReady={chartsReady}
						leaks={dashboard.spendingLeaks}
					/>

					<IncomeIdeasPanel dataset={dataset} />
				</section>

				<p className="pb-4 text-xs leading-5 text-[#6B6B6B]">
					CashLift provides educational suggestions from your inputs. It is not
					financial, legal, or tax advice.
				</p>
			</div>
		</main>
	);
};
