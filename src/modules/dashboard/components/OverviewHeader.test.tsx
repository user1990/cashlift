import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { financialDatasetFixture } from "@/test/fixtures/financialDataset";
import { buildDashboardViewModel } from "../view-model";
import { OverviewHeader } from "./OverviewHeader";

vi.mock("./OverviewDateRangePicker", () => ({
	OverviewDateRangePicker: () => <button type="button">May 10 - May 20</button>,
}));

describe("OverviewHeader", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("downloads the selected overview as CSV", async () => {
		const user = userEvent.setup();
		const anchor = document.createElement("a");
		const click = vi.spyOn(anchor, "click").mockImplementation(() => undefined);
		const objectUrls: Blob[] = [];
		const createObjectURL = vi.fn((object: Blob | MediaSource) => {
			objectUrls.push(object as Blob);

			return "blob:overview-report";
		});
		const revokeObjectURL = vi.fn();
		const createElement = document.createElement.bind(document);
		vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
			if (tagName === "a") {
				return anchor;
			}

			return createElement(tagName);
		});
		vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });

		renderOverviewHeader();

		await user.click(screen.getByRole("button", { name: "Export CSV" }));

		await waitFor(() => {
			expect(click).toHaveBeenCalledTimes(1);
		});
		expect(anchor.download).toEqual("studio-nova-overview-2026-05-10-to-2026-05-20.csv");
		expect(anchor.href).toEqual("blob:overview-report");
		expect(createObjectURL).toHaveBeenCalledTimes(1);
		expect(revokeObjectURL).toHaveBeenCalledWith("blob:overview-report");
		await expect(objectUrls[0]?.text()).resolves.toContain("Date range,2026-05-10 to 2026-05-20");
	});

	it("shows a retryable error when the CSV cannot be prepared", async () => {
		const user = userEvent.setup();
		vi.stubGlobal("URL", {
			...URL,
			createObjectURL: vi.fn(() => {
				throw new Error("blocked");
			}),
			revokeObjectURL: vi.fn(),
		});

		renderOverviewHeader();

		await user.click(screen.getByRole("button", { name: "Export CSV" }));

		await waitFor(() => {
			expect(screen.getByRole("alert")).toHaveTextContent("We couldn’t prepare the CSV. Try again.");
		});
		expect(screen.getByRole("button", { name: "Export CSV" })).toBeEnabled();
	});
});

function renderOverviewHeader() {
	return render(
		<OverviewHeader
			dashboard={buildDashboardViewModel({
				dataset: financialDatasetFixture,
				date: new Date("2026-05-10"),
				role: "owner-finance",
			})}
			dataset={financialDatasetFixture}
			dateRange={{ endDate: "2026-05-20", startDate: "2026-05-10" }}
		/>,
	);
}
