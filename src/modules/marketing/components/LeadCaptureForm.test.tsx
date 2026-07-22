import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LeadCaptureForm } from "./LeadCaptureForm";

describe("LeadCaptureForm", () => {
	it("replaces the form with a success state and can reset to an empty form", async () => {
		const user = userEvent.setup();

		render(
			<LeadCaptureForm
				buttonLabel="Book demo"
				successDescription="We'll follow up with the audit walkthrough. You can explore the sample workspace now."
				successTitle="Demo request received"
			/>,
		);

		await user.type(screen.getByRole("textbox", { name: "Name" }), "Maya Chen");
		await user.type(screen.getByRole("combobox", { name: "Work email" }), "maya@company.com");
		await user.type(screen.getByRole("textbox", { name: "Company" }), "Studio Nova");
		await user.click(screen.getByRole("button", { name: "Book demo" }));

		expect(screen.queryByRole("textbox", { name: "Name" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Book demo" })).not.toBeInTheDocument();
		const successHeading = screen.getByRole("heading", { name: "Demo request received" });

		expect(screen.getByRole("status")).toContainElement(successHeading);
		expect(successHeading).not.toHaveAttribute("tabindex");
		expect(document.body).toHaveFocus();
		expect(
			screen.getByText("We'll follow up with the audit walkthrough. You can explore the sample workspace now."),
		).toBeInTheDocument();
		expect(screen.queryByText("Demo request captured. No private company data was sent.")).not.toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Explore live demo/i })).toHaveAttribute("href", "/demo/workspace");

		await user.click(screen.getByRole("button", { name: /Send another request/i }));

		const nameField = screen.getByRole("textbox", { name: "Name" });

		expect(nameField).toHaveFocus();
		expect(nameField).toHaveValue("");
		expect(screen.getByRole("combobox", { name: "Work email" })).toHaveValue("");
		expect(screen.getByRole("textbox", { name: "Company" })).toHaveValue("");
		expect(screen.getByRole("button", { name: "Book demo" })).toBeInTheDocument();
	});
});
