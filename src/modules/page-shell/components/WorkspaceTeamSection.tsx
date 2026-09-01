import { ExploreKicker, ExploreLink } from "@/modules/dashboard/explore/exploreUi";
import { GlassCard } from "@/modules/dashboard/explore/GlassCard";
import type { FinancialDataset } from "@/modules/workspace/types";
import { cn } from "@/ui/utils/cn";

type TeamMember = FinancialDataset["teamMembers"][number];
type TeamRole = TeamMember["role"];

type WorkspaceTeamSectionProps = {
	basePath: string;
	dataset: FinancialDataset;
};

export const WorkspaceTeamSection = ({ basePath, dataset }: WorkspaceTeamSectionProps) => {
	const members = dataset.teamMembers;
	const primaryMember = members.find((member) => member.role === "owner-finance") ?? members[0];
	const remainingMembers = members.filter((member) => member.id !== primaryMember?.id);
	const teams = getMemberTeams(members);
	const roleCounts = getRoleCounts(members);

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<p className="text-muted-foreground text-s">{dataset.profile.name} · Team</p>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{getTeamHeadline(members)}
				</h1>

				<dl className="mt-6 grid gap-5 sm:grid-cols-3">
					{roleCounts.map(({ label, value }) => (
						<div key={label}>
							<dt className="text-muted-foreground text-s">{label}</dt>

							<dd>
								<span className="font-mono font-semibold text-3xl+ text-panel-foreground tabular-nums tracking-normal">
									{value}
								</span>
							</dd>
						</div>
					))}
				</dl>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" className="h-full" contentClassName="flex h-full flex-col" intensity="active">
					{primaryMember ? (
						<>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
								<TeamRoleCue role={primaryMember.role} />

								<span className="text-muted-foreground text-s">{primaryMember.team}</span>
							</div>

							<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">
								{primaryMember.name}
							</h2>

							<p className="mt-3 text-m text-shell-muted leading-6">
								{formatRole(primaryMember.role)} on {primaryMember.team}
							</p>

							<div className="mt-6">
								<ExploreLink className="min-h-12 rounded-lg px-4" href={`${basePath}/budgets`} primary>
									Open team budgets
								</ExploreLink>
							</div>
						</>
					) : (
						<>
							<ExploreKicker>Company members</ExploreKicker>

							<p className="mt-4 text-m text-muted-foreground">No company members in this workspace.</p>
						</>
					)}
				</GlassCard>

				<GlassCard atmosphere="queue">
					<ExploreKicker>Company members</ExploreKicker>

					<h2 className="mt-1 text-panel-foreground text-xl+">Who can act in this workspace</h2>

					{remainingMembers.length > 0 ? (
						<ul className="mt-4 divide-y divide-white/10">
							{remainingMembers.map((member) => (
								<li key={member.id}>{renderMemberRow(member)}</li>
							))}
						</ul>
					) : (
						<p className="mt-4 text-m text-muted-foreground">
							{primaryMember ? "No other company members in this workspace." : "No company members in this workspace."}
						</p>
					)}
				</GlassCard>
			</section>

			<GlassCard atmosphere="support">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Teams in this company workspace</h2>

				{teams.length > 0 ? (
					<ul className="mt-5 grid gap-8 md:grid-cols-3">
						{teams.map(({ members: teamMembers, name }) => (
							<li key={name} className="min-w-0">
								<p className="font-semibold text-m+ text-panel-foreground">{name}</p>

								<ul className="mt-3 divide-y divide-white/10">
									{teamMembers.map((member) => (
										<li key={member.id} className="py-3">
											<p className="font-semibold text-m+ text-panel-foreground">{member.name}</p>

											<p className="mt-1 text-muted-foreground text-s">{formatRole(member.role)}</p>
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				) : (
					<p className="mt-3 text-m text-muted-foreground">No teams in this workspace.</p>
				)}

				<ExploreLink className="mt-5" href={`${basePath}/budgets`}>
					View team budgets
				</ExploreLink>
			</GlassCard>
		</div>
	);
};

function renderMemberRow(member: TeamMember) {
	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<TeamRoleCue role={member.role} />

					<span className="text-muted-foreground text-s">{member.team}</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{member.name}</span>
			</span>
		</div>
	);
}

type TeamRoleCueProps = {
	role: TeamRole;
	className?: string;
};

function TeamRoleCue({ className, role }: TeamRoleCueProps) {
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
				{formatRole(role)}
			</span>
		</span>
	);
}

function getTeamHeadline(members: TeamMember[]) {
	if (members.length === 0) {
		return "No company members in this workspace";
	}

	const teams = [...new Set(members.map((member) => member.team))];
	const memberLabel = members.length === 1 ? "company member" : "company members";

	if (teams.length === 1) {
		return `${members.length} ${memberLabel} on ${teams[0]}`;
	}

	return `${members.length} ${memberLabel} across ${formatList(teams)}`;
}

function getRoleCounts(members: TeamMember[]) {
	return [
		{
			label: "Finance leads",
			value: members.filter((member) => member.role === "owner-finance").length,
		},
		{
			label: "Managers",
			value: members.filter((member) => member.role === "manager").length,
		},
		{
			label: "Employees",
			value: members.filter((member) => member.role === "employee").length,
		},
	] as const;
}

function getMemberTeams(members: TeamMember[]) {
	const teams = new Map<string, TeamMember[]>();

	for (const member of members) {
		const current = teams.get(member.team) ?? [];

		current.push(member);
		teams.set(member.team, current);
	}

	return [...teams.entries()].map(([name, teamMembers]) => ({
		members: teamMembers,
		name,
	}));
}

function formatList(items: string[]) {
	if (items.length === 2) {
		return `${items[0]} and ${items[1]}`;
	}

	return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function formatRole(role: TeamRole) {
	const roleLabels = {
		employee: "Employee",
		manager: "Manager",
		"owner-finance": "Finance Lead",
	} as const satisfies Record<TeamRole, string>;

	return roleLabels[role];
}
