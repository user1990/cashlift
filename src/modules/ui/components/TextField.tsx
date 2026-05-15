"use client";

import {
	FieldError,
	Input,
	Label,
	TextField as RACTextField,
	type TextFieldProps as RACTextFieldProps,
} from "react-aria-components";
import { cn } from "@/modules/ui/utils/cn";

type TextFieldProps = RACTextFieldProps & {
	label: string;
	errorMessage?: string;
	invalid?: boolean;
	placeholder?: string;
};

export const TextField = ({ className, errorMessage, invalid, label, placeholder, ...props }: TextFieldProps) => (
	<RACTextField className={cn("space-y-1.5", className)} isInvalid={invalid} {...props}>
		<Label className="text-s font-medium text-panel-foreground">{label}</Label>

		<Input
			placeholder={placeholder}
			className="h-10 w-full rounded-md border border-border bg-panel px-3 text-m text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 ease placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20"
		/>

		{errorMessage && <FieldError className="text-s text-red-600">{errorMessage}</FieldError>}
	</RACTextField>
);
