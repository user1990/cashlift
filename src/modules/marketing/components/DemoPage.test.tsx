// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DemoPage } from "./DemoPage";

describe("DemoPage", () => {
	it("explains the walkthrough and keeps both demo paths available", () => {
		render(<DemoPage />);

		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "/demo/workspace");
		expect(screen.getByRole("button", { name: "Book an audit walkthrough" })).toBeInTheDocument();
	});
});
