import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PricingPage } from "./PricingPage";

describe("PricingPage", () => {
	it("switches billing while keeping the selection shareable", async () => {
		const user = userEvent.setup();
		window.history.replaceState(null, "", "/pricing?billing=annual");
		render(<PricingPage initialBilling="annual" />);

		const annualButton = screen.getByRole("button", { name: "annual" });
		const monthlyButton = screen.getByRole("button", { name: "monthly" });
		expect(annualButton).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByText("$79")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Start with Control" })).toHaveAttribute(
			"href",
			"/checkout?plan=control&billing=annual",
		);

		await user.click(monthlyButton);

		expect(monthlyButton).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByText("$99")).toBeInTheDocument();
		expect(window.location.search).toEqual("?billing=monthly");
		expect(screen.getByRole("link", { name: "Start with Control" })).toHaveAttribute(
			"href",
			"/checkout?plan=control&billing=monthly",
		);
	});

	it("shows the full plan comparison with a useful accessible name", () => {
		render(<PricingPage initialBilling="annual" />);

		expect(screen.getByRole("region", { name: "Compare plans in full" })).toBeInTheDocument();
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByRole("row", { name: "Company workspaces 1 1 Multiple" })).toBeInTheDocument();
	});
});
