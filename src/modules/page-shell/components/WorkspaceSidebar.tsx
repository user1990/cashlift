"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/ui/utils/cn";
import { WORKSPACE_NAV_ITEMS } from "./navigation";
import type { WorkspaceMode, WorkspaceNavItem, WorkspaceSection } from "./types";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

type WorkspaceSidebarProps = {
	mode: WorkspaceMode;
	section: WorkspaceSection;
};

export const WorkspaceSidebar = ({ mode, section }: WorkspaceSidebarProps) => (
	<aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-lg border border-white/5 bg-black/30 p-3 shadow-shell backdrop-blur lg:sticky lg:top-4 lg:self-start">
		<Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
			<span className="grid size-10 place-items-center rounded-lg bg-signal-subtle text-signal shadow-primary-glow">
				<span className="size-6 rounded-[6px] bg-signal [clip-path:polygon(50%_0,100%_100%,50%_78%,0_100%)]" />
			</span>

			<span className="text-2xl+ font-semibold tracking-normal text-shell-foreground">
				Cash<span className="text-signal">Lift</span>
			</span>
		</Link>

		<nav className="mt-7 grid gap-2" aria-label="Workspace">
			{WORKSPACE_NAV_ITEMS.map((item) => (
				<WorkspaceNavLink key={item.href} active={item.section === section} item={item} />
			))}
		</nav>

		<div className="mt-auto sm:pt-8">
			<WorkspaceAccountMenu mode={mode} />
		</div>
	</aside>
);

type WorkspaceNavLinkProps = {
	active: boolean;
	item: WorkspaceNavItem;
};

const WorkspaceNavLink = ({ active, item }: WorkspaceNavLinkProps) => {
	const Icon = item.icon;

	return (
		<Link aria-current={active ? "page" : undefined} href={item.href} className={getWorkspaceNavLinkClassName(active)}>
			<WorkspaceActiveIndicator active={active} />

			<Icon aria-hidden className="relative z-10 size-5" />

			<span className="relative z-10">{item.label}</span>
		</Link>
	);
};

const WorkspaceActiveIndicator = ({ active }: { active: boolean }) => {
	if (!active) {
		return null;
	}

	return <span className="absolute inset-0 rounded-lg border border-primary-subtle-border bg-primary/10" />;
};

const WorkspaceAccountMenu = ({ mode }: { mode: WorkspaceMode }) => {
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

const getWorkspaceNavLinkClassName = (active: boolean) =>
	cn(
		"relative flex min-h-12 items-center gap-3 overflow-hidden rounded-lg px-4 text-m font-medium transition-colors duration-150 ease",
		active ? "text-primary" : "text-shell-muted hover:bg-white/5 hover:text-shell-foreground",
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
