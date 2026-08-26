"use client";

import { AnimatePresence, domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { useId } from "react";
import {
	FieldError,
	Input,
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

export const TextField = ({ errorMessage, id, invalid, label, placeholder, className, ...props }: TextFieldProps) => {
	const generatedFieldId = useId();
	const fieldId = id ?? generatedFieldId;
	const shouldReduceMotion = useReducedMotion();
	const errorTransition = {
		duration: shouldReduceMotion ? 0 : 0.2,
		ease: "easeOut" as const,
	};

	return (
		<RACTextField
			aria-label={label}
			isInvalid={invalid}
			className={cn(
				"space-y-1.5 [&:has(input[data-invalid])_input]:border-red-400 [&:has(input[data-invalid])_input]:transition-none [&:has(input[data-invalid])_input]:focus:border-red-400 [&:has(input[data-invalid])_input]:focus:ring-red-400/20",
				className,
			)}
			data-invalid={invalid || undefined}
			data-slot="field"
			id={fieldId}
			{...props}
		>
			<label className="font-medium text-panel-foreground text-s" data-slot="field-label" htmlFor={fieldId}>
				{label}
			</label>

			<Input
				data-slot="input"
				placeholder={placeholder}
				className="ease h-10 w-full rounded-md border border-border bg-panel px-3 text-m text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20"
			/>

			<div className="relative">
				<LazyMotion features={domAnimation}>
					<AnimatePresence initial={false} mode="popLayout">
						{errorMessage && (
							<m.div
								aria-hidden="true"
								className="overflow-visible"
								data-error-visible="true"
								data-slot="field-error-message"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={errorTransition}
							>
								<div className="flex min-w-0 items-center gap-1.5 pt-1 text-red-400 text-s leading-5">
									<m.span
										aria-hidden="true"
										className="flex size-3.5 shrink-0 origin-center"
										initial={{ opacity: 0, scale: 0.5 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.5 }}
										transition={errorTransition}
									>
										<CircleAlert className="size-3.5 text-red-400" strokeWidth={2.25} />
									</m.span>

									<span className="min-w-0 break-words text-red-400">{errorMessage}</span>
								</div>
							</m.div>
						)}
					</AnimatePresence>
				</LazyMotion>
			</div>

			{errorMessage && (
				<FieldError aria-live="polite" className="sr-only" data-slot="field-error">
					{errorMessage}
				</FieldError>
			)}
		</RACTextField>
	);
};
