// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASES } from "../content";
import { ConsultingReferencePage } from "./ConsultingReferencePage";

describe("ConsultingReferencePage", () => {
	it("keeps every consulting decision and the primary CTA interactive", () => {
		render(<ConsultingReferencePage useCase={USE_CASES.consulting} />);

		expect(screen.getByRole("heading", { level: 1, name: "Consulting" })).toBeInTheDocument();

		const decisionLinks = screen.getAllByRole("link", { name: /^Explore:/ });

		expect(decisionLinks).toHaveLength(3);
		expect(decisionLinks.map((link) => link.getAttribute("href"))).toEqual(["/demo", "/demo", "/demo"]);
		expect(screen.getByRole("link", { name: "Run use-case demo" })).toHaveAttribute("href", "/demo");
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});
});
