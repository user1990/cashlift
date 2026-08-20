"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/ui/components/actions/Button";
import { ControlledEmailAutocompleteField } from "@/ui/components/forms/ControlledEmailAutocompleteField";
import { ControlledTextField } from "@/ui/components/forms/ControlledTextField";
import { cn } from "@/ui/utils/cn";
import { LEAD_CAPTURE_SCHEMA, type LeadCaptureFormValues } from "../schemas";
import { LeadCaptureSuccessState } from "./LeadCaptureSuccessState";

type LeadCaptureFormProps = {
	buttonLabel: string;
	successDescription: string;
};

export const LeadCaptureForm = ({ buttonLabel, successDescription }: LeadCaptureFormProps) => {
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
		reset();
		setSubmitted(true);
	};

	const resetForm = () => {
		setNameAutoFocus(true);
		setSubmitted(false);
		reset();
	};

	return (
		<div className="relative">
			<form
				aria-hidden={submitted || undefined}
				onSubmit={handleSubmit(submitForm)}
				className={cn(
					"ease flex flex-col gap-3 transition-[opacity] duration-150 motion-reduce:transition-none",
					submitted && "pointer-events-none opacity-0",
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
				aria-hidden={!submitted || undefined}
				className={cn(
					"ease absolute inset-0 transition-[opacity] duration-150 motion-reduce:transition-none",
					submitted ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			>
				<LeadCaptureSuccessState description={successDescription} onReset={resetForm} />
			</div>
		</div>
	);
};
