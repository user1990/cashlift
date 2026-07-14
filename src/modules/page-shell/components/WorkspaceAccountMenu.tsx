"use client";

import { ProductionAccountMenu } from "./ProductionAccountMenu";
import type { WorkspaceExperience } from "./types";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

type WorkspaceAccountMenuProps = {
	basePath: string;
	experience: WorkspaceExperience;
};

export const WorkspaceAccountMenu = ({ basePath, experience }: WorkspaceAccountMenuProps) => {
	if (experience === "public-demo") {
		return (
			<AccountMenuShell
				avatar="SN"
				description="Read-only demo"
				items={[
					{ href: "/", label: "Return home" },
					{ href: "/demo", label: "Book walkthrough" },
				]}
				name="Studio Nova"
			/>
		);
	}

	if (experience === "demo") {
		return (
			<AccountMenuShell
				avatar="SC"
				description="Finance Lead"
				items={[
					{ href: `${basePath}/settings`, label: "Workspace settings" },
					{ href: "/login", label: "Log in" },
				]}
				name="Samira Chen"
			/>
		);
	}

	return <ProductionAccountMenu />;
};
