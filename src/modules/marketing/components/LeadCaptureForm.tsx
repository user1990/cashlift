"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/ui/components/actions/Button";
import { ControlledEmailAutocompleteField } from "@/ui/components/forms/ControlledEmailAutocompleteField";
import { ControlledTextField } from "@/ui/components/forms/ControlledTextField";
import { cn } from "@/ui/utils/cn";
import type { LeadCaptureTransitionVariant } from "../leadCaptureTransitions";
import { LEAD_CAPTURE_SCHEMA, type LeadCaptureFormValues } from "../schemas";
import { LeadCaptureSuccessState } from "./LeadCaptureSuccessState";

type LeadCaptureFormProps = {
	buttonLabel: string;
	successDescription: string;
	onReset?: () => void;
	onSuccess?: () => void;
	submitted?: boolean;
	transitionVariant?: LeadCaptureTransitionVariant;
};

export const LeadCaptureForm = ({
	buttonLabel,
	onReset,
	onSuccess,
	submitted,
	successDescription,
	transitionVariant = "fade",
}: LeadCaptureFormProps) => {
	const [internalSubmitted, setInternalSubmitted] = useState(false);
	const [nameAutoFocus, setNameAutoFocus] = useState(false);
	const successVisible = submitted ?? internalSubmitted;
	const form = useForm<LeadCaptureFormValues>({
		defaultValues: {
			company: "",
			email: "",
			name: "",
		},
		resolver: zodResolver(LEAD_CAPTURE_SCHEMA),
	});

	const { control, handleSubmit, reset } = form;

	const submitForm = () => {
		reset();
		onSuccess?.();

		if (submitted === undefined) {
			setInternalSubmitted(true);
		}
	};

	const resetForm = () => {
		setNameAutoFocus(true);
		onReset?.();

		if (submitted === undefined) {
			setInternalSubmitted(false);
		}

		reset();
	};

	return (
		<div className="relative overflow-hidden">
			<form
				aria-hidden={successVisible || undefined}
				onSubmit={handleSubmit(submitForm)}
				className={getFormTransitionClassName(transitionVariant, successVisible)}
			>
				<ControlledTextField
					autoComplete="name"
					autoFocus={nameAutoFocus}
					control={control}
					label="Name"
					name="name"
					placeholder="Maya Chen…"
				/>

				<ControlledEmailAutocompleteField
					control={control}
					label="Work email"
					name="email"
					placeholder="maya@company.com…"
				/>

				<ControlledTextField
					autoComplete="organization"
					control={control}
					label="Company"
					name="company"
					placeholder="Studio Nova…"
				/>

				<Button type="submit" variant="primary" size="large" className="w-full">
					{buttonLabel}
				</Button>
			</form>

			<div
				aria-hidden={!successVisible || undefined}
				className={getSuccessTransitionClassName(transitionVariant, successVisible)}
			>
				<LeadCaptureSuccessState
					description={successDescription}
					onReset={resetForm}
					transitionVariant={transitionVariant}
					visible={successVisible}
				/>
			</div>
		</div>
	);
};

function getFormTransitionClassName(variant: LeadCaptureTransitionVariant, successVisible: boolean) {
	const hidden = successVisible && "pointer-events-none opacity-0";

	switch (variant) {
		case "hold":
			return cn("flex flex-col gap-3 transition-[opacity] duration-100 ease-in motion-reduce:transition-none", hidden);

		case "rise":
			return cn("flex flex-col gap-3 transition-[opacity] duration-150 ease motion-reduce:transition-none", hidden);

		case "slow":
			return cn(
				"flex flex-col gap-3 transition-[opacity,transform] duration-300 ease-in motion-reduce:transform-none motion-reduce:transition-none",
				successVisible ? "pointer-events-none scale-[0.98] opacity-0" : "scale-100 opacity-100",
			);

		case "stagger":
			return cn("flex flex-col gap-3 transition-[opacity] duration-100 ease-out motion-reduce:transition-none", hidden);

		default:
			return cn("flex flex-col gap-3 transition-[opacity] duration-150 ease motion-reduce:transition-none", hidden);
	}
}

function getSuccessTransitionClassName(variant: LeadCaptureTransitionVariant, successVisible: boolean) {
	switch (variant) {
		case "hold":
			return cn(
				"absolute inset-0 transition-[opacity] delay-150 duration-200 ease-out motion-reduce:delay-0 motion-reduce:transition-none",
				successVisible ? "opacity-100" : "pointer-events-none opacity-0",
			);

		case "rise":
			return cn(
				"absolute inset-0 transition-[opacity,transform] duration-200 ease motion-reduce:transform-none motion-reduce:transition-none",
				successVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
			);

		case "slow":
			return cn(
				"absolute inset-0 transition-[opacity,transform] delay-75 duration-500 ease-out motion-reduce:delay-0 motion-reduce:transform-none motion-reduce:transition-none",
				successVisible ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0",
			);

		case "stagger":
			return cn("absolute inset-0", successVisible ? "opacity-100" : "pointer-events-none");

		default:
			return cn(
				"absolute inset-0 transition-[opacity] duration-150 ease motion-reduce:transition-none",
				successVisible ? "opacity-100" : "pointer-events-none opacity-0",
			);
	}
}
