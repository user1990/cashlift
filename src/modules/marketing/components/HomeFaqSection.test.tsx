// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeFaqSection } from "./HomeFaqSection";

describe("HomeFaqSection", () => {
	it("shows and hides the answer when a question is toggled", async () => {
		const user = userEvent.setup();

		render(<HomeFaqSection />);

		const question = screen.getByText("How does CashLift rank actions?");
		const answer = screen.getByText(/ranks the demo workspace by cash impact/);

		expect(answer).not.toBeVisible();

		await user.click(question);

		expect(answer).toBeVisible();

		await user.click(question);

		expect(answer).not.toBeVisible();
	});
});
