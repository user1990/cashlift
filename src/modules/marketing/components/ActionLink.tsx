import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/ui/utils/cn";

type ActionLinkProps = ComponentProps<typeof Link> & {
	variant?: "primary" | "secondary";
};

export const ActionLink = ({ children, className, variant = "primary", ...props }: ActionLinkProps) => (
	<Link
		className={cn(
			"inline-flex h-11 items-center justify-center rounded-md border px-4 text-m font-medium transition-[background-color,border-color,box-shadow,color] duration-150 ease",
			variant === "primary" &&
				"gap-2 border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-primary-glow",
			variant === "secondary" &&
				"border-shell-border bg-shell-elevated text-shell-foreground hover:border-primary-subtle-border hover:text-primary",
			className,
		)}
		{...props}
	>
		{children}
	</Link>
);
