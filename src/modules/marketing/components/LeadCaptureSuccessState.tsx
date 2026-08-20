"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/ui/components/actions/Button";
import { ActionLink } from "./ActionLink";

type LeadCaptureSuccessStateProps = {
	description: string;
	onReset: () => void;
};

export const LeadCaptureSuccessState = ({ description, onReset }: LeadCaptureSuccessStateProps) => (
	<div className="flex h-full flex-col gap-3">
		<div aria-atomic="true" aria-live="polite" role="status" className="flex min-h-0 flex-1 flex-col gap-3">
			<div aria-hidden className="h-px w-10 bg-signal" />

			<p className="text-m leading-6">
				<span className="font-medium text-signal">Received.</span>{" "}
				<span className="text-shell-muted">{description}</span>
			</p>
		</div>

		<div className="mt-auto grid gap-2">
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
