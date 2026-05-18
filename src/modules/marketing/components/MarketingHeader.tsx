import { ChevronDown, MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";
import { PRODUCT_NAV, SOLUTION_NAV } from "../content";

type NavItem = {
	href: string;
	label: string;
};

type NavGroup = {
	items: readonly NavItem[];
	label: string;
};

const HEADER_PRODUCT_NAV = PRODUCT_NAV.filter((item) => item.href !== "/demo");

const DESKTOP_NAV_GROUPS = [
	{ items: HEADER_PRODUCT_NAV, label: "Product" },
	{ items: SOLUTION_NAV, label: "Solutions" },
] as const satisfies readonly NavGroup[];

export const MarketingHeader = () => (
	<header className="relative sticky top-0 z-30 border-b border-shell-border bg-shell/90 backdrop-blur">
		<div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
			<MarketingBrand />

			<DesktopNav />

			<HeaderActions />
		</div>
	</header>
);

const MarketingBrand = () => (
	<Link className="shrink-0" href="/">
		<div className="flex items-center gap-2.5">
			<Image src={logo} alt="CashLift Logo" className="shrink-0" width={36} height={36} priority />

			<span className="font-brand font-bold text-xl leading-none tracking-tight">
				<span className="text-foreground">Cash</span>

				<span className="text-signal">Lift</span>
			</span>
		</div>
	</Link>
);

const DesktopNav = () => (
	<nav aria-label="Main navigation" className="hidden items-center gap-2 text-m font-medium text-shell-muted lg:flex">
		{DESKTOP_NAV_GROUPS.map((group) => (
			<DesktopNavGroup key={group.label} group={group} />
		))}

		<Link
			className="inline-flex h-9 items-center rounded-md px-3 transition-colors duration-150 hover:text-primary"
			href="/customers"
		>
			Customers
		</Link>
	</nav>
);

const HeaderActions = () => (
	<div className="flex items-center gap-2">
		<Link
			className="hidden h-9 items-center rounded-md px-3 text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary sm:inline-flex"
			href="/login"
		>
			Login
		</Link>

		<Link
			className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
			href="/demo"
		>
			Run leak audit
		</Link>

		<MobileNav />
	</div>
);

const DesktopNavGroup = ({ group }: { group: NavGroup }) => (
	<details className="group relative">
		<summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1 rounded-md px-3 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
			{group.label}

			<ChevronDown aria-hidden className="size-4 transition-transform duration-150 group-open:rotate-180" />
		</summary>

		<div className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell">
			<ul className="grid gap-1">
				{group.items.map(({ href, label }) => (
					<li key={href}>
						<Link
							className="block rounded-md px-3 py-2 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
							href={href}
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	</details>
);

const MobileNav = () => (
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
				{DESKTOP_NAV_GROUPS.map((group) => (
					<MobileNavGroup key={group.label} group={group} />
				))}

				<div className="grid gap-1 border-t border-shell-border pt-4">
					<MobileNavLink href="/customers">Customers</MobileNavLink>

					<MobileNavLink href="/login">Login</MobileNavLink>

					<Link
						className="mt-2 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
						href="/demo"
					>
						Run leak audit
					</Link>
				</div>
			</div>
		</nav>
	</details>
);

const MobileNavGroup = ({ group }: { group: NavGroup }) => (
	<div>
		<p className="text-s+ uppercase tracking-normal text-primary">{group.label}</p>

		<div className="mt-2 grid gap-1">
			{group.items.map(({ href, label }) => (
				<MobileNavLink key={href} href={href}>
					{label}
				</MobileNavLink>
			))}
		</div>
	</div>
);

const MobileNavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
	<Link
		className="rounded-md px-3 py-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground"
		href={href}
	>
		{children}
	</Link>
);
