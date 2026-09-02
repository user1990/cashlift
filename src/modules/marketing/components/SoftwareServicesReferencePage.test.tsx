// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASES } from "../content";
import { SoftwareServicesReferencePage } from "./SoftwareServicesReferencePage";

describe("SoftwareServicesReferencePage", () => {
	it("shows the three software-services decisions without adding card navigation", () => {
		const useCase = USE_CASES["software-services"];

		render(<SoftwareServicesReferencePage useCase={useCase} />);

		expect(screen.getByRole("heading", { level: 1, name: useCase.label })).toBeInTheDocument();
		expect(screen.getAllByRole("heading", { level: 2 }).map(({ textContent }) => textContent)).toEqual([
			...useCase.answers,
		]);
		expect(screen.getByRole("link", { name: "Book a walkthrough" })).toHaveAttribute("href", "/demo");

		for (const answer of useCase.answers) {
			expect(screen.queryByRole("link", { name: `Book a walkthrough: ${answer}` })).not.toBeInTheDocument();
		}
	});
});
