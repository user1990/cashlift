// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PricingBillingToggle } from "./PricingBillingToggle";

const REPLACE_MOCK = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: REPLACE_MOCK,
	}),
}));

describe("PricingBillingToggle", () => {
	beforeEach(() => {
		REPLACE_MOCK.mockReset();
	});

	it("exposes a labeled radiogroup and updates billing from click and arrow keys", async () => {
		const user = userEvent.setup({ delay: null });
		const { rerender } = render(<PricingBillingToggle billing="annual" />);

		expect(screen.getByRole("radiogroup", { name: "Billing interval" })).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "Yearly" })).toBeChecked();

		await user.click(screen.getByRole("radio", { name: "Monthly" }));

		expect(REPLACE_MOCK).toHaveBeenCalledWith("/pricing?billing=monthly", { scroll: false });

		rerender(<PricingBillingToggle billing="monthly" />);

		expect(screen.getByRole("radio", { name: "Monthly" })).toBeChecked();

		await user.keyboard("{ArrowLeft}");

		expect(REPLACE_MOCK).toHaveBeenCalledWith("/pricing?billing=annual", { scroll: false });
	});
});
