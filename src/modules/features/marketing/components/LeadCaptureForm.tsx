"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/modules/ui/components/Button";
import { TextField } from "@/modules/ui/components/TextField";
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
			<Controller
				control={control}
				name="name"
				render={({ field, fieldState }) => (
					<TextField
						errorMessage={fieldState.error?.message}
						isInvalid={!!fieldState.error}
						label="Name"
						onBlur={field.onBlur}
						onChange={field.onChange}
						placeholder="Your name"
						value={field.value}
					/>
				)}
			/>

			<Controller
				control={control}
				name="email"
				render={({ field, fieldState }) => (
					<TextField
						autoComplete="email"
						errorMessage={fieldState.error?.message}
						isInvalid={!!fieldState.error}
						label="Work email"
						onBlur={field.onBlur}
						onChange={field.onChange}
						placeholder="you@company.com"
						type="email"
						value={field.value}
					/>
				)}
			/>

			<Controller
				control={control}
				name="company"
				render={({ field, fieldState }) => (
					<TextField
						errorMessage={fieldState.error?.message}
						isInvalid={!!fieldState.error}
						label="Company"
						onBlur={field.onBlur}
						onChange={field.onChange}
						placeholder="Company name"
						value={field.value}
					/>
				)}
			/>

			<Button className="w-full" type="submit" variant="primary">
				{buttonLabel}
			</Button>
		</form>
	);
};
