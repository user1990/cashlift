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
		<div className="flex min-h-0 flex-1 flex-col">
			<div
				aria-atomic="true"
				aria-live="polite"
				role="status"
				className="lead-success-enter-from-left border-signal border-l-2 pl-3 motion-reduce:animate-none"
			>
				<p className="text-m leading-6">
					<span className="font-medium text-signal">Request received.</span>{" "}
					<span className="text-shell-muted">{description}</span>
				</p>
			</div>
		</div>

		<div className="mt-auto grid gap-2">
			<ActionLink
				href="/demo/workspace"
				variant="primary"
				className="lead-success-enter-from-bottom w-full motion-reduce:animate-none"
			>
				Explore live demo
			</ActionLink>

			<Button onPress={onReset} size="large" type="button" variant="secondary" className="w-full">
				<RotateCcw aria-hidden className="size-3.5" />
				Send another request
			</Button>
		</div>
	</div>
);
