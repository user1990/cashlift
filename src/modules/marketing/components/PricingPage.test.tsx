import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingPage } from "./PricingPage";

describe("PricingPage", () => {
	it("renders the annual billing interval from the URL state", () => {
		render(<PricingPage billing="annual" />);

		expect(screen.getByRole("link", { name: "Yearly" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("link", { name: "Monthly" })).toHaveAttribute("href", "/pricing?billing=monthly");
		expect(screen.getByText("$79")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Start with Control" })).toHaveAttribute(
			"href",
			"/checkout?plan=control&billing=annual",
		);
		expect(screen.getAllByText("Save 20%")).toHaveLength(3);
	});

	it("shows the full plan comparison with a useful accessible name", () => {
		render(<PricingPage billing="annual" />);

		expect(screen.getByRole("region", { name: "Compare plans in full" })).toBeInTheDocument();
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByRole("row", { name: "Company workspaces 1 1 Multiple" })).toBeInTheDocument();
	});

	it("renders the monthly billing interval from the URL state", () => {
		render(<PricingPage billing="monthly" />);

		expect(screen.getByRole("link", { name: "Monthly" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByRole("link", { name: "Yearly" })).toHaveAttribute("href", "/pricing?billing=annual");
		expect(screen.getByText("$99")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Start with Control" })).toHaveAttribute(
			"href",
			"/checkout?plan=control&billing=monthly",
		);
		expect(screen.queryByText("Save 20%")).not.toBeInTheDocument();
	});
});
