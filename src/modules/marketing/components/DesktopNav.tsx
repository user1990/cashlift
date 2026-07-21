"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/ui/utils/cn";
import type { NavGroup } from "./marketingHeaderNavigation";
import { MARKETING_NAV_GROUPS } from "./marketingHeaderNavigation";

export const DesktopNav = () => {
	const pathname = usePathname();

	return (
		<nav aria-label="Main navigation" className="hidden items-center gap-2 text-m font-medium text-shell-muted lg:flex">
			{MARKETING_NAV_GROUPS.map((group) => (
				<DesktopNavGroup group={group} key={group.label} pathname={pathname} />
			))}

			<Link
				href="/customers"
				className="inline-flex h-9 items-center rounded-md px-3 transition-colors duration-150 hover:text-primary"
			>
				Customers
			</Link>
		</nav>
	);
};

type DesktopNavGroupProps = {
	group: NavGroup;
	pathname: string;
};

const DesktopNavGroup = ({ group, pathname }: DesktopNavGroupProps) => (
	<details className="group relative">
		<summary className="flex h-9 cursor-pointer list-none items-center gap-1 rounded-md px-3 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
			{group.label}

			<ChevronDown aria-hidden className="size-4 transition-transform duration-150 group-open:rotate-180" />
		</summary>

		<div className="invisible pointer-events-none absolute left-0 top-full w-48 translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 group-open:visible group-open:pointer-events-auto group-open:translate-y-0 group-open:opacity-100">
			<div className="rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell">
				<ul className="grid gap-1">
					{group.items.map(({ href, label }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`);

						return (
							<li key={href}>
								<Link
									aria-current={active ? "page" : undefined}
									className={cn(
										"block rounded-md px-3 py-2 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20",
										active && "bg-primary/10 text-primary",
									)}
									href={href}
									onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
								>
									{label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	</details>
);
