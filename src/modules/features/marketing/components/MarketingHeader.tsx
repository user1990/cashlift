"use client";

import { ChevronDown, MenuIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import logo from "@/app/logo.svg";
import { cn } from "@/modules/ui/utils/cn";
import { PRODUCT_NAV, SOLUTION_NAV } from "../content";

type NavItem = {
	href: string;
	label: string;
};

type NavGroup = {
	items: NavItem[];
	label: string;
};

const HEADER_PRODUCT_NAV = PRODUCT_NAV.filter((item) => item.href !== "/demo");

const DESKTOP_NAV_GROUPS = [
	{ items: HEADER_PRODUCT_NAV, label: "Product" },
	{ items: SOLUTION_NAV, label: "Solutions" },
] satisfies NavGroup[];

const activeLink = (href: string, pathname: string) => pathname === href || pathname.startsWith(`${href}/`);

const activeGroup = (group: NavGroup, pathname: string) => group.items.some((item) => activeLink(item.href, pathname));

export const MarketingHeader = () => {
	const pathname = usePathname();

	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	return (
		<header className="sticky top-0 z-30 border-b border-shell-border bg-shell/90 backdrop-blur @container-[scroll-state]">
			<div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16 transition-[height] duration-300 ease-in-out [@container_scroll-state(stuck:top)]:h-11">
				<MarketingBrand onNavigate={() => setMobileNavOpen(false)} />

				<DesktopNav pathname={pathname} />

				<HeaderActions
					mobileNavOpen={mobileNavOpen}
					onNavigate={() => setMobileNavOpen(false)}
					pathname={pathname}
					toggleMobileNav={() => setMobileNavOpen((open) => !open)}
				/>
			</div>

			<MobileNav onNavigate={() => setMobileNavOpen(false)} open={mobileNavOpen} pathname={pathname} />
		</header>
	);
};

const MarketingBrand = ({ onNavigate }: { onNavigate: () => void }) => (
	<Link className="shrink-0" href="/" onClick={onNavigate}>
		<div className="flex items-center gap-2.5">
			<div className="w-[34px] h-[34px] shrink-0 transition-[width,height] duration-300 ease-in-out [@container_scroll-state(stuck:top)]:w-[22px] [@container_scroll-state(stuck:top)]:h-[22px]"></div>

			<Image unoptimized src={logo} alt="CashLift Logo" width={36} height={36} className="h-9 w-9 shrink-0" />

			<span className="font-brand font-bold text-xl tracking-tight leading-none transition-[font-size] duration-300 ease-in-out [@container_scroll-state(stuck:top)]:text-sm">
				<span className="text-foreground">Cash</span>

				<span className="text-[#16a163]">Lift</span>
			</span>
		</div>
	</Link>
);

const DesktopNav = ({ pathname }: { pathname: string }) => (
	<nav aria-label="Main navigation" className="hidden items-center gap-2 text-m font-medium text-shell-muted lg:flex">
		{DESKTOP_NAV_GROUPS.map((group) => (
			<DesktopNavMenu key={group.label} group={group} pathname={pathname} />
		))}

		<Link
			aria-current={activeLink("/customers", pathname) ? "page" : undefined}
			className={cn(
				"inline-flex h-9 items-center rounded-md px-3 transition-colors duration-150 hover:text-primary",
				activeLink("/customers", pathname) && "text-primary",
			)}
			href="/customers"
		>
			Customers
		</Link>
	</nav>
);

const HeaderActions = ({
	mobileNavOpen,
	onNavigate,
	pathname,
	toggleMobileNav,
}: {
	mobileNavOpen: boolean;
	onNavigate: () => void;
	pathname: string;
	toggleMobileNav: () => void;
}) => (
	<div className="flex items-center gap-2">
		<Link
			aria-current={activeLink("/login", pathname) ? "page" : undefined}
			className={cn(
				"hidden h-9 items-center rounded-md px-3 text-m font-medium text-shell-muted transition-colors duration-150 hover:text-primary sm:inline-flex",
				activeLink("/login", pathname) && "text-primary",
			)}
			href="/login"
		>
			Login
		</Link>

		<Link
			className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
			href="/demo"
			onClick={onNavigate}
		>
			Run leak audit
		</Link>

		<Button
			aria-controls="marketing-mobile-nav"
			aria-expanded={mobileNavOpen}
			aria-label={getMobileNavButtonLabel(mobileNavOpen)}
			className="inline-flex size-9 items-center justify-center rounded-md border border-shell-border bg-shell-elevated text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary-subtle-border hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 lg:hidden"
			onPress={toggleMobileNav}
		>
			<MobileNavButtonIcon open={mobileNavOpen} />
		</Button>
	</div>
);

const MobileNavButtonIcon = ({ open }: { open: boolean }) => {
	const Icon = open ? X : MenuIcon;

	return <Icon aria-hidden className="size-4" />;
};

const MobileNav = ({ onNavigate, open, pathname }: { onNavigate: () => void; open: boolean; pathname: string }) => {
	if (!open) {
		return null;
	}

	return (
		<nav
			aria-label="Mobile navigation"
			className="border-t border-shell-border px-4 py-4 sm:px-6 lg:hidden"
			id="marketing-mobile-nav"
		>
			<div className="mx-auto grid max-w-[1180px] gap-5">
				{DESKTOP_NAV_GROUPS.map((group) => (
					<MobileNavGroup key={group.label} group={group} onNavigate={onNavigate} pathname={pathname} />
				))}

				<div className="grid gap-1 border-t border-shell-border pt-4">
					<MobileNavLink href="/customers" onNavigate={onNavigate} pathname={pathname}>
						Customers
					</MobileNavLink>

					<MobileNavLink href="/login" onNavigate={onNavigate} pathname={pathname}>
						Login
					</MobileNavLink>

					<Link
						className="mt-2 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-3 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
						href="/demo"
						onClick={onNavigate}
					>
						Run leak audit
					</Link>
				</div>
			</div>
		</nav>
	);
};

const MobileNavGroup = ({
	group,
	onNavigate,
	pathname,
}: {
	group: NavGroup;
	onNavigate: () => void;
	pathname: string;
}) => (
	<div>
		<p className="text-s+ uppercase tracking-normal text-primary">{group.label}</p>

		<div className="mt-2 grid gap-1">
			{group.items.map(({ href, label }) => (
				<MobileNavLink key={href} href={href} onNavigate={onNavigate} pathname={pathname}>
					{label}
				</MobileNavLink>
			))}
		</div>
	</div>
);

const DesktopNavMenu = ({ group, pathname }: { group: NavGroup; pathname: string }) => {
	const groupActive = activeGroup(group, pathname);

	return (
		<MenuTrigger>
			<Button
				aria-label={`${group.label} menu`}
				className={cn(
					"inline-flex h-9 items-center gap-1 rounded-md px-3 text-m font-medium text-shell-muted outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20",
					groupActive && "text-primary",
				)}
			>
				{group.label}

				<ChevronDown aria-hidden className="size-4" />
			</Button>

			<Popover
				className="w-48 rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-shell outline-none"
				offset={8}
				placement="bottom start"
			>
				<Menu className="grid gap-1 outline-none" items={group.items}>
					{({ href, label }) => {
						const itemActive = activeLink(href, pathname);

						return (
							<MenuItem
								aria-current={itemActive ? "page" : undefined}
								className={({ isFocusVisible, isHovered }) =>
									cn(
										"rounded-md px-3 py-2 text-m font-medium text-shell-muted outline-none transition-colors duration-150",
										(isHovered || isFocusVisible) && "bg-panel/10 text-shell-foreground",
										itemActive && "text-primary",
									)
								}
								href={href}
								id={href}
								textValue={label}
							>
								{label}
							</MenuItem>
						);
					}}
				</Menu>
			</Popover>
		</MenuTrigger>
	);
};

const MobileNavLink = ({
	children,
	href,
	onNavigate,
	pathname,
}: {
	children: React.ReactNode;
	href: string;
	onNavigate: () => void;
	pathname: string;
}) => (
	<Link
		aria-current={activeLink(href, pathname) ? "page" : undefined}
		className={cn(
			"rounded-md px-3 py-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground",
			activeLink(href, pathname) && "bg-primary/10 text-primary",
		)}
		href={href}
		onClick={onNavigate}
	>
		{children}
	</Link>
);

const getMobileNavButtonLabel = (open: boolean) => (open ? "Close navigation" : "Open navigation");
