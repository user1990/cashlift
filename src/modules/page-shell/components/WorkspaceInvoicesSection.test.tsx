import { act, render, screen } from "@testing-library/react";
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

	it("updates overdue risk after local midnight", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-05-14T23:59:00"));

		render(<WorkspaceInvoicesSection dataset={financialDatasetFixture} />);

		expect(screen.getByText("$18,400 overdue cash risk")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(60_000);
		});

		expect(screen.getByText("$45,900 overdue cash risk")).toBeInTheDocument();
	});
});
