import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PricingBillingToggle } from "./PricingBillingToggle";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: replaceMock,
	}),
}));

describe("PricingBillingToggle", () => {
	beforeEach(() => {
		replaceMock.mockReset();
	});

	it("exposes a labeled radiogroup and updates billing from click and arrow keys", async () => {
		const user = userEvent.setup();
		const { rerender } = render(<PricingBillingToggle billing="annual" />);

		expect(screen.getByRole("radiogroup", { name: "Billing interval" })).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: "Yearly" })).toBeChecked();
		expect(screen.getByRole("radio", { name: "Monthly" })).not.toBeChecked();
		expect(screen.getByText("Billed annually. Cancel anytime.")).toBeInTheDocument();

		await user.click(screen.getByRole("radio", { name: "Monthly" }));

		expect(replaceMock).toHaveBeenCalledWith("/pricing?billing=monthly", { scroll: false });

		rerender(<PricingBillingToggle billing="monthly" />);

		expect(screen.getByRole("radio", { name: "Monthly" })).toBeChecked();
		expect(screen.getByText("Billed monthly. Cancel anytime.")).toBeInTheDocument();

		await user.keyboard("{ArrowLeft}");

		expect(replaceMock).toHaveBeenCalledWith("/pricing?billing=annual", { scroll: false });

		rerender(<PricingBillingToggle billing="annual" />);

		expect(screen.getByRole("radio", { name: "Yearly" })).toBeChecked();
		expect(screen.getByText("Billed annually. Cancel anytime.")).toBeInTheDocument();
	});
});
