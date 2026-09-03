import { Shield, ShieldCheck } from "lucide-react";
import { ExploreKicker, ExploreLink, ExploreMoney } from "@/modules/dashboard/explore/exploreUi";
import { GlassCard } from "@/modules/dashboard/explore/GlassCard";
import type { FinancialDataset } from "@/modules/workspace/types";
import { ProgressBar } from "@/ui/components/feedback/ProgressBar";
import { cn } from "@/ui/utils/cn";
import { buildSettingsPresentation, COMPANY_ROLE_LABELS, type SettingsConfigRow } from "../settingsPresentation";

type WorkspaceSettingsSectionProps = {
	basePath: string;
	dataset: FinancialDataset;
	readOnly?: boolean;
};

type TeamMember = FinancialDataset["teamMembers"][number];
type CompanyRole = TeamMember["role"];

export const WorkspaceSettingsSection = ({ basePath, dataset, readOnly = false }: WorkspaceSettingsSectionProps) => {
	const presentation = buildSettingsPresentation({ dataset, readOnly });
	const financeLead = presentation.financeLead;

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<p className="text-muted-foreground text-s">{presentation.contextLine}</p>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{presentation.headline}
				</h1>

				<dl className="mt-6 grid gap-5 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-s">Cash on hand</dt>

						<dd>
							<ExploreMoney cents={presentation.cashBalanceCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="flex items-center gap-1.5 text-muted-foreground text-s">
							<Shield aria-hidden className="size-3.5 text-primary" />
							Cash buffer
						</dt>

						<dd>
							<ExploreMoney
								cents={presentation.cashBufferTargetCents}
								className="text-3xl+"
								warning={!presentation.aboveBuffer}
							/>
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Monthly payroll</dt>

						<dd>
							<ExploreMoney cents={presentation.monthlyPayrollCents} className="text-3xl+" />
						</dd>
					</div>
				</dl>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" className="h-full" contentClassName="flex h-full flex-col" intensity="active">
					{financeLead ? (
						<>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
								<span className="text-muted-foreground text-s">{presentation.industryLabel}</span>

								<SettingsRoleCue role={financeLead.role} />

								<span className="text-muted-foreground text-s">{financeLead.team}</span>
							</div>

							<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">
								{presentation.companyName}
							</h2>

							<p className="mt-3 font-semibold text-m+ text-panel-foreground">{financeLead.name}</p>

							<p className="mt-1 text-m text-shell-muted leading-6">
								{COMPANY_ROLE_LABELS[financeLead.role]} on {financeLead.team}. This workspace defaults to{" "}
								{presentation.defaultRoleLabel}.
							</p>

							<p className="mt-5 font-mono text-m text-panel-foreground tabular-nums tracking-normal">
								{presentation.companyId}
							</p>

							<p className="mt-1 text-muted-foreground text-s">{presentation.memberCountLabel}</p>

							<div className="mt-6">
								<ExploreLink className="min-h-12 rounded-lg px-4" href={`${basePath}/team`} primary>
									Open team
								</ExploreLink>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
								<span className="text-muted-foreground text-s">{presentation.industryLabel}</span>

								<SettingsRoleCue role={dataset.profile.defaultRole} />
							</div>

							<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">
								{presentation.companyName}
							</h2>

							<p className="mt-3 text-m text-shell-muted leading-6">
								This workspace defaults to {presentation.defaultRoleLabel}. No company members are in the current
								records.
							</p>

							<p className="mt-5 font-mono text-m text-panel-foreground tabular-nums tracking-normal">
								{presentation.companyId}
							</p>
						</>
					)}
				</GlassCard>

				<div className="grid min-w-0 gap-4 xl:gap-5">
					<GlassCard atmosphere="queue">
						<ExploreKicker>Configuration</ExploreKicker>

						<h2 className="mt-1 text-panel-foreground text-xl+">How this workspace is set up</h2>

						<ul className="mt-4 divide-y divide-white/10">
							{presentation.configs.map((config) => (
								<li key={config.id}>{renderConfigRow(config)}</li>
							))}
						</ul>
					</GlassCard>

					<GlassCard atmosphere="outlook">
						<ExploreKicker>Guardrails</ExploreKicker>

						<h2 className="mt-1 text-panel-foreground text-xl+">Cash buffer and payroll</h2>

						<p
							className={
								presentation.aboveBuffer
									? "mt-3 text-m text-shell-muted leading-6"
									: "mt-3 text-m text-warning leading-6"
							}
						>
							{presentation.aboveBuffer
								? "Cash on hand covers the cash buffer."
								: "Cash on hand is short of the cash buffer."}
						</p>

						{presentation.bufferSharePercent !== undefined && presentation.bufferShareLabel && (
							<div className="mt-5">
								<ProgressBar
									label={`Cash buffer · ${presentation.bufferShareLabel} of cash on hand`}
									value={presentation.bufferSharePercent}
								/>
							</div>
						)}

						<div className="mt-6">
							<ExploreLink href={`${basePath}/cash`}>Open cash insights</ExploreLink>
						</div>
					</GlassCard>
				</div>
			</section>

			<GlassCard atmosphere="support">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Roles, safety, and related surfaces</h2>

				<div className="mt-5 grid gap-8 lg:grid-cols-12">
					<div className="min-w-0 lg:col-span-4">
						<p className="font-semibold text-m+ text-panel-foreground">Role policy</p>

						<div className="mt-3 space-y-3 text-m text-shell-muted leading-6">
							<p>Finance leads see cash impact before spend is approved.</p>

							<p>Managers approve team spend after CashLift shows cash impact.</p>

							<p>Employees can request spend and upload receipts only.</p>
						</div>
					</div>

					<div className="min-w-0 lg:col-span-4">
						<p className="font-semibold text-m+ text-panel-foreground">Safety</p>

						<div className="mt-3 space-y-3 text-m text-shell-muted leading-6">
							<p>
								<ShieldCheck aria-hidden className="mr-1 inline size-4 text-primary" />
								No cards, ACH, bill pay, payroll execution, or money movement.
							</p>

							<p>Approved work is handed off outside CashLift. It is not executed here.</p>
						</div>
					</div>

					<div className="min-w-0 lg:col-span-4">
						<p className="font-semibold text-m+ text-panel-foreground">Related surfaces</p>

						{presentation.remainingMembers.length > 0 && (
							<ul className="mt-3 divide-y divide-white/10">
								{presentation.remainingMembers.map((member) => (
									<li key={member.id}>{renderMemberRow(member)}</li>
								))}
							</ul>
						)}

						<div className="mt-5 flex flex-wrap gap-3">
							<ExploreLink href={`${basePath}/budgets`}>View team budgets</ExploreLink>

							<ExploreLink href={basePath}>Back to overview</ExploreLink>
						</div>
					</div>
				</div>
			</GlassCard>
		</div>
	);
};

function renderConfigRow(config: SettingsConfigRow) {
	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="block font-semibold text-m+ text-panel-foreground">{config.label}</span>

				<span className="mt-1 block text-muted-foreground text-s">{config.detail}</span>
			</span>

			{config.kind === "money" ? (
				<ExploreMoney cents={config.cents} className="shrink-0" exact />
			) : (
				<span className="shrink-0 font-semibold text-m+ text-panel-foreground">{config.value}</span>
			)}
		</div>
	);
}

function renderMemberRow(member: TeamMember) {
	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<SettingsRoleCue role={member.role} />

					<span className="text-muted-foreground text-s">{member.team}</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{member.name}</span>
			</span>
		</div>
	);
}

type SettingsRoleCueProps = {
	role: CompanyRole;
	className?: string;
};

function SettingsRoleCue({ className, role }: SettingsRoleCueProps) {
	return (
		<span className={cn("inline-flex items-center gap-1.5 text-s", className)}>
			<span
				aria-hidden
				className={cn(
					"size-1.5 rounded-full",
					role === "owner-finance" && "bg-primary",
					role === "manager" && "bg-shell-muted",
					role === "employee" && "bg-border-strong",
				)}
			/>

			<span
				className={cn(
					role === "owner-finance" && "text-primary",
					(role === "manager" || role === "employee") && "text-muted-foreground",
				)}
			>
				{COMPANY_ROLE_LABELS[role]}
			</span>
		</span>
	);
}
