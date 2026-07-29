import type { ReactNode } from "react";

type MobileNavLinkProps = {
	children: ReactNode;
	href: string;
};

export const MobileNavLink = ({ children, href }: MobileNavLinkProps) => (
	<a
		href={href}
		className="rounded-md px-3 py-2 font-medium text-m text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground"
	>
		{children}
	</a>
);
