import Link from "next/link";
import type { WorkspaceSection } from "./types";

type WorkspaceSectionHeaderProps = {
	section: WorkspaceSection;
};

export const WorkspaceSectionHeader = ({ section }: WorkspaceSectionHeaderProps) => (
	<div className="flex flex-col gap-3 rounded-lg border border-shell-border bg-shell-elevated p-4 shadow-shell md:flex-row md:items-center md:justify-between">
		<div>
			<p className="text-s+ uppercase tracking-normal text-primary">Workspace</p>

			<h1 className="text-4xl+ tracking-normal text-shell-foreground">{getSectionTitle(section)}</h1>
		</div>

		<Link
			className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
			href="/demo"
		>
			Run leak audit
		</Link>
	</div>
);

function getSectionTitle(section: WorkspaceSection) {
	const titles: Record<WorkspaceSection, string> = {
		approvals: "Spend approvals",
		budgets: "Team budgets",
		cash: "13-week cash outlook",
		invoices: "Invoice collection",
		settings: "Workspace settings",
		vendors: "Vendor leaks",
	};

	return titles[section];
}
