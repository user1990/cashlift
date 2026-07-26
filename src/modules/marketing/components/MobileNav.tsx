import { MenuIcon, X } from "lucide-react";
import { MobileNavLink } from "./MobileNavLink";
import type { NavGroup } from "./marketingHeaderNavigation";
import { MARKETING_NAV_GROUPS } from "./marketingHeaderNavigation";

export const MobileNav = () => (
	<details className="group/nav lg:hidden">
		<summary
			aria-label="Toggle navigation"
			className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-md border border-shell-border bg-shell-elevated text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary-subtle-border hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden"
		>
			<MenuIcon aria-hidden className="size-4 group-open/nav:hidden" />

			<X aria-hidden className="hidden size-4 group-open/nav:block" />
		</summary>

		<nav
			aria-label="Mobile navigation"
			className="fixed inset-x-0 top-16 hidden border-t border-shell-border bg-shell px-4 py-4 shadow-shell group-open/nav:block sm:px-6"
			id="marketing-mobile-nav"
		>
			<div className="mx-auto grid max-w-295 gap-5">
				{MARKETING_NAV_GROUPS.map((group) => (
					<MobileNavGroup key={group.label} group={group} />
				))}

				<MobileNavLink href="/customers">Customers</MobileNavLink>
			</div>
		</nav>
	</details>
);

const MobileNavGroup = ({ group }: { group: NavGroup }) => (
	<section aria-labelledby={`mobile-nav-${group.label.toLowerCase()}`}>
		<p className="px-3 text-s+ uppercase tracking-normal text-primary" id={`mobile-nav-${group.label.toLowerCase()}`}>
			{group.label}
		</p>

		<div className="mt-2 grid gap-1 pl-3">
			{group.items.map(({ href, label }) => (
				<MobileNavLink key={href} href={href}>
					{label}
				</MobileNavLink>
			))}
		</div>
	</section>
);
