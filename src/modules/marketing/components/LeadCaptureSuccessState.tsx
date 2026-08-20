"use client";

import { Button } from "@/ui/components/actions/Button";
import { ActionLink } from "./ActionLink";

export const LEAD_CAPTURE_SUCCESS_LAYOUTS = ["plain", "title", "next", "line", "stack"] as const;

export type LeadCaptureSuccessLayout = (typeof LEAD_CAPTURE_SUCCESS_LAYOUTS)[number];

type LeadCaptureSuccessStateProps = {
	description: string;
	onReset: () => void;
	title: string;
	layout?: LeadCaptureSuccessLayout;
};

export const LeadCaptureSuccessState = ({
	description,
	layout = "plain",
	onReset,
	title,
}: LeadCaptureSuccessStateProps) => (
	<div className="flex h-full flex-col gap-3">
		<div aria-atomic="true" aria-live="polite" role="status" className="flex min-h-0 flex-1 flex-col gap-3">
			{renderSuccessCopy({ description, layout, onReset, title })}
		</div>

		<ActionLink href="/demo/workspace" variant="primary" className="mt-auto w-full">
			Explore live demo
		</ActionLink>
	</div>
);

type SuccessCopyProps = {
	description: string;
	layout: LeadCaptureSuccessLayout;
	onReset: () => void;
	title: string;
};

function renderSuccessCopy({ description, layout, onReset, title }: SuccessCopyProps) {
	switch (layout) {
		case "title":
			return <h3 className="font-semibold text-l+ text-shell-foreground">{title}</h3>;

		case "next":
			return (
				<>
					<p className="font-medium text-primary text-s">Request received</p>

					<h3 className="text-l+ text-shell-foreground">{title}</h3>

					<p className="text-m text-shell-muted leading-6">{description}</p>

					{resetAction(onReset)}
				</>
			);

		case "line":
			return (
				<>
					<div aria-hidden className="h-px w-10 bg-signal" />

					<p className="font-medium text-s text-signal">Received</p>

					<h3 className="text-l+ text-shell-foreground">{title}</h3>

					<p className="text-m text-shell-muted leading-6">{description}</p>

					{resetAction(onReset)}
				</>
			);

		case "stack":
			return (
				<>
					<h3 className="text-l+ text-shell-foreground">{title}</h3>

					<p className="text-m text-shell-muted leading-6">{description}</p>

					<Button onPress={onReset} size="large" type="button" variant="secondary" className="w-full">
						Send another request
					</Button>
				</>
			);

		default:
			return (
				<>
					<h3 className="font-semibold text-l+ text-shell-foreground">{title}</h3>

					<p className="text-m text-shell-muted leading-6">{description}</p>

					{resetAction(onReset)}
				</>
			);
	}
}

function resetAction(onReset: () => void) {
	return (
		<Button onPress={onReset} type="button" variant="ghost" className="h-11 w-fit px-0 text-shell-muted">
			Send another request
		</Button>
	);
}
