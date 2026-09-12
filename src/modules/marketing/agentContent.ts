import { SITE_URL } from "@/services/site";
import { AGENT_MARKDOWN } from "./site";

const MARKDOWN_CONTENT = {
	"/": `# CashLift

${AGENT_MARKDOWN.homeIntro}

## Where to look next

- [Live demo](${SITE_URL}/demo/workspace): Explore the ranked daily inbox.
- [Features](${SITE_URL}/features): Review the inbox, approvals, collections, vendor costs, and cash outlook.
- [Pricing](${SITE_URL}/pricing): Check current plan details before making a buying decision.
- [Help](${SITE_URL}/help): Search product and demo answers.
- [Developer resources](${SITE_URL}/developers): Find the OpenAPI specification and authentication notes.
`,
	"/developers": `# CashLift developer resources

${AGENT_MARKDOWN.developersIntro}

## Resources

- [OpenAPI specification](${SITE_URL}/openapi.json): Machine-readable workspace route documentation.
- [Public demo dataset API](${SITE_URL}/api/v1/demo/dataset): Read the typed Studio Nova sample dataset without authentication or mutations.
- [MCP discovery manifest](${SITE_URL}/.well-known/mcp): Discover the read-only Streamable HTTP MCP endpoint and its tool.
- [MCP endpoint](${SITE_URL}/api/mcp): Connect with an MCP client using the current protocol or legacy handshake.
- [Agent guidance](${SITE_URL}/llms.txt): When to use CashLift and links to the best-fit product resources.
- [CashLift homepage](${SITE_URL}/): Product overview and current positioning.
`,
	"/about": `# About CashLift

CashLift helps service companies see what money-related work needs attention today. It keeps the reason, cash impact, owner, and next step together for overdue invoices, spend requests, vendor costs, budgets, and cash warnings.

- [About CashLift](${SITE_URL}/about): Read the product boundaries and public-demo model.
- [Contact CashLift](${SITE_URL}/contact): Request a walkthrough or ask a product question.
`,
	"/features": `# CashLift features

${AGENT_MARKDOWN.featuresIntro}

## Resources

- [CashLift homepage](${SITE_URL}/): Product overview.
- [Live demo](${SITE_URL}/demo/workspace): Read-only sample inbox exploration.
- [Pricing](${SITE_URL}/pricing): Current plan details.
`,
	"/pricing": `# CashLift pricing

${AGENT_MARKDOWN.pricingIntro}

- [Current pricing](${SITE_URL}/pricing): Compare CashLift plans.
- [Features](${SITE_URL}/features): Review product capabilities.
`,
	"/demo": `# CashLift demo

${AGENT_MARKDOWN.demoIntro}

- [Open the live demo](${SITE_URL}/demo/workspace): Start with the ranked daily inbox.
- [Help](${SITE_URL}/help): Find answers about the demo.
`,
	"/help": `# CashLift help

${AGENT_MARKDOWN.helpIntro}

- [Search CashLift help](${SITE_URL}/help): Product and demo answers.
- [Live demo](${SITE_URL}/demo/workspace): Explore the workflow.
`,
	"/customers": `# CashLift customers

${AGENT_MARKDOWN.customersIntro}

- [Customer examples](${SITE_URL}/customers): Review the available proof stories.
- [Contact CashLift](${SITE_URL}/contact): Ask about a walkthrough.
`,
	"/contact": `# Contact CashLift

${AGENT_MARKDOWN.contactIntro}

- [Contact CashLift](${SITE_URL}/contact): Start a conversation.
- [Live demo](${SITE_URL}/demo/workspace): Explore before reaching out.
`,
	"/use-cases/agencies": `# CashLift for agencies

CashLift helps agencies keep software renewals, overdue client invoices, contractor bills, project milestones, and client cash aligned in one decision workflow.

- [Agency use case](${SITE_URL}/use-cases/agencies): Review agency-specific questions.
`,
	"/use-cases/consulting": `# CashLift for consulting firms

CashLift helps consulting firms review workshop travel, contractors, partner tools, retainer collection timing, and team budget room with cash context beside each decision.

- [Consulting use case](${SITE_URL}/use-cases/consulting): Review consulting-specific questions.
`,
	"/use-cases/software-services": `# CashLift for software services

CashLift helps software-services firms review cloud spend, idle subscription seats, contractors, payroll pressure, and milestone payment risk before cash gets tight.

- [Software services use case](${SITE_URL}/use-cases/software-services): Review software-services questions.
`,
} as const satisfies Record<string, string>;

export const NOT_FOUND_MARKDOWN = `# CashLift page not found

The requested CashLift page does not exist. Use one of these recovery links:

- [CashLift homepage](${SITE_URL}/): Start with the product overview.
- [Sitemap](${SITE_URL}/sitemap.xml): Browse indexable pages.
- [Agent guidance](${SITE_URL}/llms.txt): Find the best resource for an agent task.
- [Help](${SITE_URL}/help): Search product answers.
`;

export const getAgentMarkdown = (pathname: string) => MARKDOWN_CONTENT[pathname as keyof typeof MARKDOWN_CONTENT];
