"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/ui/components/actions/Button";
import { Panel } from "@/ui/components/layout/Panel";
import { cn } from "@/ui/utils/cn";
import { LEAD_CAPTURE_TRANSITIONS, type LeadCaptureTransitionVariant } from "../leadCaptureTransitions";
import { LeadCaptureForm } from "./LeadCaptureForm";

const DEMO_BOOK_CARD_BACKGROUND_SRC = "/marketing/demo-book-card-bg.webp";
const PREVIEW_REPLAY_DELAY_MS = 40;

const TRANSITION_PREVIEW_LABELS = {
	fade: "Fade",
	hold: "Hold",
	rise: "Rise",
	slow: "Slow",
	stagger: "Stagger",
} as const satisfies Record<LeadCaptureTransitionVariant, string>;

export const DemoLeadCaptureSection = () => {
	const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const [previewTransition, setPreviewTransition] = useState<LeadCaptureTransitionVariant | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const playTransition = (variant: LeadCaptureTransitionVariant) => {
		window.clearTimeout(playTimeoutRef.current);
		setPreviewTransition(variant);
		setSubmitted(false);
		playTimeoutRef.current = setTimeout(() => {
			setSubmitted(true);
		}, PREVIEW_REPLAY_DELAY_MS);
	};

	return (
		<div className="flex flex-col gap-3 lg:self-start">
			<Panel as="section" variant="glass" className={getDemoLeadCapturePanelClassName()}>
				<Image
					alt=""
					fill
					sizes="(min-width: 1024px) 24rem, calc(100vw - 2rem)"
					src={DEMO_BOOK_CARD_BACKGROUND_SRC}
					className="pointer-events-none object-cover"
				/>

				<div aria-hidden className={getDemoLeadCaptureOverlayClassName()} />

				<div className="relative flex flex-col">
					<header className="mb-3">
						<p className="text-primary text-s+ uppercase tracking-normal">Book walkthrough</p>

						<h2 className="mt-2 text-l+ text-shell-foreground">Choose who we should contact</h2>
					</header>

					<LeadCaptureForm
						buttonLabel="Book an audit walkthrough"
						onReset={() => {
							window.clearTimeout(playTimeoutRef.current);
							setPreviewTransition(null);
							setSubmitted(false);
						}}
						onSuccess={() => {
							setPreviewTransition((variant) => variant ?? "fade");
							setSubmitted(true);
						}}
						submitted={submitted}
						successDescription="We'll follow up to arrange the audit walkthrough. You can explore the read-only workspace now."
						transitionVariant={previewTransition ?? "fade"}
					/>
				</div>
			</Panel>

			<div className="grid grid-cols-5 gap-2">
				{LEAD_CAPTURE_TRANSITIONS.map((variant) => (
					<Button
						key={variant}
						aria-pressed={previewTransition === variant && submitted}
						onPress={() => playTransition(variant)}
						size="small"
						variant={previewTransition === variant ? "primary" : "secondary"}
						className="min-h-11"
					>
						{TRANSITION_PREVIEW_LABELS[variant]}
					</Button>
				))}
			</div>
		</div>
	);
};

function getDemoLeadCapturePanelClassName() {
	return cn(
		"relative isolate flex flex-col overflow-hidden bg-transparent p-5 shadow-none backdrop-blur-none md:p-6",
		"[&_[data-slot=field-label]]:text-shell-foreground",
		"[&_[data-slot=input]]:border-shell-border [&_[data-slot=input]]:bg-shell/40 [&_[data-slot=input]]:text-shell-foreground",
		"[&_[data-slot=combobox-input]]:border-shell-border [&_[data-slot=combobox-input]]:bg-shell/40 [&_[data-slot=combobox-input]]:text-shell-foreground",
		"[&_[data-slot=combobox-list]]:border-shell-border [&_[data-slot=combobox-list]]:bg-shell-elevated/95",
	);
}

function getDemoLeadCaptureOverlayClassName() {
	return "pointer-events-none absolute inset-0 bg-shell/60 backdrop-blur-sm max-md:bg-shell/85 max-md:backdrop-blur-none";
}
