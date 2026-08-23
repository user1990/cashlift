import { SITE_URL } from "@/services/site";

const MARKDOWN_CONTENT = {
	"/": `# CashLift

CashLift is a cash-aware spend decision command center for service firms. It ranks the cash actions that matter now in one daily inbox so owners and teams can decide what to collect, approve, or cut today.

CashLift brings overdue invoice collection, spend approvals, vendor leak detection, cash-buffer warnings, and a 13-week cash outlook into one decision workflow. Each action keeps its cash impact, urgency, owner, and supporting context beside the recommended next step.

The live demo is a read-only Studio Nova sample. It does not move money, issue cards, or provide financial, legal, or tax advice. Agents should use the demo when they need to explore a realistic cash-operations workflow without entering company records or creating an account.

## Where to look next

- [Live demo](${SITE_URL}/demo/workspace): Explore the ranked daily cash action inbox.
- [Features](${SITE_URL}/features): Review the action inbox, approvals, collections, vendor leaks, and cash outlook.
- [Pricing](${SITE_URL}/pricing): Check current plan details before making a buying decision.
- [Help](${SITE_URL}/help): Search product and demo answers.
- [Developer resources](${SITE_URL}/developers): Find the OpenAPI specification and authentication notes.
`,
	"/developers": `# CashLift developer resources

CashLift currently publishes a machine-readable OpenAPI description for its workspace routes and concise authentication guidance. Production workspace requests require an authenticated Clerk session; demo mode uses read-only fixtures. CashLift does not currently publish webhooks or an MCP server.

## Resources

- [OpenAPI specification](${SITE_URL}/openapi.json): Machine-readable workspace route documentation.
- [Agent guidance](${SITE_URL}/llms.txt): When to use CashLift and links to the best-fit product resources.
- [CashLift homepage](${SITE_URL}/): Product overview and current positioning.
`,
	"/features": `# CashLift features

CashLift gives service firms one prioritized feed for approvals, overdue invoices, vendor leaks, and cash-buffer warnings. It shows budget remaining, cash after approval, invoice timing, collection ownership, vendor renewal risk, and a 13-week cash outlook without requiring spreadsheet-driven decisions.

## Resources

- [CashLift homepage](${SITE_URL}/): Product overview.
- [Live demo](${SITE_URL}/demo/workspace): Read-only workflow exploration.
- [Pricing](${SITE_URL}/pricing): Current plan details.
`,
	"/pricing": `# CashLift pricing

The CashLift pricing page is the source of truth for current plan details, feature coverage, and plan comparison. Review it before making a buying decision because pricing and availability can change.

- [Current pricing](${SITE_URL}/pricing): Compare CashLift plans.
- [Features](${SITE_URL}/features): Review product capabilities.
`,
	"/demo": `# CashLift demo

The CashLift demo is designed for service firms exploring cash-aware approvals, overdue collections, vendor leaks, and daily cash operations. The read-only Studio Nova workspace can be explored without creating an account or entering company records.

- [Open the live demo](${SITE_URL}/demo/workspace): Start with the ranked daily inbox.
- [Help](${SITE_URL}/help): Find answers about the demo.
`,
	"/help": `# CashLift help

CashLift help covers the read-only demo, action ranking, cash context, current plans, and getting started. Use the help index when an agent needs product behavior or demo boundaries rather than marketing copy.

- [Search CashLift help](${SITE_URL}/help): Product and demo answers.
- [Live demo](${SITE_URL}/demo/workspace): Explore the workflow.
`,
	"/customers": `# CashLift customers

CashLift is designed for service firms managing spend, invoices, vendor renewals, and cash pressure across projects and teams. Customer proof on this site is illustrative product content for the demo-first MVP.

- [Customer examples](${SITE_URL}/customers): Review the available proof stories.
- [Contact CashLift](${SITE_URL}/contact): Ask about a walkthrough.
`,
	"/contact": `# Contact CashLift

Use the CashLift contact page to request a cash-operations walkthrough or ask a sales and support question. The product is currently presented as a demo-first MVP for service firms.

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
