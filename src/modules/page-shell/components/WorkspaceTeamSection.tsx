import type { FinancialDataset } from "@/modules/workspace/types";
import { Panel } from "@/ui/components/layout/Panel";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";
import { WorkspaceCardGrid } from "./WorkspaceCardGrid";

type WorkspaceTeamSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceTeamSection = ({ dataset }: WorkspaceTeamSectionProps) => (
	<WorkspaceCardGrid>
		{dataset.teamMembers.map(({ id, name, role, team }) => (
			<Panel key={id} as="article" className="min-h-40">
				<PanelHeader label={team} title={name} />

				<p className="inline-flex rounded-md border border-primary-subtle-border bg-primary-subtle px-2 py-1 text-s+ font-medium text-primary">
					{formatRole(role)}
				</p>
			</Panel>
		))}
	</WorkspaceCardGrid>
);

function formatRole(role: FinancialDataset["teamMembers"][number]["role"]) {
	const roleLabels = {
		employee: "Employee",
		manager: "Manager",
		"owner-finance": "Finance Lead",
	} as const satisfies Record<FinancialDataset["teamMembers"][number]["role"], string>;

	return roleLabels[role];
}
