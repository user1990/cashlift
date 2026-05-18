"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/ui/components/Button";
import { ControlledTextField } from "@/ui/components/ControlledTextField";
import { type LeadCaptureFormValues, leadCaptureSchema } from "../schemas";

type LeadCaptureFormProps = {
	buttonLabel: string;
};

export const LeadCaptureForm = ({ buttonLabel }: LeadCaptureFormProps) => {
	const form = useForm<LeadCaptureFormValues>({
		defaultValues: {
			company: "Studio Nova",
			email: "maya@studionova.example",
			name: "Maya Chen",
		},
		resolver: zodResolver(leadCaptureSchema),
	});

	const { control, handleSubmit, reset } = form;

	const submitForm = () => reset();

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
		</form>
	);
};
