import { SITE_URL } from "./site";

export const MCP_ENDPOINT_URL = `${SITE_URL}/.well-known/mcp`;
export const MCP_PROTOCOL_VERSIONS = ["2026-07-28", "2025-11-25"] as const;
export const MCP_SERVER_INFO = {
	name: "cashlift",
	version: "1.0.0",
} as const;
