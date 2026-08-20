"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/ui/components/actions/Button";
import { cn } from "@/ui/utils/cn";
import { LEAD_CAPTURE_TRANSITION_PRESETS, type LeadCaptureTransitionVariant } from "../leadCaptureTransitions";
import { ActionLink } from "./ActionLink";

type LeadCaptureSuccessStateProps = {
	description: string;
	onReset: () => void;
	visible: boolean;
	transitionVariant?: LeadCaptureTransitionVariant;
};

export const LeadCaptureSuccessState = ({
	description,
	onReset,
	visible,
	transitionVariant = "opacityFast",
}: LeadCaptureSuccessStateProps) => (
	<div className="flex h-full flex-col gap-3">
		<div aria-atomic="true" aria-live="polite" role="status" className="flex min-h-0 flex-1 flex-col gap-3">
			<div aria-hidden className={cn("h-px w-10 bg-signal", getItemClassName(transitionVariant, visible, 0))} />

			<p className={cn("text-m leading-6", getItemClassName(transitionVariant, visible, 1))}>
				<span className="font-medium text-signal">Received.</span>{" "}
				<span className="text-shell-muted">{description}</span>
			</p>
		</div>

		<div className={cn("mt-auto grid gap-2", getItemClassName(transitionVariant, visible, 2))}>
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

function getItemClassName(variant: LeadCaptureTransitionVariant, visible: boolean, itemIndex: 0 | 1 | 2) {
	const preset = LEAD_CAPTURE_TRANSITION_PRESETS[variant];
	const slide = preset.kind === "slide";

	return cn(
		"ease-out motion-reduce:delay-0 motion-reduce:transition-none",
		preset.itemDurationClassName,
		preset.itemDelayClassNames[itemIndex],
		slide ? "transition-[opacity,transform] motion-reduce:transform-none" : "transition-[opacity]",
		visible ? "opacity-100" : "opacity-0",
		slide && (visible ? "translate-y-0" : "-translate-y-2"),
	);
}
