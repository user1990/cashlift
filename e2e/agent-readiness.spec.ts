import { expect, test } from "@playwright/test";

test.describe("agent-readable public contracts", () => {
	test("renders meaningful homepage HTML without JavaScript", async ({ request }) => {
		const response = await request.get("/");
		const body = await response.text();
		const text = body
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		expect(response.status()).toBe(200);
		expect(body).toMatch(/<h1\b/i);
		expect(text.length).toBeGreaterThan(500);
		expect(body).toContain('type="application/ld+json"');
		expect(body).toContain('"@type":"SoftwareApplication"');
	});

	test("returns an agent-friendly 404", async ({ request }) => {
		const response = await request.get("/this-path-does-not-exist");
		const body = await response.text();

		expect(response.status()).toBe(404);
		expect(body).toContain("/sitemap.xml");
		expect(body).toContain("/llms.txt");
	});

	test("publishes agent guidance, developer resources, and the sitemap", async ({ request }) => {
		const [llmsResponse, developerResponse, openApiResponse, sitemapResponse, robotsResponse] = await Promise.all([
			request.get("/llms.txt"),
			request.get("/developers"),
			request.get("/openapi.json"),
			request.get("/sitemap.xml"),
			request.get("/robots.txt"),
		]);

		const llmsBody = await llmsResponse.text();
		const developerBody = await developerResponse.text();
		const openApiBody = await openApiResponse.json();
		const sitemapBody = await sitemapResponse.text();
		const robotsBody = await robotsResponse.text();

		expect(llmsResponse.status()).toBe(200);
		expect(llmsBody).toMatch(/^# CashLift\n\n> /);
		expect(llmsBody).toContain("/developers");
		expect(llmsBody).toContain("/openapi.json");
		expect(developerResponse.status()).toBe(200);
		expect(developerBody).toContain('href="/openapi.json"');
		expect(openApiResponse.status()).toBe(200);
		expect(openApiBody.openapi).toBe("3.1.0");
		expect(openApiBody.paths["/api/workspace/dataset"]).toBeDefined();
		expect(sitemapResponse.status()).toBe(200);
		expect(sitemapBody).toContain("https://cashlift.vercel.app/developers");
		expect(robotsResponse.status()).toBe(200);
		expect(robotsBody).toContain("Sitemap: https://cashlift.vercel.app/sitemap.xml");
	});
});
