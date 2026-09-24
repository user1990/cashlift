import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";
import { DEMO_WORKSPACE_DATASET } from "./demoDataset";
import { reduceDatasetForScope } from "./read-models";

describe("workspace dataset read performance", () => {
	it("reduces the demo dataset for approvals within the workspace budget", () => {
		const started = performance.now();
		const dataset = reduceDatasetForScope(DEMO_WORKSPACE_DATASET, "approvals");
		const elapsedMs = performance.now() - started;

		expect(dataset.spendRequests.length).toBeGreaterThan(0);
		expect(elapsedMs).toBeLessThan(2_000);
	});
});
