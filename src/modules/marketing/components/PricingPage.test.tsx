import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingPage } from "./PricingPage";

describe("PricingPage", () => {
	it("renders the annual billing interval from the URL state", () => {
		render(<PricingPage billing="annual" />);

		expect(screen.getByRole("link", { name: "annual" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByText("$79")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Start with Control" })).toHaveAttribute(
			"href",
			"/checkout?plan=control&billing=annual",
		);
		expect(screen.getByRole("link", { name: "monthly" })).toHaveAttribute("href", "/pricing?billing=monthly");
	});

	it("shows the full plan comparison with a useful accessible name", () => {
		render(<PricingPage billing="annual" />);

		expect(screen.getByRole("region", { name: "Compare plans in full" })).toBeInTheDocument();
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByRole("row", { name: "Company workspaces 1 1 Multiple" })).toBeInTheDocument();
	});

	it("renders the monthly billing interval from the URL state", () => {
		render(<PricingPage billing="monthly" />);

		expect(screen.getByRole("link", { name: "monthly" })).toHaveAttribute("aria-current", "page");
		expect(screen.getByText("$99")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Start with Control" })).toHaveAttribute(
			"href",
			"/checkout?plan=control&billing=monthly",
		);
	});
});
