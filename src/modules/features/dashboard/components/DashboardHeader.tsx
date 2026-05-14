"use client";

import { ClipboardCheck, MoreHorizontal, SearchCheck } from "lucide-react";
import Link from "next/link";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { Button } from "@/modules/ui/components/Button";
import { cn } from "@/modules/ui/utils/cn";

type DashboardHeaderProps = {
	companyName: string;
};

export const DashboardHeader = ({ companyName }: DashboardHeaderProps) => (
	<header className="sticky top-0 z-20 -mx-4 border-b border-shell-border bg-shell/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
		<div className="mx-auto flex max-w-[1440px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<Link href="/" className="group">
				<p className="text-s+ uppercase tracking-normal text-primary">CashLift for Teams</p>

				<p className="text-3xl+ tracking-normal text-shell-foreground sm:text-4xl+">
					{companyName} cash decision center
				</p>
			</Link>

			<div className="flex flex-wrap items-center gap-2">
				<MenuTrigger>
					<Button className="text-shell-muted hover:bg-white/10 hover:text-shell-foreground" variant="ghost">
						<MoreHorizontal aria-hidden className="size-4" />
						More
					</Button>

					<Popover
						className="w-52 rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell outline-none"
						offset={8}
						placement="bottom end"
					>
						<Menu className="grid gap-1 outline-none">
							<MenuItem className={menuItemClassName} href="/pricing" textValue="Pricing">
								Pricing
							</MenuItem>

							<MenuItem className={menuItemClassName} onAction={() => undefined} textValue="Sync approvals">
								<ClipboardCheck aria-hidden className="size-4" />
								Sync approvals
							</MenuItem>
						</Menu>
					</Popover>
				</MenuTrigger>

				<Button variant="primary">
					<SearchCheck aria-hidden className="size-4" />
					Run leak audit
				</Button>
			</div>
		</div>
	</header>
);

const menuItemClassName = ({ isFocusVisible, isHovered }: { isFocusVisible: boolean; isHovered: boolean }) =>
	cn(
		"flex items-center gap-2 rounded-md px-3 py-2 text-m font-medium text-shell-muted outline-none transition-colors duration-150",
		(isHovered || isFocusVisible) && "bg-panel/10 text-shell-foreground",
	);
