"use client";

import { Button as RACButton, type ButtonProps as RACButtonProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const BUTTON_VARIANTS = tv({
	base: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-semibold outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease active:scale-[0.98] motion-reduce:active:scale-100 data-focus-visible:ring-[3px] data-focus-visible:ring-primary/20 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:scale-[0.98] motion-reduce:data-pressed:scale-100",
	defaultVariants: {
		size: "default",
		variant: "secondary",
	},
	variants: {
		size: {
			default: "h-9 px-3 text-[0.875rem] leading-5",
			large: "h-11 px-4 text-[0.875rem] leading-5",
			small: "h-8 px-2.5 text-[0.75rem] leading-4",
		},
		variant: {
			ghost: "border border-transparent text-muted-foreground hover:bg-panel-muted hover:text-panel-foreground",
			primary:
				"border border-primary/80 bg-primary text-primary-foreground shadow-primary-glow hover:border-primary-hover hover:bg-primary-hover",
			secondary:
				"border border-shell-border bg-shell-elevated text-shell-foreground hover:border-primary-subtle-border hover:text-primary",
			success:
				"border border-signal/80 bg-signal text-primary-foreground shadow-[0_10px_24px_rgb(34_199_122/0.18)] hover:border-signal hover:bg-signal/90",
		},
	},
});

type ButtonProps = Omit<RACButtonProps, "className" | "isDisabled"> &
	VariantProps<typeof BUTTON_VARIANTS> & {
		variant: "ghost" | "primary" | "secondary" | "success";
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
	size = "default",
	...props
}: ButtonProps) => (
	<RACButton
		className={BUTTON_VARIANTS({ className, size, variant })}
		data-slot="button"
		isDisabled={isDisabled ?? disabled}
		type={type}
		{...props}
	/>
);
