// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "@/ui/components/forms/TextField";

describe("TextField", () => {
	it("labels the input and reports value changes", async () => {
		const user = userEvent.setup({ delay: null });
		const onChange = vi.fn();

		render(<TextField label="Company" onChange={onChange} placeholder="Studio Nova" />);

		const input = screen.getByRole("textbox", { name: "Company" });

		await user.type(input, "CashLift");

		expect(input).toHaveValue("CashLift");
		expect(onChange).toHaveBeenLastCalledWith("CashLift");
	});

	it("shows validation errors", () => {
		render(<TextField errorMessage="Enter a company name" invalid label="Company" />);

		expect(screen.getByRole("textbox", { name: "Company" })).toBeInvalid();
		expect(screen.getByText("Enter a company name")).toBeInTheDocument();
	});
});
