"use client";

import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "@/ui/components/Button";
import { ActionLink } from "./ActionLink";

const SUCCESS_ANIMATION = {
	hidden: { opacity: 0, transform: "translateY(8px)" },
	visible: { opacity: 1, transform: "translateY(0)" },
} as const;

type LeadCaptureSuccessStateProps = {
	description: string;
	onReset: () => void;
	title: string;
};

export const LeadCaptureSuccessState = ({ description, onReset, title }: LeadCaptureSuccessStateProps) => {
	const reducedMotion = useReducedMotion();

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				animate="visible"
				className="flex min-h-72 flex-1 flex-col justify-between rounded-lg border-2 border-signal bg-signal/5 p-4 shadow-panel"
				initial={reducedMotion ? "visible" : "hidden"}
				transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
				variants={SUCCESS_ANIMATION}
			>
				<div aria-atomic="true" aria-live="polite" role="status">
					<div className="flex size-10 items-center justify-center rounded-full bg-signal text-primary-foreground">
						<CheckCircle2 aria-hidden className="size-5" />
					</div>

					<h3 className="mt-4 text-l+ font-semibold text-panel-foreground">{title}</h3>

					<p className="mt-2 text-m leading-6 text-panel-foreground">{description}</p>
				</div>

				<div className="mt-6 grid gap-2">
					<ActionLink href="/dashboard" className="w-full" variant="primary">
						Explore dashboard
						<ArrowRight aria-hidden className="size-4" />
					</ActionLink>

					<Button className="w-full" onPress={onReset} size="large" type="button" variant="secondary">
						<RotateCcw aria-hidden className="size-3.5" />
						Send another request
					</Button>
				</div>
			</m.div>
		</LazyMotion>
	);
};
