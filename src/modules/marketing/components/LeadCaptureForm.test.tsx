// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { LeadCaptureForm } from "./LeadCaptureForm";

vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();

	return {
		...actual,
		LazyMotion: ({ children }: { children: ReactNode }) => children,
		useReducedMotion: () => true,
	};
});

describe("LeadCaptureForm", () => {
	it("replaces the form with a success state and can reset to an empty form", async () => {
		const user = userEvent.setup({ delay: null });

		render(
			<LeadCaptureForm
				buttonLabel="Book demo"
				successDescription="We'll follow up with the audit walkthrough. You can explore the sample workspace now."
				successTitle="Demo request received"
			/>,
		);

		await fillLeadCaptureForm(user);
		await user.click(screen.getByRole("button", { name: "Book demo" }));

		expect(screen.queryByRole("textbox", { name: "Name" })).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Demo request received" })).toBeInTheDocument();
		expect(screen.getByRole("status")).toBeInTheDocument();
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

async function fillLeadCaptureForm(user: ReturnType<typeof userEvent.setup>) {
	const nameField = screen.getByRole("textbox", { name: "Name" });

	await user.click(nameField);
	await user.paste("Maya Chen");
	await user.tab();
	await user.paste("maya@company.com");
	await user.tab();
	await user.paste("Studio Nova");
}
