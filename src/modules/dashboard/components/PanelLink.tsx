import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PanelLinkProps = {
	children: ReactNode;
	href: string;
};

export const PanelLink = ({ children, href }: PanelLinkProps) => (
	<Link
		href={href}
		className="mt-6 flex h-11 items-center justify-between rounded-lg bg-panel-muted px-4 text-m font-semibold text-panel-foreground transition-colors duration-150 ease hover:bg-primary-subtle hover:text-primary"
	>
		{children}

		<ArrowRight aria-hidden className="size-4" />
	</Link>
);
