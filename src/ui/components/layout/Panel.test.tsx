// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "@/ui/components/layout/Panel";

describe("Panel", () => {
	it("renders its content", () => {
		render(
			<Panel>
				<p>Review upcoming cash movement</p>
			</Panel>,
		);

		expect(screen.getByText("Review upcoming cash movement")).toBeInTheDocument();
	});

	it("uses the requested semantic element", () => {
		render(
			<Panel as="article">
				<p>Vendor renewal summary</p>
			</Panel>,
		);

		expect(screen.getByRole("article")).toHaveTextContent("Vendor renewal summary");
	});
});
