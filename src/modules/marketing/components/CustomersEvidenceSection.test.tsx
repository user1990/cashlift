// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PROOF_POINTS } from "../content";
import { CustomersEvidenceSection } from "./CustomersEvidenceSection";

describe("CustomersEvidenceSection", () => {
	it("renders every proof point in a photographic glass evidence path", () => {
		render(<CustomersEvidenceSection />);

		expect(document.querySelectorAll('[data-variant="glass"]')).toHaveLength(PROOF_POINTS.length);
		expect(screen.getAllByRole("listitem")).toHaveLength(PROOF_POINTS.length);

		for (const { metric, text } of PROOF_POINTS) {
			expect(screen.getByText(metric)).toBeInTheDocument();
			expect(screen.getByText(text)).toBeInTheDocument();
		}
	});
});
