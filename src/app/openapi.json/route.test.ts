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

	it("publishes versioned operations with typed success and error schemas", async () => {
		const document = await (await GET()).json();
		const publicDemo = document.paths["/api/v1/demo/dataset"].get;
		const dataset = document.paths["/api/v1/workspace/dataset"].get;
		const spendRequest = document.paths["/api/v1/workspace/spend-requests/{id}"].patch;

		expect(document.info.version).toBe("1.0.0");
		expect(publicDemo.operationId).toBe("getPublicDemoDataset");
		expect(publicDemo.security).toEqual([]);
		expect(publicDemo.responses["200"].content["application/json"].schema.$ref).toBe(
			"#/components/schemas/FinancialDataset",
		);
		expect(document.tags).toContainEqual({ description: "Read-only Studio Nova sample data.", name: "Demo" });
		expect(dataset.operationId).toBe("getWorkspaceDataset");
		expect(dataset.responses["200"].content["application/json"].schema.$ref).toBe(
			"#/components/schemas/FinancialDataset",
		);
		expect(dataset.responses["401"].content["application/problem+json"].schema.$ref).toBe(
			"#/components/schemas/ApiError",
		);
		expect(spendRequest.operationId).toBe("updateSpendRequestDecision");
		expect(document.paths["/api/workspace/dataset"].get.deprecated).toBe(true);
		expect(document.components.schemas.ApiError.required).toContain("resolution");
		expect(document.components.schemas.FinancialDataset.properties.cashActions.items.$ref).toBe(
			"#/components/schemas/CashAction",
		);
		expect(document.components.schemas.FinancialDataset.properties.vendorBills.items.$ref).toBe(
			"#/components/schemas/VendorBill",
		);
	});
});
