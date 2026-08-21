// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LeadCaptureForm } from "./LeadCaptureForm";

describe("LeadCaptureForm", () => {
	it("offers the live demo after submit and restores the form on reset", async () => {
		const user = userEvent.setup();
		const buttonLabel = "Book an audit walkthrough";
		const successDescription = "We'll follow up to arrange the audit walkthrough.";

		render(<LeadCaptureForm buttonLabel={buttonLabel} successDescription={successDescription} />);

		await user.type(screen.getByLabelText("Name"), "Maya Chen");
		await user.type(screen.getByRole("combobox", { name: "Work email" }), "maya@company.com");
		await user.type(screen.getByLabelText("Company"), "Studio Nova");
		await user.click(screen.getByRole("button", { name: buttonLabel }));

		expect(screen.getByRole("status")).toHaveTextContent(successDescription);
		expect(screen.getByRole("link")).toHaveAttribute("href", "/demo/workspace");
		expect(screen.queryByRole("textbox", { name: "Name" })).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Send another request" }));

		expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
	});
});
