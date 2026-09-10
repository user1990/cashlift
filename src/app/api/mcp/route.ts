import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { resolveWorkspaceDataset } from "@/modules/workspace/resolveWorkspaceDataset";
import { WORKSPACE_DATASET_SCOPE_SCHEMA } from "@/modules/workspace/schemas";
import { MCP_PROTOCOL_VERSIONS, MCP_SERVER_INFO } from "@/services/mcp";
import { SITE_URL } from "@/services/site";

const mcpHandler = createMcpHandler(() => {
	const server = new McpServer(MCP_SERVER_INFO, { capabilities: { tools: {} } });

	server.registerTool(
		"get_workspace_dataset",
		{
			description:
				"Read a CashLift workspace dataset. The public deployment returns read-only demo data or a structured authentication error; it never mutates financial records.",
			inputSchema: z.object({
				scope: WORKSPACE_DATASET_SCOPE_SCHEMA.default("overview").describe("Workspace view to load."),
			}),
			outputSchema: z.object({
				dataset: z.record(z.string(), z.unknown()),
			}),
		},
		async ({ scope }) => {
			const result = await resolveWorkspaceDataset(scope);

			if (result.kind !== "success") {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								code: getMcpErrorCode(result.kind),
								message: result.message,
								resolution: "Authenticate with CashLift or retry later, depending on the error code.",
							}),
						},
					],
					isError: true,
				};
			}

			return {
				content: [{ type: "text", text: JSON.stringify({ dataset: result.dataset }) }],
				structuredContent: { dataset: result.dataset },
			};
		},
	);

	return server;
});

export const GET = (request: Request) => handleMcpRequest(request);

export const POST = (request: Request) => handleMcpRequest(request);

async function handleMcpRequest(request: Request) {
	const origin = request.headers.get("origin");

	if (origin && origin !== SITE_URL) {
		return Response.json(
			{
				id: null,
				jsonrpc: "2.0",
				error: { code: -32600, message: "Origin is not allowed for this MCP endpoint." },
			},
			{ status: 403 },
		);
	}

	const response = await mcpHandler.fetch(request);
	response.headers.set("Cache-Control", "no-store");
	response.headers.set("MCP-Protocol-Versions", MCP_PROTOCOL_VERSIONS.join(", "));

	return response;
}

const getMcpErrorCode = (kind: "config" | "data_error" | "forbidden" | "service" | "unauthenticated") => {
	const codes = {
		config: "workspace_config_unavailable",
		data_error: "workspace_data_unavailable",
		forbidden: "workspace_forbidden",
		service: "workspace_service_unavailable",
		unauthenticated: "workspace_unauthenticated",
	} as const;

	return codes[kind];
};
