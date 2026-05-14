import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MarketingHeader } from "./MarketingHeader";

const mockUsePathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
	usePathname: () => mockUsePathname(),
}));

describe("MarketingHeader", () => {
	beforeEach(() => {
		mockUsePathname.mockReturnValue("/");
	});

	it("opens Product menu from keyboard and moves focus into the menu", async () => {
		const user = userEvent.setup();
		render(<MarketingHeader />);

		const productTrigger = screen.getByRole("button", { name: "Product menu" });
		productTrigger.focus();
		await user.keyboard("{Enter}");

		const featuresItem = await screen.findByRole("menuitem", { name: "Features" });
		expect(featuresItem).toBeInTheDocument();

		await waitFor(() => {
			expect(featuresItem).toHaveFocus();
		});

		await user.keyboard("{Escape}");
		await waitFor(() => {
			expect(screen.queryByRole("menuitem", { name: "Features" })).not.toBeInTheDocument();
		});
	});
});
