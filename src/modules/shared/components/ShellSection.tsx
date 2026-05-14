import type { ReactNode } from "react";
import { cn } from "@/modules/ui/utils/cn";

type ShellSectionProps = {
	children: ReactNode;
	className?: string;
};

export const ShellSection = ({ children, className }: ShellSectionProps) => (
	<section className={cn("border-y border-shell-border bg-shell-band", className)}>{children}</section>
);
