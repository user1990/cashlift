"use client";

import {
	FieldError,
	Input,
	Label,
	TextField as RACTextField,
	type TextFieldProps as RACTextFieldProps,
} from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type TextFieldProps = Omit<RACTextFieldProps, "className"> & {
	label: string;
	className?: string;
	errorMessage?: string;
	invalid?: boolean;
	placeholder?: string;
};

export const TextField = ({ errorMessage, invalid, label, placeholder, className, ...props }: TextFieldProps) => (
	<RACTextField
		isInvalid={invalid}
		className={cn(
			"space-y-1.5 [&:has(input[data-invalid])_input]:border-red-400 [&:has(input[data-invalid])_input]:focus:border-red-400 [&:has(input[data-invalid])_input]:focus:ring-red-400/20",
			className,
		)}
		{...props}
	>
		<Label className="text-s font-medium text-panel-foreground">{label}</Label>

		<Input
			placeholder={placeholder}
			className="h-10 w-full rounded-md border border-border bg-panel px-3 text-m text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 ease placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20"
		/>

		{errorMessage && (
			<FieldError aria-live="polite" className="text-s text-red-400">
				{errorMessage}
			</FieldError>
		)}
	</RACTextField>
);
