import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "@/ui/components/Panel";

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
		const { container } = render(
			<Panel as="article">
				<p>Vendor renewal summary</p>
			</Panel>,
		);

		expect(container.firstElementChild).toHaveProperty("tagName", "ARTICLE");
		expect(container.firstElementChild).toHaveAttribute("data-slot", "card");
	});

	it.each([
		["light", "bg-panel"],
		["glass", "bg-shell-elevated/80"],
		["accent", "bg-primary-subtle"],
	] as const)("preserves the %s visual variant", (variant, background) => {
		const { container } = render(
			<Panel variant={variant}>
				<p>{variant}</p>
			</Panel>,
		);

		expect(container.firstElementChild).toHaveAttribute("data-variant", variant);
		expect(container.firstElementChild).toHaveClass(background);
	});
});
