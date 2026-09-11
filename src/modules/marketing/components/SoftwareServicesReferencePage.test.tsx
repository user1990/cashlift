// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASES } from "../content";
import { SoftwareServicesReferencePage } from "./SoftwareServicesReferencePage";

describe("SoftwareServicesReferencePage", () => {
	it("shows the software-services decisions without adding card navigation", () => {
		const useCase = USE_CASES["software-services"];

		render(<SoftwareServicesReferencePage useCase={useCase} />);

		expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(useCase.answers.length);
		expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(["/demo"]);
	});
});
