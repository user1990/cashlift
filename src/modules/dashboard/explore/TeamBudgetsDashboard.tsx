import { getPercentage } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { ProgressBar } from "@/ui/components/feedback/ProgressBar";
import { formatExploreMoney } from "./exploreModel";
import { ExploreKicker, ExploreMoney } from "./exploreUi";
import { GlassCard } from "./GlassCard";
import { buildTeamBudgetsPresentation, type TeamBudgetRow } from "./teamBudgetsModel";

type TeamBudgetsDashboardProps = {
	dataset: FinancialDataset;
};

export const TeamBudgetsDashboard = ({ dataset }: TeamBudgetsDashboardProps) => {
	const presentation = buildTeamBudgetsPresentation(dataset);
	const primaryTeam = presentation.primaryTeam;

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<p className="text-muted-foreground text-s">{presentation.companyName} · Team budgets</p>

					<p className="text-muted-foreground text-s">{formatTeamCount(presentation.teamCount)}</p>
				</div>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{presentation.headline}
				</h1>

				{presentation.teamCount > 0 && (
					<dl className="mt-6 grid gap-5 sm:grid-cols-3">
						<div>
							<dt className="text-muted-foreground text-s">Monthly budget</dt>

							<dd>
								<ExploreMoney cents={presentation.monthlyBudgetCents} className="text-3xl+" />
							</dd>
						</div>

						<div>
							<dt className="text-muted-foreground text-s">Committed</dt>

							<dd>
								<ExploreMoney cents={presentation.committedCents} className="text-3xl+" />
							</dd>
						</div>

						<div>
							<dt className="text-muted-foreground text-s">Remaining</dt>

							<dd>
								<ExploreMoney
									cents={presentation.remainingCents}
									className="text-3xl+"
									warning={presentation.remainingCents < 0}
								/>
							</dd>

							{presentation.overBudgetCount > 0 && (
								<dd className="mt-1 text-s text-warning">
									{presentation.overBudgetCount === 1
										? "1 team is over budget"
										: `${presentation.overBudgetCount} teams are over budget`}
								</dd>
							)}
						</div>
					</dl>
				)}
			</GlassCard>

			{primaryTeam && (
				<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
					<GlassCard
						atmosphere="priority"
						className="h-full"
						contentClassName="flex h-full flex-col"
						intensity="active"
					>
						{renderPrimaryTeam(primaryTeam, presentation.remainingTeams.length > 0)}
					</GlassCard>

					<GlassCard atmosphere="queue">
						<ExploreKicker>Guardrails</ExploreKicker>

						<h2 className="mt-1 text-panel-foreground text-xl+">Other teams</h2>

						{presentation.remainingTeams.length > 0 ? (
							<ol className="mt-4 divide-y divide-white/10">
								{presentation.remainingTeams.map((row) => (
									<li key={row.id}>{renderQueueTeam(row)}</li>
								))}
							</ol>
						) : (
							<p className="mt-4 text-m text-muted-foreground">No other team budgets for this range.</p>
						)}
					</GlassCard>
				</section>
			)}

			{presentation.rows.length > 0 && (
				<GlassCard atmosphere="support">
					<ExploreKicker>Supporting work</ExploreKicker>

					<h2 className="mt-1 text-panel-foreground text-xl+">Monthly, committed, and approved</h2>

					<ul className="mt-5 grid gap-8 lg:grid-cols-3">
						{presentation.rows.map((row) => (
							<li key={row.id} className="min-w-0">
								{renderSupportTeam(row)}
							</li>
						))}
					</ul>
				</GlassCard>
			)}
		</div>
	);
};

function renderPrimaryTeam(primaryTeam: TeamBudgetRow, hasOtherTeams: boolean) {
	const overBudget = primaryTeam.remainingCents < 0;

	return (
		<>
			<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
				{renderPrimaryKicker(overBudget, hasOtherTeams)}

				<span className="text-muted-foreground text-s">{getPercentage(primaryTeam.usagePercent)} used</span>
			</div>

			<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">{primaryTeam.team}</h2>

			<p className="mt-3 text-m text-shell-muted leading-6">{getPrimaryTeamDescription(overBudget, hasOtherTeams)}</p>

			<p className="mt-5">
				<ExploreMoney cents={primaryTeam.remainingCents} className="text-2xl+" warning={overBudget} />

				<span className="ml-2 text-muted-foreground text-s">{overBudget ? "over budget" : "left this month"}</span>
			</p>

			<div className="mt-6">
				<ProgressBar label="Monthly budget used" value={primaryTeam.usagePercent} />
			</div>
		</>
	);
}

function renderQueueTeam({ remainingCents, team, usagePercent }: TeamBudgetRow) {
	const overBudget = remainingCents < 0;

	return (
		<div className="flex items-start justify-between gap-3 py-3">
			<div className="min-w-0">
				<p className="font-semibold text-m+ text-panel-foreground">{team}</p>

				<p className="mt-1 text-muted-foreground text-s">
					{overBudget ? "Over budget" : `${getPercentage(usagePercent)} used`}
				</p>
			</div>

			<ExploreMoney cents={remainingCents} className="shrink-0" exact warning={overBudget} />
		</div>
	);
}

function renderSupportTeam({
	approvedCents,
	committedCents,
	monthlyBudgetCents,
	remainingCents,
	team,
	usagePercent,
}: TeamBudgetRow) {
	return (
		<>
			<p className="font-semibold text-m+ text-panel-foreground">{team}</p>

			<dl className="mt-3 grid gap-3">
				<div>
					<dt className="text-muted-foreground text-s">Monthly</dt>

					<dd>
						<ExploreMoney cents={monthlyBudgetCents} exact />
					</dd>
				</div>

				<div>
					<dt className="text-muted-foreground text-s">Committed</dt>

					<dd>
						<ExploreMoney cents={committedCents} exact />
					</dd>
				</div>

				<div>
					<dt className="text-muted-foreground text-s">Approved</dt>

					<dd>
						<ExploreMoney cents={approvedCents} exact />
					</dd>
				</div>
			</dl>

			<div className="mt-4">
				<ProgressBar
					label={`${team} · ${formatExploreMoney(remainingCents)} ${remainingCents >= 0 ? "left" : "over budget"}`}
					value={usagePercent}
				/>
			</div>
		</>
	);
}

function renderPrimaryKicker(overBudget: boolean, hasOtherTeams: boolean) {
	if (overBudget) {
		return <span className="text-s text-warning">Over budget</span>;
	}

	return <ExploreKicker>{hasOtherTeams ? "Highest usage" : "Guardrail"}</ExploreKicker>;
}

function formatTeamCount(teamCount: number) {
	return teamCount === 1 ? "1 team" : `${teamCount} teams`;
}

function getPrimaryTeamDescription(overBudget: boolean, hasOtherTeams: boolean) {
	if (overBudget) {
		return "Committed spend is above this team's monthly budget.";
	}

	if (hasOtherTeams) {
		return "This team has used more of its monthly budget than the others.";
	}

	return "Committed spend is within this team's monthly budget.";
}
