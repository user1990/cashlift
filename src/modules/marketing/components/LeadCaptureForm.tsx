"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import { type LeadCaptureFormValues, leadCaptureSchema } from "../schemas";

type LeadCaptureFormProps = {
	buttonLabel: string;
};

type LeadCaptureFormState = {
	errors: Partial<Record<"company" | "email" | "name", string>>;
	submitted: boolean;
};

const INITIAL_FORM_STATE = {
	errors: {},
	submitted: false,
} as const satisfies LeadCaptureFormState;

const INITIAL_FORM_VALUES = {
	company: "",
	email: "",
	name: "",
} as const satisfies LeadCaptureFormValues;

export const LeadCaptureForm = ({ buttonLabel }: LeadCaptureFormProps) => {
	const [values, setValues] = useState<LeadCaptureFormValues>(INITIAL_FORM_VALUES);
	const [state, submitForm] = useActionState((_state: LeadCaptureFormState, formData: FormData) => {
		const result = validateLeadCaptureForm(formData);

		if (result.submitted) {
			setValues(INITIAL_FORM_VALUES);
		}

		return result;
	}, INITIAL_FORM_STATE);

	return (
		<form action={submitForm} className="space-y-3">
			<TextField
				autoComplete="name"
				errorMessage={state.errors.name}
				invalid={!!state.errors.name}
				label="Name"
				name="name"
				onChange={(name) => setValues((currentValues) => ({ ...currentValues, name }))}
				placeholder="Maya Chen…"
				value={values.name}
			/>

			<TextField
				autoComplete="email"
				errorMessage={state.errors.email}
				invalid={!!state.errors.email}
				label="Work email"
				name="email"
				onChange={(email) => setValues((currentValues) => ({ ...currentValues, email }))}
				placeholder="maya@company.com…"
				type="email"
				value={values.email}
			/>

			<TextField
				autoComplete="organization"
				errorMessage={state.errors.company}
				invalid={!!state.errors.company}
				label="Company"
				name="company"
				onChange={(company) => setValues((currentValues) => ({ ...currentValues, company }))}
				placeholder="Studio Nova…"
				value={values.company}
			/>

			<LeadCaptureSubmitButton label={buttonLabel} />

			{state.submitted && (
				<p aria-live="polite" className="text-s leading-5 text-signal">
					Demo request captured. No private company data was sent.
				</p>
			)}
		</form>
	);
};

const LeadCaptureSubmitButton = ({ label }: { label: string }) => {
	const { pending } = useFormStatus();

	return (
		<Button className="w-full" disabled={pending} type="submit" variant="primary">
			{pending ? "Capturing…" : label}
		</Button>
	);
};

function validateLeadCaptureForm(formData: FormData): LeadCaptureFormState {
	const result = leadCaptureSchema.safeParse({
		company: formData.get("company"),
		email: formData.get("email"),
		name: formData.get("name"),
	});

	if (!result.success) {
		const errors = result.error.flatten().fieldErrors;

		return {
			errors: {
				company: errors.company?.[0],
				email: errors.email?.[0],
				name: errors.name?.[0],
			},
			submitted: false,
		};
	}

	return {
		errors: {},
		submitted: true,
	};
}
