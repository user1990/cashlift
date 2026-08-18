// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { USE_CASES } from "../content";
import { ConsultingReferencePage } from "./ConsultingReferencePage";

describe("ConsultingReferencePage", () => {
	it("keeps every consulting decision and the primary CTA interactive", () => {
		const { answers, label } = USE_CASES.consulting;

		render(<ConsultingReferencePage useCase={USE_CASES.consulting} />);

		expect(screen.getByRole("heading", { level: 1, name: label })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: `Explore: ${answers[0]}` })).toHaveAttribute("href", "/demo");
		expect(screen.getByRole("link", { name: `Explore: ${answers[1]}` })).toHaveAttribute("href", "/demo");
		expect(screen.getByRole("link", { name: `Explore: ${answers[2]}` })).toHaveAttribute("href", "/demo");
		expect(screen.getByRole("link", { name: "Run use-case demo" })).toHaveAttribute("href", "/demo");
	});
});
