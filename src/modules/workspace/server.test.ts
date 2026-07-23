import { describe, expect, it } from "vitest";
import { mapWorkspaceDatasetFailure } from "./server";

describe("loadWorkspaceDataset", () => {
	it("preserves the request ID for unavailable workspace data", () => {
		const result = mapWorkspaceDatasetFailure({
			kind: "data_error",
			message: "Unable to load workspace data.",
			requestId: "event-exception-id",
		});

		expect(result).toEqual({
			message: "Unable to load workspace data.",
			requestId: "event-exception-id",
			status: "unavailable",
		});
	});
});
