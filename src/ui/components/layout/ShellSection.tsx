import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type ShellSectionProps = {
	children: ReactNode;
	className?: string;
};

export const ShellSection = ({ children, className }: ShellSectionProps) => (
	<section className={cn("border-shell-border border-y bg-shell-band", className)}>{children}</section>
);
