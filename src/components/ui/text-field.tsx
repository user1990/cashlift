"use client";

import {
	FieldError,
	Input,
	Label,
	TextField,
	type TextFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

type AppTextFieldProps = TextFieldProps & {
	label: string;
	placeholder?: string;
};

export function AppTextField({
	className,
	label,
	placeholder,
	...props
}: AppTextFieldProps) {
	return (
		<TextField className={cn("space-y-1.5", className)} {...props}>
			<Label className="text-xs font-medium text-[#0A0A0A]">{label}</Label>
			<Input
				className="h-10 w-full rounded-md border border-[#E8E8EC] bg-white px-3 text-sm text-[#0A0A0A] outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-[#9C9C9C] focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/15"
				placeholder={placeholder}
			/>
			<FieldError className="text-xs text-red-600" />
		</TextField>
	);
}
