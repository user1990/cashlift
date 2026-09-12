import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /openapi.json", () => {
	it("publishes versioned workspace operations and dataset scopes", async () => {
		const document = await (await GET()).json();
		const dataset = document.paths["/api/v1/workspace/dataset"].get;
		const spendRequest = document.paths["/api/v1/workspace/spend-requests/{id}"].patch;
		const unversionedDataset = document.paths["/api/workspace/dataset"].get;

		expect(dataset.operationId).toBe("getWorkspaceDataset");
		expect(dataset.parameters[0].schema.enum).toEqual([
			"approvals",
			"budgets",
			"cash",
			"invoices",
			"overview",
			"settings",
			"team",
			"vendors",
		]);
		expect(dataset.responses["200"].content["application/json"].schema.$ref).toBe(
			"#/components/schemas/FinancialDataset",
		);
		expect(dataset.responses["401"].content["application/problem+json"].schema.$ref).toBe(
			"#/components/schemas/ApiError",
		);
		expect(spendRequest.operationId).toBe("updateSpendRequestDecision");
		expect(unversionedDataset.deprecated).toBe(true);
		expect(unversionedDataset.parameters[0].schema.enum).toEqual(dataset.parameters[0].schema.enum);
		expect(document.components.schemas.ApiError.required).toContain("resolution");
	});
});
