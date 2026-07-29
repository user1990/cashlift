// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DemoPage } from "./DemoPage";

describe("DemoPage", () => {
	it("explains the walkthrough and keeps both demo paths available", () => {
		render(<DemoPage />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: "See the cash leak. Understand the impact. Know what to do next.",
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"We’ll use the Studio Nova workspace to turn approval, collection, and renewal questions into a ranked action plan.",
			),
		).toBeInTheDocument();
		expect(screen.getByText("Realistic mock data. No setup.")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "/demo/workspace");
		expect(screen.getByRole("button", { name: "Book an audit walkthrough" })).toBeInTheDocument();
	});
});
