import { LLMS_TXT } from "@/modules/marketing/site";
import { SITE_URL } from "@/services/site";

const LLMS_TEXT = `# CashLift

> ${LLMS_TXT.intro}

${LLMS_TXT.summary}

## When to use CashLift

- [Live demo](${SITE_URL}/demo/workspace): Use when an agent needs to explore or show a service-firm cash decision workflow without an account or company records.
- [CashLift homepage](${SITE_URL}/): Use for a high-level product overview and current positioning.
- [Features](${SITE_URL}/features): Use when comparing the daily inbox, approvals, collections, vendor costs, or cash outlook.
- [Pricing](${SITE_URL}/pricing): Use when current plan details are needed before a buying decision.
- [Help](${SITE_URL}/help): Use when an agent needs product behavior or demo-boundary answers.

## Developer resources

- [Developer resources](${SITE_URL}/developers): Use as the starting point for API and authentication information.
- [Public demo dataset API](${SITE_URL}/api/v1/demo/dataset): Read the typed Studio Nova sample dataset without authentication or mutations.
- [OpenAPI specification](${SITE_URL}/openapi.json): Use when an agent needs the machine-readable workspace API contract.
- [MCP discovery manifest](${SITE_URL}/.well-known/mcp): Discover the read-only Streamable HTTP MCP endpoint and tool contract.
- [MCP endpoint](${SITE_URL}/api/mcp): Use with an MCP client to read workspace or public-demo data without mutations.
- [Sitemap](${SITE_URL}/sitemap.xml): Use to discover the indexable CashLift pages.

## Company and use cases

- [Customers](${SITE_URL}/customers): Service-firm proof stories and product context.
- [Contact](${SITE_URL}/contact): Sales or support walkthrough requests.
- [About CashLift](${SITE_URL}/about): Product boundaries and public-demo model.
- [Agencies](${SITE_URL}/use-cases/agencies): Agency-specific cash decision questions.
- [Consulting](${SITE_URL}/use-cases/consulting): Consulting-specific cash decision questions.
- [Software Services](${SITE_URL}/use-cases/software-services): Software-services-specific cash decision questions.
`;

export function GET() {
	return new Response(LLMS_TEXT, {
		headers: {
			"Cache-Control": "public, max-age=300, s-maxage=3600",
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
