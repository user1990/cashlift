"use client";

import { CircleAlert } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
	FieldError,
	Input,
	TextField as RACTextField,
	type TextFieldProps as RACTextFieldProps,
} from "react-aria-components";
import { cn } from "@/ui/utils/cn";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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
	const lastErrorMessage = useRef(errorMessage);

	useEffect(() => {
		if (errorMessage) {
			lastErrorMessage.current = errorMessage;
		}
	}, [errorMessage]);

	const renderedErrorMessage = errorMessage ?? lastErrorMessage.current;

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

			{renderedErrorMessage && <FieldErrorMessage isVisible={Boolean(errorMessage)} message={renderedErrorMessage} />}

			{errorMessage && (
				<FieldError aria-live="polite" className="sr-only" data-slot="field-error">
					{errorMessage}
				</FieldError>
			)}
		</RACTextField>
	);
};

const ERROR_MESSAGE_TRANSITION_MS = 200;

function FieldErrorMessage({ isVisible, message }: { isVisible: boolean; message: string }) {
	const errorMessageRef = useRef<HTMLDivElement>(null);
	const animationFrameRef = useRef<number | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const [height, setHeight] = useState("0px");
	const [isAnimatedIn, setIsAnimatedIn] = useState(false);

	useIsomorphicLayoutEffect(() => {
		const errorMessageElement = errorMessageRef.current;

		if (!errorMessageElement) {
			return;
		}

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReducedMotion) {
			setHeight(isVisible ? "auto" : "0px");
			setIsAnimatedIn(isVisible);
			return;
		}

		if (isVisible) {
			setHeight("0px");
			setIsAnimatedIn(false);
			animationFrameRef.current = requestAnimationFrame(() => {
				setHeight(`${errorMessageElement.scrollHeight}px`);
				setIsAnimatedIn(true);
			});
			timeoutRef.current = window.setTimeout(() => setHeight("auto"), ERROR_MESSAGE_TRANSITION_MS);
		} else {
			setHeight(`${errorMessageElement.scrollHeight}px`);
			setIsAnimatedIn(false);
			animationFrameRef.current = requestAnimationFrame(() => setHeight("0px"));
		}

		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, [isVisible]);

	return (
		<div
			aria-hidden="true"
			className="overflow-hidden transition-[height,opacity] duration-[var(--motion-duration-standard)] ease-out motion-reduce:transition-none"
			data-error-visible={isVisible ? "true" : "false"}
			data-slot="field-error-message"
			ref={errorMessageRef}
			// biome-ignore lint/nursery/noInlineStyles: the measured height is required to animate to and from auto without clipping
			style={{ height, opacity: isAnimatedIn ? 1 : 0 }}
		>
			<div className="flex min-w-0 items-center gap-1.5 pt-1 text-red-400 text-s leading-5">
				<CircleAlert
					aria-hidden
					className={cn(
						"size-3.5 shrink-0 origin-center text-red-400 transition-[opacity,transform] duration-[var(--motion-duration-standard)] ease-out motion-reduce:transition-none",
						isAnimatedIn ? "scale-100 opacity-100" : "scale-0 opacity-0",
					)}
					strokeWidth={2.25}
				/>

				<span className="min-w-0 break-words text-red-400">{message}</span>
			</div>
		</div>
	);
}
