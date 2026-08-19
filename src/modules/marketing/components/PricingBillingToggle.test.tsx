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

	it("updates billing from the selected interval", async () => {
		const user = userEvent.setup({ delay: null });

		render(<PricingBillingToggle billing="annual" />);

		await user.click(screen.getByRole("radio", { name: "Monthly" }));

		expect(REPLACE_MOCK).toHaveBeenCalledWith("/pricing?billing=monthly", { scroll: false });
	});
});
