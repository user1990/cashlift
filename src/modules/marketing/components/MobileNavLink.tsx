import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type MobileNavLinkProps = {
	children: ReactNode;
	href: string;
	className?: string;
};

export const MobileNavLink = ({ children, className, href }: MobileNavLinkProps) => (
	<a
		href={href}
		className={cn(
			"rounded-md px-3 py-2 text-m font-medium text-shell-muted transition-colors duration-150 hover:bg-panel/10 hover:text-shell-foreground",
			className,
		)}
	>
		{children}
	</a>
);
