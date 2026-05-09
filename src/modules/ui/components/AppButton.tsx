"use client";

import { Button as AriaButton, type ButtonProps } from "react-aria-components";
import { cn } from "@/modules/ui/utils/cn";

type AppButtonProps = ButtonProps & {
	variant?: "primary" | "secondary" | "ghost";
};

export const AppButton = ({
	variant = "secondary",
	className,
	...props
}: AppButtonProps) => (
	<AriaButton
		className={cn(
			"inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out",
			"focus-visible:ring-[3px] focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
			variant === "primary" &&
				"border border-primary bg-primary text-primary-foreground shadow-none hover:-translate-y-px hover:bg-primary-hover hover:shadow-primary-glow",
			variant === "secondary" &&
				"border border-[#E8E8EC] bg-white text-[#0A0A0A] hover:-translate-y-px hover:border-primary-subtle-border hover:bg-primary-subtle/50",
			variant === "ghost" &&
				"border border-transparent text-[#6B6B6B] hover:bg-[#F4F4F5]",
			className,
		)}
		{...props}
	/>
);
