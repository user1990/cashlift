import { NextResponse } from "next/server";
import { WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";
import { SITE_URL } from "@/services/site";

const OPENAPI_DOCUMENT = {
	info: {
		description:
			"Authenticated workspace endpoints for CashLift. Production requests require a Clerk session; demo mode serves read-only fixtures.",
		title: "CashLift API",
		version: "0.1.0",
	},
	openapi: "3.1.0",
	paths: {
		"/api/workspace/dataset": {
			get: {
				parameters: [
					{
						description: "Workspace view to load.",
						in: "query",
						name: "scope",
						required: false,
						schema: {
							default: "overview",
							enum: [...WORKSPACE_DATASET_SCOPE_SCHEMA.options],
							type: "string",
						},
					},
					{
						description: "Optional inclusive ISO date range start.",
						in: "query",
						name: "startDate",
						required: false,
						schema: { format: "date", type: "string" },
					},
					{
						description: "Optional inclusive ISO date range end.",
						in: "query",
						name: "endDate",
						required: false,
						schema: { format: "date", type: "string" },
					},
				],
				responses: {
					"200": { description: "The requested workspace dataset." },
					"400": { description: "Invalid scope or date range." },
					"401": { description: "No authenticated workspace session." },
					"403": { description: "The session cannot access the workspace." },
					"503": { description: "Workspace configuration or service unavailable." },
				},
				tags: ["Workspace"],
			},
		},
		"/api/workspace/spend-requests/{id}": {
			parameters: [
				{
					in: "path",
					name: "id",
					required: true,
					schema: { type: "string" },
				},
			],
			patch: {
				requestBody: {
					content: {
						"application/json": {
							schema: {
								properties: { status: { enum: ["approved", "rejected"], type: "string" } },
								required: ["status"],
								type: "object",
							},
						},
					},
					required: true,
				},
				responses: {
					"200": { description: "The updated spend request." },
					"400": { description: "Invalid spend request decision." },
					"401": { description: "No authenticated workspace session." },
					"403": { description: "The session cannot update the request." },
					"404": { description: "The spend request was not found." },
					"503": { description: "Workspace service unavailable." },
				},
				tags: ["Workspace"],
			},
		},
	},
	servers: [{ url: SITE_URL }],
	tags: [{ description: "CashLift workspace data and decisions.", name: "Workspace" }],
} as const;

export function GET() {
	return NextResponse.json(OPENAPI_DOCUMENT, {
		headers: {
			"Cache-Control": "public, max-age=300, s-maxage=3600",
		},
	});
}
