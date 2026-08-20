"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/ui/components/actions/Button";
import { ControlledEmailAutocompleteField } from "@/ui/components/forms/ControlledEmailAutocompleteField";
import { ControlledTextField } from "@/ui/components/forms/ControlledTextField";
import { LEAD_CAPTURE_SCHEMA, type LeadCaptureFormValues } from "../schemas";
import { LeadCaptureSuccessState } from "./LeadCaptureSuccessState";

type LeadCaptureFormProps = {
	buttonLabel: string;
	successDescription: string;
	successTitle: string;
};

export const LeadCaptureForm = ({ buttonLabel, successDescription, successTitle }: LeadCaptureFormProps) => {
	const [submitted, setSubmitted] = useState(false);
	const [nameAutoFocus, setNameAutoFocus] = useState(false);
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
		setSubmitted(true);
		reset();
	};

	const resetForm = () => {
		setNameAutoFocus(true);
		setSubmitted(false);
		reset();
	};

	if (submitted) {
		return <LeadCaptureSuccessState description={successDescription} onReset={resetForm} title={successTitle} />;
	}

	return (
		<form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-3">
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
	);
};
