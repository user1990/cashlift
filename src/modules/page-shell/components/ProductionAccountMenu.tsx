"use client";

import { useClerkAccount } from "@/services/clerk/useClerkAccount";
import { WorkspaceAccountMenuLoading } from "./WorkspaceAccountMenuLoading";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

type ProductionAccountMenuProps = {
	compact?: boolean;
	placement?: "header" | "sidebar";
};

export const ProductionAccountMenu = ({ compact = false, placement = "sidebar" }: ProductionAccountMenuProps) => {
	const account = useClerkAccount();

	if (!account) {
		return <WorkspaceAccountMenuLoading compact={compact} />;
	}

	const { avatar, description, name, signOut } = account;

	return (
		<AccountMenuShell
			avatar={avatar}
			compact={compact}
			description={description}
			items={[{ href: "/dashboard/settings", label: "Workspace settings" }]}
			name={name}
			placement={placement}
			signOut={signOut}
		/>
	);
};
