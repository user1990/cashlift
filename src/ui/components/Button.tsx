"use client";

import { Button as RACButton, type ButtonProps as RACButtonProps } from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type ButtonProps = Omit<RACButtonProps, "className" | "isDisabled"> & {
	variant: "primary" | "secondary" | "ghost";
	className?: string;
	disabled?: boolean;
	isDisabled?: boolean;
};

export const Button = ({
	type = "button",
	variant = "secondary",
	className,
	disabled,
	isDisabled,
	...props
}: ButtonProps) => (
	<RACButton
		className={cn(
			"inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-m font-medium outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease active:scale-[0.98] motion-reduce:active:scale-100",
			"data-[focus-visible]:ring-[3px] data-[focus-visible]:ring-primary/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
			"data-[pressed]:scale-[0.98] motion-reduce:data-[pressed]:scale-100",
			variant === "primary" &&
				"border border-primary bg-primary text-primary-foreground shadow-none hover:bg-primary-hover hover:shadow-primary-glow",
			variant === "secondary" &&
				"border border-shell-border bg-shell-elevated text-shell-foreground hover:border-primary-subtle-border hover:text-primary",
			variant === "ghost" &&
				"border border-transparent text-muted-foreground hover:bg-panel-muted hover:text-panel-foreground",
			className,
		)}
		isDisabled={isDisabled ?? disabled}
		type={type}
		{...props}
	/>
);
