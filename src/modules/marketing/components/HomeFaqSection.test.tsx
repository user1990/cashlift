// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeFaqSection } from "./HomeFaqSection";

describe("HomeFaqSection", () => {
	it("shows and hides the answer when a question is toggled", async () => {
		const user = userEvent.setup();

		render(<HomeFaqSection />);

		const question = screen.getByRole("button", { name: "How does CashLift rank actions?" });
		const answer =
			"CashLift ranks the demo workspace by cash impact and urgency, then keeps the reason for each action beside the decision.";

		expect(question).toHaveAttribute("aria-expanded", "false");

		await user.click(question);

		await waitFor(() => {
			expect(question).toHaveAttribute("aria-expanded", "true");
			expect(screen.getByText(answer)).toBeVisible();
		});

		await user.click(question);

		await waitFor(() => {
			expect(question).toHaveAttribute("aria-expanded", "false");
		});
	});
});
