// @vitest-environment jsdom

import { act, render, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatCurrency } from "@/modules/money/format";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { WorkspaceInvoicesSection } from "./WorkspaceInvoicesSection";

describe("WorkspaceInvoicesSection", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("recalculates overdue cash risk when the browser date crosses midnight", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-05-14T23:59:00"));

		render(
			<NuqsTestingAdapter hasMemory>
				<WorkspaceInvoicesSection dataset={financialDatasetFixture} />
			</NuqsTestingAdapter>,
		);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(formatCurrency(1_840_000));

		act(() => {
			vi.advanceTimersByTime(60_000);
		});

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(formatCurrency(4_590_000));
	});
});
