"use client";

import { AnimatePresence, domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { FieldError } from "react-aria-components";
import { cn } from "@/ui/utils/cn";

type FieldErrorMessageProps = {
	errorMessage?: string;
};

export const FieldErrorMessage = ({ errorMessage }: FieldErrorMessageProps) => {
	const shouldReduceMotion = useReducedMotion();
	const errorTransition = {
		duration: shouldReduceMotion ? 0 : 0.2,
		ease: "easeOut" as const,
	};

	return (
		<div
			className={cn(
				"relative grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
				errorMessage ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
			)}
		>
			<div className="min-h-0 overflow-visible">
				<LazyMotion features={domAnimation}>
					<AnimatePresence initial={false}>
						{errorMessage && (
							<m.div
								aria-hidden="true"
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

				{errorMessage && (
					<FieldError aria-live="polite" className="sr-only" data-slot="field-error">
						{errorMessage}
					</FieldError>
				)}
			</div>
		</div>
	);
};
