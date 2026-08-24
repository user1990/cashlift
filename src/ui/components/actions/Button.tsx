"use client";

import { Button as RACButton, type ButtonProps as RACButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { buttonVariants } from "./buttonVariants";

type ButtonProps = Omit<RACButtonProps, "className" | "isDisabled"> &
	VariantProps<typeof buttonVariants> & {
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
		className={buttonVariants({ className, size, variant })}
		data-slot="button"
		isDisabled={isDisabled ?? disabled}
		type={type}
		{...props}
	/>
);
