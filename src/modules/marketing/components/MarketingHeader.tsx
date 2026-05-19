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
	<Link href="/" className="shrink-0">
		<div className="flex items-center gap-2.5">
			<Image src={logo} alt="CashLift Logo" width={36} height={36} priority className="shrink-0" />

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
			href="/customers"
			className="inline-flex h-9 items-center rounded-md px-3 transition-colors duration-150 hover:text-primary"
		>
			Customers
		</Link>
	</nav>
);

const HeaderActions = () => (
	<div className="flex items-center gap-2">
		<Link
			href="/login"
			className="hidden h-9 items-center rounded-md px-3 text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary sm:inline-flex"
		>
			Login
		</Link>

		<Link
			href="/demo"
			className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
		>
			Run leak audit
		</Link>

		<MobileNav />
	</div>
);

const DesktopNavGroup = ({ group }: { group: NavGroup }) => (
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

const MobileNavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
	<Link
		href={href}
		className="rounded-md px-3 py-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground"
	>
		{children}
	</Link>
);
