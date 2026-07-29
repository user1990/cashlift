import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Button } from "@/ui/components/actions/Button";
import { ControlledEmailAutocompleteField } from "@/ui/components/forms/ControlledEmailAutocompleteField";

type EmailFormValues = {
	email: string;
};

describe("ControlledEmailAutocompleteField", () => {
	it("submits the selected suggestion", async () => {
		const user = userEvent.setup();
		const input = renderEmailForm();

		await user.type(input, "ma");
		await user.click(await screen.findByRole("option", { name: "ma@gmail.com" }));
		await user.click(screen.getByRole("button", { name: "Save email" }));

		await waitFor(() => {
			expect(screen.getByText("Saved email: ma@gmail.com")).toBeInTheDocument();
		});
	});
});

function renderEmailForm() {
	render(<EmailForm />);

	return screen.getByRole("combobox", { name: "Work email" });
}

function EmailForm() {
	const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
	const { control, handleSubmit } = useForm<EmailFormValues>({
		defaultValues: {
			email: "",
		},
	});

	return (
		<form onSubmit={handleSubmit(({ email }) => setSubmittedEmail(email))}>
			<ControlledEmailAutocompleteField control={control} label="Work email" name="email" />

			<Button type="submit" variant="primary">
				Save email
			</Button>

			{submittedEmail !== null && <p>Saved email: {submittedEmail}</p>}
		</form>
	);
}
