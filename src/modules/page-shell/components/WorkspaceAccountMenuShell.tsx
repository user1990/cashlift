"use client";

import { ChevronDown } from "lucide-react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type AccountMenuShellProps = {
	avatar: string;
	compact?: boolean;
	description: string;
	items: { href: string; label: string }[];
	name: string;
	placement?: "header" | "sidebar";
	signOut?: () => void;
};

const MENU_ITEM_CLASS_NAME =
	"flex cursor-pointer items-center rounded-md px-3 py-2 text-left text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel-muted hover:text-shell-foreground focus-visible:bg-panel-muted focus-visible:text-shell-foreground";

export const AccountMenuShell = ({
	avatar,
	compact = false,
	description,
	items,
	name,
	placement = "sidebar",
	signOut,
}: AccountMenuShellProps) => {
	const compactHeader = compact ? (
		<div className="border-shell-border border-b px-3 py-2">
			<p className="truncate font-semibold text-m+ text-shell-foreground">{name}</p>

			<p className="truncate text-s text-shell-muted">{description}</p>
		</div>
	) : undefined;
	const signOutItem = signOut ? (
		<MenuItem className={MENU_ITEM_CLASS_NAME} onAction={signOut}>
			Sign out
		</MenuItem>
	) : undefined;

	return (
		<MenuTrigger>
			<Button
				aria-label={compact ? `${name}, ${description}` : undefined}
				className={cn(
					"focus-ring ease flex cursor-pointer list-none items-center rounded-lg text-left text-shell-foreground transition-colors duration-150 hover:bg-white/5",
					compact ? "size-11 justify-center p-0" : "w-full gap-3 px-2 py-3",
					placement === "header" && "shrink-0",
				)}
			>
				<span
					aria-hidden={compact}
					className="grid size-10 shrink-0 place-items-center rounded-full bg-panel-muted font-semibold text-s+ text-shell-foreground"
				>
					{avatar}
				</span>

				{!compact && (
					<>
						<span className="min-w-0 flex-1">
							<span className="block truncate font-semibold text-m+">{name}</span>

							<span className="block truncate text-s text-shell-muted">{description}</span>
						</span>

						<ChevronDown aria-hidden className="size-4 text-shell-muted" />
					</>
				)}
			</Button>

			<Popover
				className={cn(
					"z-20 grid w-56 gap-1 rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell outline-none",
					placement === "header" ? "mt-2" : "mb-2",
				)}
				offset={8}
				placement={placement === "header" ? "bottom end" : "top start"}
			>
				<Menu className="grid gap-1 outline-none">
					{compactHeader}

					{items.map(({ href, label }) => (
						<MenuItem key={href} className={MENU_ITEM_CLASS_NAME} href={href}>
							{label}
						</MenuItem>
					))}

					{signOutItem}
				</Menu>
			</Popover>
		</MenuTrigger>
	);
};
