"use client";

import type { WorkspaceExperienceContract } from "../types";
import { ProductionAccountMenu } from "./ProductionAccountMenu";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

type WorkspaceAccountMenuProps = {
	compact?: boolean;
	placement?: "header" | "sidebar";
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceAccountMenu = ({
	compact = false,
	placement = "sidebar",
	workspace,
}: WorkspaceAccountMenuProps) => {
	if (workspace.readOnly) {
		return (
			<AccountMenuShell
				avatar="SN"
				compact={compact}
				description="Read-only demo"
				items={[
					{ href: "/", label: "Return home" },
					{ href: "/demo", label: "Book walkthrough" },
				]}
				name="Studio Nova"
				placement={placement}
			/>
		);
	}

	if (workspace.experience === "demo") {
		return (
			<AccountMenuShell
				avatar="SC"
				compact={compact}
				description="Finance Lead"
				items={[
					{ href: `${workspace.basePath}/settings`, label: "Workspace settings" },
					{ href: "/login", label: "Log in" },
				]}
				name="Samira Chen"
				placement={placement}
			/>
		);
	}

	return <ProductionAccountMenu compact={compact} placement={placement} />;
};
