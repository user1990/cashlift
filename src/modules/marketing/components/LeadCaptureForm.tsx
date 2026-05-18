"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/ui/components/Button";
import { ControlledTextField } from "@/ui/components/ControlledTextField";
import { type LeadCaptureFormValues, leadCaptureSchema } from "../schemas";

type LeadCaptureFormProps = {
	buttonLabel: string;
};

export const LeadCaptureForm = ({ buttonLabel }: LeadCaptureFormProps) => {
	const [submitted, setSubmitted] = useState(false);
	const form = useForm<LeadCaptureFormValues>({
		defaultValues: {
			company: "",
			email: "",
			name: "",
		},
		resolver: zodResolver(leadCaptureSchema),
	});

	const { control, handleSubmit, reset } = form;

	const submitForm = () => {
		setSubmitted(true);
		reset();
	};

	return (
		<form className="space-y-3" onSubmit={handleSubmit(submitForm)}>
			<ControlledTextField autoComplete="name" control={control} label="Name" name="name" placeholder="Maya Chen…" />

			<ControlledTextField
				autoComplete="email"
				control={control}
				label="Work email"
				name="email"
				placeholder="maya@company.com…"
				type="email"
			/>

			<ControlledTextField
				autoComplete="organization"
				control={control}
				label="Company"
				name="company"
				placeholder="Studio Nova…"
			/>

			<Button className="w-full" type="submit" variant="primary">
				{buttonLabel}
			</Button>

			{submitted && (
				<p aria-live="polite" className="text-s leading-5 text-signal">
					Demo request captured. No private company data was sent.
				</p>
			)}
		</form>
	);
};
