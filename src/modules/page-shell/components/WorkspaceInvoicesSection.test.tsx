import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspaceInvoicesSection } from "./WorkspaceInvoicesSection";

describe("WorkspaceInvoicesSection", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("calculates overdue risk from the current date", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-05-15T12:00:00Z"));

		render(<WorkspaceInvoicesSection dataset={financialDatasetFixture} />);

		expect(screen.getByText("$45,900 overdue cash risk")).toBeInTheDocument();
	});
});
