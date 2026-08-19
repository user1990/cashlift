// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "@/ui/components/forms/TextField";

describe("TextField", () => {
	it("shows validation errors", () => {
		render(<TextField errorMessage="Enter a company name" invalid label="Company" />);

		expect(screen.getByRole("textbox", { name: "Company" })).toBeInvalid();
		expect(screen.getByText("Enter a company name")).toBeInTheDocument();
	});
});
