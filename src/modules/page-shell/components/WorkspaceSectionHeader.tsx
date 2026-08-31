import Link from "next/link";
import type { WorkspaceSection } from "../types";

type WorkspaceSectionHeaderProps = {
	section: WorkspaceSection;
};

export const WorkspaceSectionHeader = ({ section }: WorkspaceSectionHeaderProps) => (
	<div className="flex flex-col gap-3 rounded-lg border border-shell-border bg-shell-elevated p-5 shadow-shell md:flex-row md:items-center md:justify-between">
		<div>
			<p className="text-primary text-s+ uppercase tracking-normal">Workspace</p>

			<h1 className="text-4xl+ text-primary tracking-normal">{getSectionTitle(section)}</h1>
		</div>

		<Link
			href="/demo"
			className="ease inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 font-medium text-m text-primary-foreground transition-[background-color,box-shadow] duration-150 hover:bg-primary-hover hover:shadow-primary-glow"
		>
			Run leak audit
		</Link>
	</div>
);

function getSectionTitle(section: WorkspaceSection) {
	const titles = {
		approvals: "Spend approvals",
		budgets: "Team budgets",
		cash: "Cash Insights",
		invoices: "Invoice collection",
		overview: "Overview",
		settings: "Workspace settings",
		team: "Team",
		vendors: "Vendor leaks",
	} as const satisfies Record<WorkspaceSection, string>;

	return titles[section];
}
