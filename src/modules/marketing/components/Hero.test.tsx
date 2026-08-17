// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
	it("renders a page title with one supporting description", () => {
		render(
			<Hero
				description="Flat team plans. Invite every employee without seat anxiety."
				label="Pricing"
				variant="page-title"
			/>,
		);

		expect(screen.getByRole("heading", { level: 1, name: "Pricing" })).toBeInTheDocument();
		expect(screen.getAllByText("Flat team plans. Invite every employee without seat anxiety.")).toHaveLength(1);
	});
});
