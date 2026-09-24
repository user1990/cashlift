import type { FinancialDataset } from "@/modules/workspace/types";
import { WorkspaceRoleCue } from "./WorkspaceRoleCue";

type WorkspaceMember = FinancialDataset["teamMembers"][number];

type WorkspaceMemberRowProps = {
	member: WorkspaceMember;
};

export const WorkspaceMemberRow = ({ member }: WorkspaceMemberRowProps) => (
	<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
		<span className="min-w-0">
			<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
				<WorkspaceRoleCue role={member.role} />

				<span className="text-muted-foreground text-s">{member.team}</span>
			</span>

			<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{member.name}</span>
		</span>
	</div>
);
