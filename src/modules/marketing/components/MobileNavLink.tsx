"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type MobileNavLinkProps = {
	children: ReactNode;
	href: string;
};

const closeNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
	event.currentTarget.closest("details")?.removeAttribute("open");
};

export const MobileNavLink = ({ children, href }: MobileNavLinkProps) => (
	<Link
		href={href}
		onClick={closeNavigation}
		className="rounded-md px-3 py-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground"
	>
		{children}
	</Link>
);
