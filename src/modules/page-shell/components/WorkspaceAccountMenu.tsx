"use client";

import type { WorkspaceExperienceContract } from "../types";
import { ProductionAccountMenu } from "./ProductionAccountMenu";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

type WorkspaceAccountMenuProps = {
	workspace: WorkspaceExperienceContract;
};

export const WorkspaceAccountMenu = ({ workspace }: WorkspaceAccountMenuProps) => {
	if (workspace.readOnly) {
		return (
			<AccountMenuShell
				avatar="SN"
				description="Read-only demo"
				items={[
					{ href: "/", label: "Return home" },
					{ href: "/demo", label: "Book a walkthrough" },
				]}
				name="Studio Nova"
			/>
		);
	}

	if (workspace.experience === "demo") {
		return (
			<AccountMenuShell
				avatar="SC"
				description="Finance Lead"
				items={[
					{ href: `${workspace.basePath}/settings`, label: "Workspace settings" },
					{ href: "/login", label: "Log in" },
				]}
				name="Samira Chen"
			/>
		);
	}

	return <ProductionAccountMenu />;
};
