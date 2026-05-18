"use client";

import { Button as RAButton, type ButtonProps as RAButtonProps } from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type ButtonProps = RAButtonProps & {
	variant: "primary" | "secondary" | "ghost";
	children?: React.ReactNode;
	className?: string;
};

export const Button = ({ variant = "secondary", className, ...props }: ButtonProps) => (
	<RAButton
		className={cn(
			"inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-m font-medium outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease active:scale-[0.98] motion-reduce:active:scale-100",
			"focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
			variant === "primary" &&
				"border border-primary bg-primary text-primary-foreground shadow-none hover:bg-primary-hover hover:shadow-primary-glow",
			variant === "secondary" &&
				"border border-shell-border bg-shell-elevated text-shell-foreground hover:border-primary-subtle-border hover:text-primary",
			variant === "ghost" &&
				"border border-transparent text-muted-foreground hover:bg-panel-muted hover:text-panel-foreground",
			className,
		)}
		{...props}
	/>
);
