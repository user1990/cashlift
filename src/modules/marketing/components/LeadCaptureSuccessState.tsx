"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/ui/components/actions/Button";
import { cn } from "@/ui/utils/cn";
import { LEAD_CAPTURE_TRANSITION_KIND, type LeadCaptureTransitionVariant } from "../leadCaptureTransitions";
import { ActionLink } from "./ActionLink";

type LeadCaptureSuccessStateProps = {
	description: string;
	onReset: () => void;
	transitionVariant?: LeadCaptureTransitionVariant;
};

export const LeadCaptureSuccessState = ({
	description,
	onReset,
	transitionVariant = "opacityFast",
}: LeadCaptureSuccessStateProps) => (
	<div className="flex h-full flex-col gap-3">
		<div className="flex min-h-0 flex-1 flex-col">
			<div
				aria-atomic="true"
				aria-live="polite"
				data-lead-enter={transitionVariant}
				data-lead-enter-item="message"
				role="status"
				className={cn("border-signal border-l-2 pl-3", getItemClassName(transitionVariant))}
			>
				<p className="text-m leading-6">
					<span className="font-medium text-signal">Request received.</span>{" "}
					<span className="text-shell-muted">{description}</span>
				</p>
			</div>
		</div>

		<div
			data-lead-enter={transitionVariant}
			data-lead-enter-item="cta"
			className={cn("mt-auto grid gap-2", getItemClassName(transitionVariant))}
		>
			<ActionLink href="/demo/workspace" variant="primary" className="w-full">
				Explore live demo
			</ActionLink>

			<Button onPress={onReset} size="large" type="button" variant="secondary" className="w-full">
				<RotateCcw aria-hidden className="size-3.5" />
				Send another request
			</Button>
		</div>
	</div>
);

function getItemClassName(variant: LeadCaptureTransitionVariant) {
	return LEAD_CAPTURE_TRANSITION_KIND[variant] === "slide" ? "lead-success-enter-slide" : "lead-success-enter";
}
