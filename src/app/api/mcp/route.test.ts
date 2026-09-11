import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/mcp", () => {
	it("answers the current stateless MCP discovery request", async () => {
		const response = await POST(
			new Request("https://cashlift.test/api/mcp", {
				body: JSON.stringify({
					id: 1,
					jsonrpc: "2.0",
					method: "server/discover",
					params: {
						_meta: {
							"io.modelcontextprotocol/clientCapabilities": {},
							"io.modelcontextprotocol/clientInfo": { name: "test-client", version: "1.0.0" },
							"io.modelcontextprotocol/protocolVersion": "2026-07-28",
						},
					},
				}),
				headers: {
					"Content-Type": "application/json",
					"Mcp-Method": "server/discover",
					"MCP-Protocol-Version": "2026-07-28",
				},
				method: "POST",
			}),
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("MCP-Protocol-Versions")).toBe("2026-07-28, 2025-11-25");
		await expect(response.json()).resolves.toMatchObject({
			id: 1,
			jsonrpc: "2.0",
			result: { capabilities: { tools: {} } },
		});
	});

	it("rejects cross-origin requests", async () => {
		const response = await POST(
			new Request("https://cashlift.test/api/mcp", {
				headers: { Origin: "https://attacker.example" },
				method: "POST",
			}),
		);

		expect(response.status).toBe(403);
		await expect(response.json()).resolves.toMatchObject({ error: { code: -32600 }, id: null, jsonrpc: "2.0" });
	});
});
