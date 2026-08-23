// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASES } from "../content";
import { SoftwareServicesReferencePage } from "./SoftwareServicesReferencePage";

describe("SoftwareServicesReferencePage", () => {
	it("shows the three software-services decisions without adding card navigation", () => {
		render(<SoftwareServicesReferencePage useCase={USE_CASES["software-services"]} />);

		expect(screen.getByRole("heading", { level: 1, name: "Software Services" })).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 2, name: "Can we add cloud spend for this project?" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 2, name: "Which subscription seats are idle before renewal?" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 2, name: "What happens if a milestone payment slips one week?" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Run use-case demo" })).toHaveAttribute("href", "/demo");
		expect(
			screen.queryByRole("link", { name: "Explore: Can we add cloud spend for this project?" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: "Explore: Which subscription seats are idle before renewal?" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: "Explore: What happens if a milestone payment slips one week?" }),
		).not.toBeInTheDocument();
	});
});
