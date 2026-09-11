import { POST as handleMcpPost } from "@/app/api/mcp/route";
import { MCP_ENDPOINT_URL, MCP_PROTOCOL_VERSIONS, MCP_SERVER_INFO } from "@/services/mcp";

export const POST = handleMcpPost;

const MCP_DISCOVERY_DOCUMENT = {
	description:
		"CashLift exposes a read-only MCP Streamable HTTP server for agents that need to inspect the CashLift workspace or public demo contract.",
	endpoint: MCP_ENDPOINT_URL,
	protocolVersions: MCP_PROTOCOL_VERSIONS,
	serverInfo: MCP_SERVER_INFO,
	tools: [
		{
			description: "Read a workspace dataset without mutating financial records.",
			name: "get_workspace_dataset",
		},
	],
	transport: "streamable-http",
} as const;

export function GET() {
	return Response.json(MCP_DISCOVERY_DOCUMENT, {
		headers: {
			"Cache-Control": "public, max-age=300, s-maxage=3600",
			"Content-Type": "application/json",
		},
	});
}
