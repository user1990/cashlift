"use client";

import { useClerkAccount } from "@/services/clerk/useClerkAccount";
import { WorkspaceAccountMenuLoading } from "./WorkspaceAccountMenuLoading";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

export const ProductionAccountMenu = () => {
	const account = useClerkAccount();

	if (!account) {
		return <WorkspaceAccountMenuLoading />;
	}

	const { avatar, description, name, signOut } = account;

	return (
		<AccountMenuShell
			avatar={avatar}
			description={description}
			items={[{ href: "/dashboard/settings", label: "Workspace settings" }]}
			name={name}
			signOut={signOut}
		/>
	);
};
