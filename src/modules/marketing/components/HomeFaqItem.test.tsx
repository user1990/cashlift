// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeFaqItem } from "./HomeFaqItem";

describe("HomeFaqItem", () => {
	it("shows the answer when the question is toggled", async () => {
		const user = userEvent.setup({ delay: null });

		render(
			<HomeFaqItem
				answer="CashLift ranks the demo workspace by cash impact and urgency."
				question="How does CashLift rank actions?"
			/>,
		);

		const question = screen.getByRole("button", { name: "How does CashLift rank actions?" });

		expect(question).toHaveAttribute("aria-expanded", "false");

		await user.click(question);

		expect(question).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByText("CashLift ranks the demo workspace by cash impact and urgency.")).toBeVisible();
	});
});
