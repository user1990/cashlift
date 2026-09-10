"use client";

import { CircleAlert } from "lucide-react";
import { FieldError } from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type FieldErrorMessageProps = {
	errorMessage?: string;
};

export const FieldErrorMessage = ({ errorMessage }: FieldErrorMessageProps) => (
	<div
		className={cn(
			"relative grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
			errorMessage ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
		)}
	>
		<div className="min-h-0 overflow-visible">
			{errorMessage && (
				<div
					aria-hidden="true"
					data-error-visible="true"
					data-slot="field-error-message"
					className="flex min-w-0 items-center gap-1.5 pt-1 text-red-400 text-s leading-5"
				>
					<CircleAlert aria-hidden className="size-3.5 shrink-0 text-red-400" strokeWidth={2.25} />

					<span className="min-w-0 break-words text-red-400">{errorMessage}</span>
				</div>
			)}

			{errorMessage && (
				<FieldError aria-live="polite" className="sr-only" data-slot="field-error">
					{errorMessage}
				</FieldError>
			)}
		</div>
	</div>
);
