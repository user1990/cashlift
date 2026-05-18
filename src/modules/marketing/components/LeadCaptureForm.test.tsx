import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LeadCaptureForm } from "./LeadCaptureForm";

describe("LeadCaptureForm", () => {
	it("validates required fields before showing demo success feedback", async () => {
		const user = userEvent.setup();
		render(<LeadCaptureForm buttonLabel="Run leak audit" />);

		await user.click(screen.getByRole("button", { name: "Run leak audit" }));

		expect(await screen.findByText("Your name is required.")).toBeInTheDocument();
		expect(screen.queryByText("Demo request captured. No private company data was sent.")).not.toBeInTheDocument();
	});

	it("shows explicit demo feedback after submission", async () => {
		const user = userEvent.setup();
		render(<LeadCaptureForm buttonLabel="Run leak audit" />);

		await user.type(screen.getByRole("textbox", { name: "Name" }), "Maya Chen");
		await user.type(screen.getByRole("textbox", { name: "Work email" }), "maya@studionova.example");
		await user.type(screen.getByRole("textbox", { name: "Company" }), "Studio Nova");
		await user.click(screen.getByRole("button", { name: "Run leak audit" }));

		expect(await screen.findByText("Demo request captured. No private company data was sent.")).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("");
	});
});
