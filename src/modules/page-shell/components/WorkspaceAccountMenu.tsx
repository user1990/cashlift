"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { WorkspaceMode } from "./types";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

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

const ProductionAccountMenu = () => {
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

type AccountMenuShellProps = {
	avatar: string;
	description: string;
	items: { href: string; label: string }[];
	name: string;
	signOut?: () => void;
};

const AccountMenuShell = ({ avatar, description, items, name, signOut }: AccountMenuShellProps) => (
	<details className="relative">
		<summary className="flex w-full cursor-pointer list-none items-center gap-3 rounded-lg px-2 py-3 text-left text-shell-foreground transition-colors duration-150 ease hover:bg-white/5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
			<span className="grid size-10 shrink-0 place-items-center rounded-full bg-panel-muted text-s+ font-semibold text-shell-foreground">
				{avatar}
			</span>

			<span className="min-w-0 flex-1">
				<span className="block truncate text-m+ font-semibold">{name}</span>

				<span className="block truncate text-s text-shell-muted">{description}</span>
			</span>

			<ChevronDown aria-hidden className="size-4 text-shell-muted" />
		</summary>

		<div className="absolute bottom-full left-0 z-20 mb-2 grid w-56 gap-1 rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell">
			{items.map(({ href, label }) => (
				<Link key={href} href={href} className={menuItemClassName}>
					{label}
				</Link>
			))}

			{signOut && (
				<button className={menuItemClassName} onClick={signOut} type="button">
					Sign out
				</button>
			)}
		</div>
	</details>
);

const menuItemClassName =
	"flex cursor-pointer items-center rounded-md px-3 py-2 text-left text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel-muted hover:text-shell-foreground focus-visible:bg-panel-muted focus-visible:text-shell-foreground";

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
