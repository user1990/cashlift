"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/ui/components/actions/Button";
import { ControlledEmailAutocompleteField } from "@/ui/components/forms/ControlledEmailAutocompleteField";
import { ControlledTextField } from "@/ui/components/forms/ControlledTextField";
import { cn } from "@/ui/utils/cn";
import { LEAD_CAPTURE_SCHEMA, type LeadCaptureFormValues } from "../schemas";
import { type LeadCaptureSuccessLayout, LeadCaptureSuccessState } from "./LeadCaptureSuccessState";

type LeadCaptureFormProps = {
	buttonLabel: string;
	successDescription: string;
	successTitle: string;
	onReset?: () => void;
	onSuccess?: () => void;
	submitted?: boolean;
	successLayout?: LeadCaptureSuccessLayout;
};

export const LeadCaptureForm = ({
	buttonLabel,
	onReset,
	onSuccess,
	submitted,
	successDescription,
	successLayout = "plain",
	successTitle,
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
				onSubmit={handleSubmit(submitForm)}
				className={cn(
					"ease flex flex-col gap-3 transition-[opacity] duration-150 motion-reduce:transition-none",
					successVisible && "pointer-events-none opacity-0",
				)}
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
				className={cn(
					"ease absolute inset-0 transition-[opacity] duration-150 motion-reduce:transition-none",
					successVisible ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			>
				<LeadCaptureSuccessState
					description={successDescription}
					layout={successLayout}
					onReset={resetForm}
					title={successTitle}
				/>
			</div>
		</div>
	);
};
