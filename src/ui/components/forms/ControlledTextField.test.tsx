// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Button } from "@/ui/components/actions/Button";
import { ControlledTextField } from "@/ui/components/forms/ControlledTextField";

type BudgetFormValues = {
	monthlyBudget: number;
};

describe("ControlledTextField", () => {
	it("formats, parses, and submits the controlled value", async () => {
		const user = userEvent.setup();
		render(<BudgetForm />);

		const input = screen.getByRole("textbox", { name: "Monthly budget" });

		expect(input).toHaveValue("1200");

		await user.clear(input);
		await user.type(input, "2500");
		await user.click(screen.getByRole("button", { name: "Save budget" }));

		await waitFor(() => {
			expect(screen.getByText("Saved budget: 2500")).toBeInTheDocument();
		});
	});
});

function BudgetForm() {
	const [submittedBudget, setSubmittedBudget] = useState<number | null>(null);
	const { control, handleSubmit } = useForm<BudgetFormValues>({
		defaultValues: {
			monthlyBudget: 1_200,
		},
	});

	return (
		<form onSubmit={handleSubmit(({ monthlyBudget }) => setSubmittedBudget(monthlyBudget))}>
			<ControlledTextField
				control={control}
				formatValue={(value) => String(value)}
				label="Monthly budget"
				name="monthlyBudget"
				parseValue={(value) => Number(value)}
			/>

			<Button type="submit" variant="primary">
				Save budget
			</Button>

			{submittedBudget !== null && <p>Saved budget: {submittedBudget}</p>}
		</form>
	);
}
