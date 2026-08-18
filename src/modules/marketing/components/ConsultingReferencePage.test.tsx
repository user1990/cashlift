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
		expect(screen.getByRole("link", { name: answers[0], exact: false })).toHaveAttribute("href", "/demo");
		expect(screen.getByRole("link", { name: answers[1], exact: false })).toHaveAttribute("href", "/demo");
		expect(screen.getByRole("link", { name: answers[2], exact: false })).toHaveAttribute("href", "/demo");
		expect(screen.getByRole("link", { name: "Run use-case demo" })).toHaveAttribute("href", "/demo");
	});
});
