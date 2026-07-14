"use client";

import { useClerkAccount } from "@/services/clerk/useClerkAccount";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

export const ProductionAccountMenu = () => {
	const { avatar, description, name, signOut } = useClerkAccount();

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
