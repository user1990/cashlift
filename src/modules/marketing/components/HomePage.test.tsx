import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
	it("routes primary CTAs to the demo landing page and live workspace", () => {
		render(<HomePage />);

		expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "/demo/workspace");
		expect(screen.getByRole("link", { name: "Book an audit walkthrough" })).toHaveAttribute("href", "/demo");
	});

	it("keeps a single page title for the marketing story", () => {
		render(<HomePage />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
	});
});
