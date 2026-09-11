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
			CashAction: {
				properties: {
					description: { type: "string" },
					dueDate: { format: "date", type: "string" },
					id: { type: "string" },
					impactCents: { minimum: 0, type: "integer" },
					owner: { type: "string" },
					priority: { enum: ["critical", "high", "medium", "low"], type: "string" },
					status: { enum: ["open", "done"], type: "string" },
					title: { type: "string" },
					type: { enum: ["approval", "collection", "vendor-leak", "cash-buffer", "forecast"], type: "string" },
					visibleTo: { items: { enum: ["owner-finance", "manager", "employee"], type: "string" }, type: "array" },
				},
				required: [
					"description",
					"dueDate",
					"id",
					"impactCents",
					"owner",
					"priority",
					"status",
					"title",
					"type",
					"visibleTo",
				],
				type: "object",
			},
			CompanyProfile: {
				properties: {
					cashBalanceCents: { type: "integer" },
					cashBufferTargetCents: { type: "integer" },
					companyId: { type: "string" },
					defaultRole: { enum: ["owner-finance", "manager", "employee"], type: "string" },
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
					cashActions: { items: { $ref: "#/components/schemas/CashAction" }, type: "array" },
					forecast: { items: { $ref: "#/components/schemas/ForecastPoint" }, type: "array" },
					invoices: { items: { $ref: "#/components/schemas/Invoice" }, type: "array" },
					profile: { $ref: "#/components/schemas/CompanyProfile" },
					spendRequests: { items: { $ref: "#/components/schemas/SpendRequest" }, type: "array" },
					subscriptions: { items: { $ref: "#/components/schemas/Subscription" }, type: "array" },
					teamBudgets: { items: { $ref: "#/components/schemas/TeamBudget" }, type: "array" },
					teamMembers: { items: { $ref: "#/components/schemas/TeamMember" }, type: "array" },
					vendorBills: { items: { $ref: "#/components/schemas/VendorBill" }, type: "array" },
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
			ForecastPoint: {
				properties: {
					date: { format: "date", type: "string" },
					id: { type: "string" },
					inflowCents: { minimum: 0, type: "integer" },
					openingBalanceCents: { minimum: 0, type: "integer" },
					outflowCents: { minimum: 0, type: "integer" },
					scenario: { enum: ["base", "delayed-client", "approved-spend"], type: "string" },
				},
				required: ["date", "id", "inflowCents", "openingBalanceCents", "outflowCents", "scenario"],
				type: "object",
			},
			Invoice: {
				properties: {
					amountCents: { minimum: 0, type: "integer" },
					client: { type: "string" },
					collectionProbability: { maximum: 100, minimum: 0, type: "number" },
					dueDate: { format: "date", type: "string" },
					id: { type: "string" },
					owner: { type: "string" },
					status: { enum: ["sent", "overdue", "promised", "paid"], type: "string" },
				},
				required: ["amountCents", "client", "collectionProbability", "dueDate", "id", "owner", "status"],
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
			Subscription: {
				properties: {
					amountCents: { minimum: 0, type: "integer" },
					id: { type: "string" },
					owner: { type: "string" },
					renewalDate: { format: "date", type: "string" },
					status: { enum: ["active", "unused", "duplicate", "trial"], type: "string" },
					usagePercent: { maximum: 100, minimum: 0, type: "integer" },
					vendor: { type: "string" },
				},
				required: ["amountCents", "id", "owner", "renewalDate", "status", "usagePercent", "vendor"],
				type: "object",
			},
			TeamBudget: {
				properties: {
					approvedCents: { minimum: 0, type: "integer" },
					committedCents: { minimum: 0, type: "integer" },
					id: { type: "string" },
					monthlyBudgetCents: { minimum: 0, type: "integer" },
					team: { type: "string" },
				},
				required: ["approvedCents", "committedCents", "id", "monthlyBudgetCents", "team"],
				type: "object",
			},
			TeamMember: {
				properties: {
					id: { type: "string" },
					name: { type: "string" },
					role: { enum: ["owner-finance", "manager", "employee"], type: "string" },
					team: { type: "string" },
				},
				required: ["id", "name", "role", "team"],
				type: "object",
			},
			VendorBill: {
				properties: {
					amountCents: { minimum: 0, type: "integer" },
					category: { enum: ["software", "contractor", "operations", "tax", "payroll"], type: "string" },
					dueDate: { format: "date", type: "string" },
					essential: { type: "boolean" },
					id: { type: "string" },
					status: { enum: ["scheduled", "needs-review", "approved"], type: "string" },
					vendor: { type: "string" },
				},
				required: ["amountCents", "category", "dueDate", "essential", "id", "status", "vendor"],
				type: "object",
			},
		},
	},
	info: {
		description:
			"CashLift API v1. Versioning uses the /api/v1/ URL prefix. Unversioned paths remain deprecated compatibility aliases and advertise their v1 successor with Deprecation and Link headers. Responses publish an enforced per-application-instance quota through RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and RateLimit-Policy; 429 responses include Retry-After.",
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
