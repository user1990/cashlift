"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { AccountMenuShell } from "./WorkspaceAccountMenuShell";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

export const ProductionAccountMenu = () => {
	const { signOut } = useClerk();
	const { user } = useUser();

	if (!user) {
		return (
			<AccountMenuShell
				avatar="AC"
				description="Workspace user"
				items={[{ href: "/dashboard/settings", label: "Workspace settings" }]}
				name="Account"
				signOut={() => signOut({ redirectUrl: "/login" })}
			/>
		);
	}

	return <SignedInAccountMenu signOut={() => signOut({ redirectUrl: "/login" })} user={user} />;
};

const SignedInAccountMenu = ({ signOut, user }: { signOut: () => void; user: ClerkUser }) => {
	const emailAddress = user.primaryEmailAddress?.emailAddress;
	const name = [user.fullName, emailAddress].find(Boolean) ?? "Account";
	const description = emailAddress ?? "Workspace user";
	const avatar = getInitials(name);

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

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
