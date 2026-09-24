import Link from "next/link";
import type { ReactNode } from "react";

type MobileNavLinkProps = {
	children: ReactNode;
	href: string;
	onNavigate?: () => void;
};

export const MobileNavLink = ({ children, href, onNavigate }: MobileNavLinkProps) => (
	<Link
		href={href}
		onClick={onNavigate}
		className="flex min-h-11 items-center rounded-md px-3 py-2 font-medium text-m text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground"
	>
		{children}
	</Link>
);
