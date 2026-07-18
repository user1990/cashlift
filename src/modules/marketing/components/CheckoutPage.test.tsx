import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckoutPage } from "./CheckoutPage";

describe("CheckoutPage", () => {
	it("keeps the annual billing choice in the checkout summary", () => {
		render(<CheckoutPage billing="annual" planSlug="control" />);

		expect(screen.getByText("$79")).toBeInTheDocument();
		expect(screen.getByText("$948 billed annually")).toBeInTheDocument();
		expect(screen.getByText("Plan starts at $948/year")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Change plan" })).toHaveAttribute("href", "/pricing?billing=annual");
		expect(screen.getByRole("link", { name: "Back to pricing" })).toHaveAttribute("href", "/pricing?billing=annual");
	});
});
