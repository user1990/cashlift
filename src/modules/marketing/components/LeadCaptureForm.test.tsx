// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LeadCaptureForm } from "./LeadCaptureForm";

describe("LeadCaptureForm", () => {
	it("crossfades to success without unmounting the fields", async () => {
		const user = userEvent.setup();

		render(
			<LeadCaptureForm
				buttonLabel="Book an audit walkthrough"
				successDescription="We'll follow up to arrange the audit walkthrough. You can explore the read-only workspace now."
			/>,
		);

		await user.type(screen.getByLabelText("Name"), "Maya Chen");
		await user.type(screen.getByRole("combobox", { name: "Work email" }), "maya@company.com");
		await user.type(screen.getByLabelText("Company"), "Studio Nova");
		await user.click(screen.getByRole("button", { name: "Book an audit walkthrough" }));

		expect(screen.getByRole("status")).toHaveTextContent(
			"Received. We'll follow up to arrange the audit walkthrough. You can explore the read-only workspace now.",
		);
		expect(screen.getByRole("link", { name: "Explore live demo" })).toBeInTheDocument();
		expect(screen.queryByRole("textbox", { name: "Name" })).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Send another request" }));

		expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
	});
});
