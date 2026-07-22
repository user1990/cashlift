import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
	it("tells the daily decision story with truthful demo destinations", () => {
		render(<HomePage />);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("See what to collect, approve, or cut today.");
		expect(screen.getByRole("heading", { name: "Meet Studio Nova" })).toBeInTheDocument();
		expect(
			screen.getByText(
				"Studio Nova is a fictional services company used to demonstrate CashLift with realistic, illustrative data.",
			),
		).toBeInTheDocument();
		expect(screen.getByText("$126.5k")).toBeInTheDocument();
		expect(screen.getByText("$23k")).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Know the cash impact before saying yes." })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Chase the invoice that protects the buffer." })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Stop low-use renewals before they hit cash." })).toBeInTheDocument();
		expect(
			screen.getByRole("img", {
				name: "Studio Nova approval queue showing the cash remaining after a hardware request",
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "Studio Nova invoice view highlighting overdue collection risk" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", { name: "Studio Nova vendor view showing low-use and duplicate subscriptions" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("img", {
				name: "Studio Nova overview with ranked cash actions, 13-week cash outlook, and team budget charts",
			}),
		).toHaveAttribute("decoding", "async");

		for (const link of screen.getAllByRole("link", { name: "Open live demo" })) {
			expect(link).toHaveAttribute("href", "/demo/workspace");
		}

		expect(screen.getByRole("link", { name: "Book an audit walkthrough" })).toHaveAttribute("href", "/demo");
	});
});
