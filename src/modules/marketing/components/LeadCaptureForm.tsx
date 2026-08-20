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
	playId?: number;
	submitted?: boolean;
	transitionVariant?: LeadCaptureTransitionVariant;
};

export const LeadCaptureForm = ({
	buttonLabel,
	onReset,
	onSuccess,
	playId = 0,
	submitted,
	successDescription,
	transitionVariant = "slide300",
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
		<div className="relative">
			<form
				aria-hidden={successVisible || undefined}
				data-lead-form-enter={transitionVariant}
				onSubmit={handleSubmit(submitForm)}
				className={getFormTransitionClassName(successVisible)}
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

			{successVisible && (
				<div key={playId} className="absolute inset-0">
					<LeadCaptureSuccessState
						description={successDescription}
						onReset={resetForm}
						transitionVariant={transitionVariant}
					/>
				</div>
			)}
		</div>
	);
};

function getFormTransitionClassName(successVisible: boolean) {
	return cn("flex flex-col gap-3 transition-opacity ease", successVisible && "pointer-events-none opacity-0");
}
