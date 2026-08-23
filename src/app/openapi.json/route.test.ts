import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /openapi.json", () => {
	it("publishes every supported workspace dataset scope", async () => {
		const response = await GET();
		const document = await response.json();

		expect(document.paths["/api/workspace/dataset"].get.parameters[0].schema.enum).toEqual([
			"approvals",
			"budgets",
			"cash",
			"invoices",
			"overview",
			"settings",
			"team",
			"vendors",
		]);
	});
});
