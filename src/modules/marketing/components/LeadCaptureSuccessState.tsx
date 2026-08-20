"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/ui/components/actions/Button";
import { cn } from "@/ui/utils/cn";
import type { LeadCaptureTransitionVariant } from "../leadCaptureTransitions";
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
	transitionVariant = "fade",
}: LeadCaptureSuccessStateProps) => {
	const stagger = transitionVariant === "stagger";
	const centered = transitionVariant === "slow";

	return (
		<div className={cn("flex h-full flex-col gap-3", centered && "justify-center")}>
			<div
				aria-atomic="true"
				aria-live="polite"
				role="status"
				className={cn("flex min-h-0 flex-col gap-3", !centered && "flex-1")}
			>
				<div
					aria-hidden
					className={cn("h-px w-10 bg-signal", stagger && getStaggerItemClassName(visible, "delay-0"))}
				/>

				<p className={cn("text-m leading-6", stagger && getStaggerItemClassName(visible, "delay-75"))}>
					<span className="font-medium text-signal">Received.</span>{" "}
					<span className="text-shell-muted">{description}</span>
				</p>
			</div>

			<div
				className={cn("grid gap-2", !centered && "mt-auto", stagger && getStaggerItemClassName(visible, "delay-150"))}
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
};

function getStaggerItemClassName(visible: boolean, delayClassName: string) {
	return cn(
		"ease-out transition-[opacity,transform] duration-200 motion-reduce:delay-0 motion-reduce:transform-none motion-reduce:transition-none",
		delayClassName,
		visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
	);
}
