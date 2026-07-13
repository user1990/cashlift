"use client";

import { useActionState } from "react";
import { INITIAL_WORKSPACE_SETUP_FORM_STATE, provisionWorkspace, type WorkspaceSetupFormState } from "../actions";

const INDUSTRIES = [
	{ label: "Agency", value: "agency" },
	{ label: "Consulting", value: "consulting" },
	{ label: "Software services", value: "software-services" },
] as const;

export const WorkspaceSetupForm = () => {
	const [state, action, pending] = useActionState<WorkspaceSetupFormState, FormData>(
		provisionWorkspace,
		INITIAL_WORKSPACE_SETUP_FORM_STATE,
	);
	const nameError = state.fieldErrors?.name?.[0];
	const industryError = state.fieldErrors?.industry?.[0];

	return (
		<form action={action} className="mt-8 space-y-5">
			{state.message && (
				<p
					aria-live="polite"
					className="rounded-md border border-red-400/40 bg-red-400/10 p-3 text-s text-red-200"
					role="alert"
				>
					{state.message}
				</p>
			)}

			<div className="space-y-1.5">
				<label className="text-s font-medium text-panel-foreground" htmlFor="workspace-name">
					Company workspace name
				</label>

				<input
					aria-describedby={nameError ? "workspace-name-error" : undefined}
					aria-invalid={Boolean(nameError)}
					autoComplete="organization"
					className="h-10 w-full rounded-md border border-border bg-panel px-3 text-m text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 ease placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20"
					defaultValue=""
					id="workspace-name"
					name="name"
					placeholder="Studio Nova…"
					required
				/>

				{nameError && (
					<p className="text-s text-red-400" id="workspace-name-error">
						{nameError}
					</p>
				)}
			</div>

			<div className="space-y-1.5">
				<label className="text-s font-medium text-panel-foreground" htmlFor="workspace-industry">
					Industry
				</label>

				<select
					aria-describedby={industryError ? "workspace-industry-error" : undefined}
					aria-invalid={Boolean(industryError)}
					className="h-10 w-full rounded-md border border-border bg-panel px-3 text-m text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 ease focus:border-primary focus:ring-[3px] focus:ring-primary/20"
					defaultValue=""
					id="workspace-industry"
					name="industry"
					required
				>
					<option disabled value="">
						Select your industry…
					</option>

					{INDUSTRIES.map(({ label, value }) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>

				{industryError && (
					<p className="text-s text-red-400" id="workspace-industry-error">
						{industryError}
					</p>
				)}
			</div>

			<button
				className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-md border border-primary/80 bg-primary px-4 text-m font-semibold text-primary-foreground shadow-primary-glow transition-[background-color,border-color,box-shadow] duration-150 ease hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={pending}
				type="submit"
			>
				{pending ? "Creating workspace…" : "Create workspace"}
			</button>
		</form>
	);
};
