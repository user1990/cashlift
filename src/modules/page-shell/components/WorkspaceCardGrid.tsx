import type { ReactNode } from "react";
import { cn } from "@/ui/utils/cn";

type WorkspaceCardGridProps = {
	children: ReactNode;
	as?: "div" | "ul";
	className?: string;
};

export const WorkspaceCardGrid = ({ as: Component = "div", children, className }: WorkspaceCardGridProps) => (
	<Component className={cn("grid gap-4 md:grid-cols-3", className)}>{children}</Component>
);
