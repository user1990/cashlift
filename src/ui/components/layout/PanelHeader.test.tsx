import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/ui/components/actions/Button";
import { PanelHeader } from "@/ui/components/layout/PanelHeader";

describe("PanelHeader", () => {
	it("renders the title, label, and action", () => {
		render(
			<PanelHeader action={<Button variant="secondary">Export</Button>} label="Reporting" title="Monthly summary" />,
		);

		const heading = screen.getByRole("heading", { level: 2, name: "Monthly summary" });

		expect(heading).toHaveAttribute("data-slot", "card-title");
		expect(heading.closest('[data-slot="card-header"]')).toHaveAttribute("data-slot", "card-header");
		expect(screen.getByText("Reporting")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
	});
});
