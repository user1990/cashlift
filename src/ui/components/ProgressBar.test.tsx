import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "@/ui/components/ProgressBar";

describe("ProgressBar", () => {
	it("renders the accessible progress value", () => {
		render(<ProgressBar label="Budget used" value={42.4} />);

		expect(screen.getByText("42%")).toBeInTheDocument();
		expect(screen.getByRole("progressbar", { name: "Budget used" })).toHaveAttribute("aria-valuenow", "42.4");
	});

	it("clamps progress values to the supported range", () => {
		render(<ProgressBar label="Over target" value={132} />);

		expect(screen.getByText("100%")).toBeInTheDocument();
		expect(screen.getByRole("progressbar", { name: "Over target" })).toHaveAttribute("aria-valuenow", "100");
	});
});
