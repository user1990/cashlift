"use client";

import { Button as AriaButton, type ButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";

type AppButtonProps = ButtonProps & {
	variant?: "primary" | "secondary" | "ghost";
};

export function AppButton({
	className,
	variant = "secondary",
	...props
}: AppButtonProps) {
	return (
		<AriaButton
			className={cn(
				"inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out",
				"focus-visible:ring-[3px] focus-visible:ring-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50",
				variant === "primary" &&
					"border border-indigo-600 bg-indigo-600 text-white shadow-none hover:-translate-y-px hover:bg-indigo-700 hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
				variant === "secondary" &&
					"border border-[#E8E8EC] bg-white text-[#0A0A0A] hover:-translate-y-px hover:border-indigo-200 hover:bg-indigo-50/50",
				variant === "ghost" &&
					"border border-transparent text-[#6B6B6B] hover:bg-[#F4F4F5]",
				className,
			)}
			{...props}
		/>
	);
}
