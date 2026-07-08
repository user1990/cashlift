"use client";

import dynamic from "next/dynamic";
import type { WorkspaceMode } from "./types";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

const ProductionAccountMenu = dynamic(() =>
	import("./ProductionAccountMenu").then((module) => module.ProductionAccountMenu),
);

type WorkspaceAccountMenuProps = {
	mode: WorkspaceMode;
};

export const WorkspaceAccountMenu = ({ mode }: WorkspaceAccountMenuProps) => {
	if (mode === "demo") {
		return (
			<AccountMenuShell
				avatar="SC"
				description="Finance Lead"
				items={[
					{ href: "/dashboard/settings", label: "Workspace settings" },
					{ href: "/login", label: "Log in" },
				]}
				name="Samira Chen"
			/>
		);
	}

	return <ProductionAccountMenu />;
};
