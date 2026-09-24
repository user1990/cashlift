import { ExploreKicker, ExploreLink } from "@/modules/dashboard/cockpits/cockpitUi";
import { COMPANY_ROLE_LABELS } from "@/modules/workspace/settingsPresentation";
import type { FinancialDataset } from "@/modules/workspace/types";
import { GlassCard } from "@/ui/components/cockpit/GlassCard";
import { WorkspaceMemberRow } from "./WorkspaceMemberRow";
import { WorkspaceRoleCue } from "./WorkspaceRoleCue";

type TeamMember = FinancialDataset["teamMembers"][number];

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
								<WorkspaceRoleCue role={primaryMember.role} />

								<span className="text-muted-foreground text-s">{primaryMember.team}</span>
							</div>

							<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">
								{primaryMember.name}
							</h2>

							<p className="mt-3 text-m text-shell-muted leading-6">
								{COMPANY_ROLE_LABELS[primaryMember.role]} on {primaryMember.team}
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
								<li key={member.id}>
									<WorkspaceMemberRow member={member} />
								</li>
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

											<p className="mt-1 text-muted-foreground text-s">{COMPANY_ROLE_LABELS[member.role]}</p>
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
