import { ChevronDown, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { NavGroup } from "./marketingHeaderNavigation";
import { MARKETING_NAV_GROUPS } from "./marketingHeaderNavigation";

export const MobileNav = () => (
	<details className="group lg:hidden">
		<summary
			aria-label="Toggle navigation"
			className="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-md border border-shell-border bg-shell-elevated text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary-subtle-border hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden"
		>
			<MenuIcon aria-hidden className="size-4 group-open:hidden" />

			<X aria-hidden className="hidden size-4 group-open:block" />
		</summary>

		<nav
			aria-label="Mobile navigation"
			className="absolute inset-x-0 top-16 border-t border-shell-border bg-shell px-4 py-4 shadow-shell sm:px-6"
			id="marketing-mobile-nav"
		>
			<div className="mx-auto grid max-w-[1180px] gap-5">
				{MARKETING_NAV_GROUPS.map((group) => (
					<MobileNavGroup key={group.label} group={group} />
				))}

				<div className="grid gap-1 border-t border-shell-border pt-4">
					<MobileNavLink href="/customers">Customers</MobileNavLink>

					<MobileNavLink href="/login">Login</MobileNavLink>

					<Link
						href="/demo"
						className="mt-2 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
					>
						Run leak audit
					</Link>
				</div>
			</div>
		</nav>
	</details>
);

const MobileNavGroup = ({ group }: { group: NavGroup }) => (
	<details className="group">
		<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md px-3 text-s+ uppercase tracking-normal text-primary outline-none transition-colors duration-150 hover:bg-panel/10 focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
			{group.label}

			<ChevronDown aria-hidden className="size-4 transition-transform duration-150 group-open:rotate-180" />
		</summary>

		<div className="mt-2 grid gap-1 pl-3">
			{group.items.map(({ href, label }) => (
				<MobileNavLink key={href} href={href}>
					{label}
				</MobileNavLink>
			))}
		</div>
	</details>
);

const MobileNavLink = ({ children, href }: { children: ReactNode; href: string }) => (
	<Link
		href={href}
		className="rounded-md px-3 py-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground"
	>
		{children}
	</Link>
);
