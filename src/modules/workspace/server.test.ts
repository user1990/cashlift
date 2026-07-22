import { beforeEach, describe, expect, it, vi } from "vitest";

const resolveWorkspaceDatasetMock = vi.hoisted(() => vi.fn());

vi.mock("./resolveWorkspaceDataset", () => ({
	resolveWorkspaceDataset: resolveWorkspaceDatasetMock,
}));

describe("loadWorkspaceDataset", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("preserves the request ID for unavailable workspace data", async () => {
		resolveWorkspaceDatasetMock.mockResolvedValue({
			kind: "data_error",
			message: "Unable to load workspace data.",
			requestId: "event-exception-id",
		});
		const { loadWorkspaceDataset } = await import("./server");

		const result = await loadWorkspaceDataset("vendors");

		expect(resolveWorkspaceDatasetMock).toHaveBeenCalledWith("vendors");
		expect(result).toEqual({
			message: "Unable to load workspace data.",
			requestId: "event-exception-id",
			status: "unavailable",
		});
	});
});
