import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type ShellContainerProps = {
	children: ReactNode;
	className?: string;
};

export const ShellContainer = ({ children, className }: ShellContainerProps) => (
	<div className={cn("mx-auto grid max-w-[1180px] gap-4 px-4", className)}>{children}</div>
);
