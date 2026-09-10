import { NextResponse } from "next/server";
import { WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";
import { SITE_URL } from "@/services/site";

const API_ERROR_RESPONSE = {
	content: { "application/problem+json": { schema: { $ref: "#/components/schemas/ApiError" } } },
	description: "Structured error with a stable code, human-readable detail, and resolution hint.",
} as const;

const DATASET_RESPONSE = {
	content: { "application/json": { schema: { $ref: "#/components/schemas/FinancialDataset" } } },
	description: "The requested typed workspace dataset.",
} as const;

const SPEND_REQUEST_RESPONSE = {
	content: { "application/json": { schema: { $ref: "#/components/schemas/SpendRequest" } } },
	description: "The updated typed spend request.",
} as const;

const DATASET_PARAMETERS = [
	{
		description: "Workspace view to load.",
		in: "query",
		name: "scope",
		required: false,
		schema: { default: "overview", enum: [...WORKSPACE_DATASET_SCOPE_SCHEMA.options], type: "string" },
	},
	{
		description: "Optional inclusive ISO 8601 date range start.",
		in: "query",
		name: "startDate",
		required: false,
		schema: { format: "date", type: "string" },
	},
	{
		description: "Optional inclusive ISO 8601 date range end; it must be on or after startDate.",
		in: "query",
		name: "endDate",
		required: false,
		schema: { format: "date", type: "string" },
	},
] as const;

const SPEND_REQUEST_PARAMETERS = [
	{
		description: "CashLift spend request identifier.",
		in: "path",
		name: "id",
		required: true,
		schema: { type: "string" },
	},
] as const;

const SPEND_REQUEST_BODY = {
	content: { "application/json": { schema: { $ref: "#/components/schemas/SpendRequestDecision" } } },
	description: "The finance decision to apply to the spend request.",
	required: true,
} as const;

const DATASET_GET = {
	description:
		"Load a CashLift workspace dataset for an authenticated company member. In demo mode, this returns read-only Studio Nova sample data.",
	operationId: "getWorkspaceDataset",
	parameters: DATASET_PARAMETERS,
	responses: {
		"200": DATASET_RESPONSE,
		"400": API_ERROR_RESPONSE,
		"401": API_ERROR_RESPONSE,
		"403": API_ERROR_RESPONSE,
		"429": API_ERROR_RESPONSE,
		"500": API_ERROR_RESPONSE,
		"503": API_ERROR_RESPONSE,
	},
	tags: ["Workspace"],
} as const;

const SPEND_REQUEST_PATCH = {
	description:
		"Approve or reject a spend request for an authenticated finance lead or manager. CashLift never moves money as a result of this decision.",
	operationId: "updateSpendRequestDecision",
	parameters: SPEND_REQUEST_PARAMETERS,
	requestBody: SPEND_REQUEST_BODY,
	responses: {
		"200": SPEND_REQUEST_RESPONSE,
		"400": API_ERROR_RESPONSE,
		"401": API_ERROR_RESPONSE,
		"403": API_ERROR_RESPONSE,
		"404": API_ERROR_RESPONSE,
		"429": API_ERROR_RESPONSE,
		"500": API_ERROR_RESPONSE,
		"503": API_ERROR_RESPONSE,
	},
	tags: ["Workspace"],
} as const;

const OPENAPI_DOCUMENT = {
	components: {
		securitySchemes: {
			clerkSession: {
				description: "Authenticated CashLift Clerk session cookie.",
				in: "cookie",
				name: "__session",
				type: "apiKey",
			},
		},
		schemas: {
			ApiError: {
				description: "RFC 9457-compatible CashLift error details.",
				properties: {
					code: { description: "Stable machine-readable error code.", type: "string" },
					detail: { type: "string" },
					error: { description: "Backward-compatible alias for detail.", type: "string" },
					message: { type: "string" },
					resolution: { description: "Action an agent can take to recover.", type: "string" },
					requestId: { type: "string" },
					status: { type: "integer" },
					title: { type: "string" },
					type: { format: "uri", type: "string" },
				},
				required: ["code", "detail", "error", "message", "resolution", "status", "title", "type"],
				type: "object",
			},
			CompanyProfile: {
				properties: {
					cashBalanceCents: { type: "integer" },
					cashBufferTargetCents: { type: "integer" },
					companyId: { type: "string" },
					defaultRole: { type: "string" },
					industry: { enum: ["agency", "consulting", "software-services"], type: "string" },
					monthlyPayrollCents: { type: "integer" },
					name: { type: "string" },
				},
				required: [
					"cashBalanceCents",
					"cashBufferTargetCents",
					"companyId",
					"defaultRole",
					"industry",
					"monthlyPayrollCents",
					"name",
				],
				type: "object",
			},
			FinancialDataset: {
				description: "The complete typed CashLift workspace read model.",
				properties: {
					cashActions: { items: { type: "object" }, type: "array" },
					forecast: { items: { type: "object" }, type: "array" },
					invoices: { items: { type: "object" }, type: "array" },
					profile: { $ref: "#/components/schemas/CompanyProfile" },
					spendRequests: { items: { $ref: "#/components/schemas/SpendRequest" }, type: "array" },
					subscriptions: { items: { type: "object" }, type: "array" },
					teamBudgets: { items: { type: "object" }, type: "array" },
					teamMembers: { items: { type: "object" }, type: "array" },
					vendorBills: { items: { type: "object" }, type: "array" },
				},
				required: [
					"cashActions",
					"forecast",
					"invoices",
					"profile",
					"spendRequests",
					"subscriptions",
					"teamBudgets",
					"teamMembers",
					"vendorBills",
				],
				type: "object",
			},
			SpendRequest: {
				properties: {
					amountCents: { minimum: 0, type: "integer" },
					category: { enum: ["software", "travel", "contractor", "marketing", "hardware"], type: "string" },
					id: { type: "string" },
					neededByDate: { format: "date", type: "string" },
					reason: { type: "string" },
					requestedDate: { format: "date", type: "string" },
					requester: { type: "string" },
					status: { enum: ["pending", "approved", "rejected"], type: "string" },
					team: { type: "string" },
					vendor: { type: "string" },
				},
				required: [
					"amountCents",
					"category",
					"id",
					"neededByDate",
					"reason",
					"requestedDate",
					"requester",
					"status",
					"team",
					"vendor",
				],
				type: "object",
			},
			SpendRequestDecision: {
				additionalProperties: false,
				properties: { status: { enum: ["approved", "rejected"], type: "string" } },
				required: ["status"],
				type: "object",
			},
		},
	},
	info: {
		description:
			"CashLift API v1. Versioning uses the /api/v1/ URL prefix. Unversioned paths remain deprecated compatibility aliases and advertise their v1 successor with Deprecation and Link headers. Responses publish RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and RateLimit-Policy; 429 responses include Retry-After.",
		title: "CashLift API",
		version: "1.0.0",
	},
	openapi: "3.1.0",
	paths: {
		"/api/v1/workspace/dataset": { get: DATASET_GET },
		"/api/v1/workspace/spend-requests/{id}": { patch: SPEND_REQUEST_PATCH },
		"/api/workspace/dataset": {
			get: {
				...DATASET_GET,
				deprecated: true,
				description: `${DATASET_GET.description} Migrate to /api/v1/workspace/dataset.`,
				operationId: "getWorkspaceDatasetLegacy",
			},
		},
		"/api/workspace/spend-requests/{id}": {
			patch: {
				...SPEND_REQUEST_PATCH,
				deprecated: true,
				description: `${SPEND_REQUEST_PATCH.description} Migrate to /api/v1/workspace/spend-requests/{id}.`,
				operationId: "updateSpendRequestDecisionLegacy",
			},
		},
	},
	security: [{ clerkSession: [] }],
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
