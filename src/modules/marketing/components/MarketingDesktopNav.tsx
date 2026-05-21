import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { NavGroup } from "./marketingHeaderNavigation";
import { MARKETING_NAV_GROUPS } from "./marketingHeaderNavigation";

export const MarketingDesktopNav = () => (
	<nav aria-label="Main navigation" className="hidden items-center gap-2 text-m font-medium text-shell-muted lg:flex">
		{MARKETING_NAV_GROUPS.map((group) => (
			<MarketingDesktopNavGroup key={group.label} group={group} />
		))}

		<Link
			href="/customers"
			className="inline-flex h-9 items-center rounded-md px-3 transition-colors duration-150 hover:text-primary"
		>
			Customers
		</Link>
	</nav>
);

const MarketingDesktopNavGroup = ({ group }: { group: NavGroup }) => (
	<div className="group relative">
		<button
			aria-haspopup="true"
			className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md px-3 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
			type="button"
		>
			{group.label}

			<ChevronDown
				aria-hidden
				className="size-4 transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
			/>
		</button>

		<div className="invisible pointer-events-none absolute left-0 top-full w-48 translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
			<div className="rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell">
				<ul className="grid gap-1">
					{group.items.map(({ href, label }) => (
						<li key={href}>
							<Link
								href={href}
								className="block rounded-md px-3 py-2 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
							>
								{label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	</div>
);
