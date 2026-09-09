/**
 * Visitor-facing copy for CashLift marketing, help, metadata, and agent surfaces.
 * Import strings from here instead of hardcoding them in components or routes.
 */

// What CashLift is — keep claims aligned with docs/product and accepted ADRs.
export const PRODUCT = {
	audience: "Finance teams, owners, and managers at agencies, consultancies, studios, and software service companies.",
	firstAction: "Click Open live demo. Start with the daily inbox and open the first item.",
	name: "CashLift",
	not: "CashLift does not move money or make decisions for you. The live demo uses sample data. You cannot add your company books, connect accounting, or change records in the public tour.",
	purpose: "CashLift shows service companies what money-related work needs attention today.",
	value: "You see what needs attention, how it affects company cash, who owns it, and what to do next.",
	vocabulary: {
		avoid: ["command center", "cash operations", "track your cash", "connect accounting"],
		use: ["daily inbox", "what needs attention", "company cash", "what to collect, approve, or cut", "open the demo"],
	},
} as const;

export const SITE_META = {
	defaultDescription:
		"CashLift shows service companies what money-related work needs attention today in one daily inbox.",
	homeDescription:
		"See what to collect, approve, or cut today. CashLift ranks overdue invoices, spend requests, vendor costs, and cash warnings in one daily inbox.",
	homeTitle: "CashLift — See what to collect, approve, or cut today",
	structuredDataDescription: PRODUCT.purpose,
} as const;

const NAV_LABELS = {
	bookWalkthrough: "Book a walkthrough",
	dashboard: "Dashboard",
	features: "Features",
	openLiveDemo: "Open live demo",
	pricing: "Pricing",
	viewDocumentation: "View Documentation",
} as const;

export const HOME_HERO = {
	ctaDocumentationHref: "https://cashlift-docs.vercel.app/",
	ctaDocumentationLabel: NAV_LABELS.viewDocumentation,
	ctaDemoHref: "/demo/workspace",
	ctaDemoLabel: NAV_LABELS.openLiveDemo,
	heading: "See what to collect, approve, or cut today.",
	heroImageAlt: "Studio Nova sample workspace with a ranked daily inbox, cash outlook, and team budgets",
	subtitle: PRODUCT.purpose,
} as const;

export const HOME_DECISION_STORY = {
	title: "Three sample decisions for today.",
} as const;

export const FOOTER_CTA = {
	ctaHref: "/demo",
	ctaLabel: NAV_LABELS.bookWalkthrough,
	subtitle: "Open the sample inbox to see what needs attention and why.",
	tagline: "What needs attention, ranked for today",
	title: "See what to collect, approve, or cut today.",
} as const;

export const HOME_FINAL_CTA = {
	ctaHref: "/demo/workspace",
	ctaLabel: NAV_LABELS.openLiveDemo,
	subtitle: "Open the sample inbox to see what needs attention and why.",
	title: "See how the daily inbox works",
} as const;

export const HOME_NOSCRIPT = {
	body: [
		PRODUCT.purpose,
		"CashLift ranks overdue invoices, spend requests, vendor costs, team budgets, and cash warnings in one daily inbox. Each item shows cash impact, urgency, owner, and the next step.",
		"The Studio Nova live demo is read-only sample data. It does not require an account, does not connect to your books, and does not move money.",
	].join(" "),
	helpLinkLabel: "CashLift help index",
	helpLinkHref: "/help",
	demoLinkHref: "/demo/workspace",
	demoLinkLabel: NAV_LABELS.openLiveDemo,
	title: "CashLift overview",
} as const;

export const HOME_FAQ_ITEMS = [
	{
		answer:
			"CashLift sorts sample work by urgency, due date, and cash impact. Each item keeps the reason beside the decision.",
		question: "How does CashLift rank what needs attention?",
	},
	{
		answer:
			"The inbox groups collection, approval, vendor cost, budget, and cash-warning work so a team can see what to do next.",
		question: "What kinds of work does CashLift show?",
	},
	{
		answer: "Each example shows cash impact, urgency, owner, and supporting context next to the recommended next step.",
		question: "What context comes with each item?",
	},
	{
		answer:
			"The live demo uses read-only Studio Nova sample data. It does not connect to QuickBooks, Xero, a bank, or your company records.",
		question: "Where does CashLift get its data?",
	},
	{
		answer: "No. The demo is a read-only sample. You cannot enter or import your company books in the public tour.",
		question: "Can I manage my own company cash in the demo?",
	},
	{
		answer: "Nothing. The public demo is read-only. You can browse the sample inbox and supporting pages only.",
		question: "What can I change in the live demo?",
	},
	{
		answer: "No. You can open the live demo without creating an account.",
		question: "Do I need an account to explore the demo?",
	},
	{
		answer: "No. CashLift does not move money, issue cards, or provide financial, legal, or tax advice.",
		question: "Does CashLift make payments or financial decisions for me?",
	},
	{
		answer:
			"Finance teams, owners, and managers at service companies who need one place to see what to collect, approve, or cut today.",
		question: "Who is CashLift for?",
	},
	{
		answer:
			"Start with the ranked daily inbox, then open one collection, approval, or vendor-cost example to see its context.",
		question: "Where should I start in the live demo?",
	},
] as const;

export const DEMO_PAGE = {
	ctaDemoHref: "/demo/workspace",
	ctaDemoLabel: NAV_LABELS.openLiveDemo,
	description:
		"We will walk through the Studio Nova sample inbox so you can see what needs attention, why it matters, and what to do next.",
	label: "See the sample inbox. Understand the cash impact. Know the next step.",
	metadataDescription: "Explore CashLift with the read-only Studio Nova sample inbox for service companies.",
	reassurance: "Sample data. Read-only. No setup.",
} as const;

export const FEATURES_PAGE = {
	ctaButton: NAV_LABELS.bookWalkthrough,
	ctaHref: "/demo",
	ctaKicker: "Get started",
	ctaTitle: "Open the sample inbox or book a walkthrough.",
	description:
		"See cash impact beside approvals, collections, vendor costs, budgets, and cash warnings without spreadsheet work.",
	label: "Features",
} as const;

export const FEATURE_CARDS_COPY = [
	{
		description: "One ranked list for approvals, overdue invoices, vendor costs, and cash warnings.",
		title: "Daily inbox",
	},
	{
		description:
			"Each spend request shows budget remaining, cash after approval, and invoice timing before a manager decides.",
		title: "Spend approvals with cash context",
	},
	{
		description: "Overdue invoices show owner, due date, collection probability, and the next follow-up.",
		title: "Invoice collection queue",
	},
	{
		description: "Unused seats, duplicate tools, trials near renewal, and vendor bills that can wait.",
		title: "Vendor cost review",
	},
	{
		description: "Weekly balance, inflows, outflows, payroll pressure, and buffer risk in one view.",
		title: "13-week cash outlook",
	},
	{
		description:
			"Finance sees the full inbox. Managers can approve spend in a signed-in workspace. Employee request forms are not in the current product.",
		title: "Company roles",
	},
] as const;

export const DEMO_STEPS_COPY = [
	{
		description: "Browse invoices, vendor bills, budgets, spend requests, and forecast rows in Studio Nova.",
		title: "Open the sample company",
	},
	{
		description: "CashLift ranks collection, approval, vendor cost, and cash-warning work by urgency and cash impact.",
		title: "Review the ranked inbox",
	},
	{
		description:
			"In a signed-in workspace, finance leads and managers can approve or reject spend requests. The public demo stays read-only.",
		title: "Decide spend when signed in",
	},
] as const;

export const PRICING_PAGE = {
	auditNote: "Start with the read-only sample inbox before choosing a paid plan.",
	heroDescription: "Flat team plans. Invite every employee without seat anxiety.",
	heroLabel: "Pricing",
	seatNote: "Flat team pricing keeps request-only employees from adding seat anxiety.",
} as const;

export const PRICING_PLANS_COPY = [
	{
		annualPrice: "$6",
		annualTotal: "$72",
		description: "For owners reviewing cash leaks and spend approvals.",
		features: ["Read-only sample inbox tour", "1 company workspace", "Spend request inbox", "13-week cash outlook"],
		name: "Starter",
		price: "$8",
		slug: "starter",
	},
	{
		annualPrice: "$20",
		annualTotal: "$240",
		description: "For teams using CashLift several times a day.",
		features: ["Unlimited request-only employees", "Manager approval queues", "Team budgets", "Vendor renewal reviews"],
		highlighted: true,
		name: "Professional",
		price: "$25",
		slug: "professional",
	},
	{
		annualPrice: "$79",
		annualTotal: "$948",
		description: "For multi-team service firms with finance support needs.",
		features: ["Multi-company view", "Custom approval rules", "Cash scenario reviews", "Priority onboarding"],
		name: "Enterprise",
		price: "$99",
		slug: "enterprise",
	},
] as const;

export const PRICING_COMPARISON_GROUPS_COPY = [
	{
		features: [
			{ name: "Read-only sample inbox tour", values: [true, true, true] },
			{ name: "Company workspaces", values: ["1", "1", "Multiple"] },
			{ name: "13-week cash outlook", values: [true, true, true] },
			{ name: "Vendor renewal reviews", values: [false, true, true] },
		],
		name: "Cash visibility",
	},
	{
		features: [
			{ name: "Spend request inbox", values: [true, true, true] },
			{ name: "Manager approval queues", values: [false, true, true] },
			{ name: "Team budgets", values: [false, true, true] },
			{ name: "Custom approval rules", values: [false, false, true] },
		],
		name: "Approvals and budgets",
	},
	{
		features: [
			{ name: "Cash scenario reviews", values: [false, false, true] },
			{ name: "Priority onboarding", values: [false, false, true] },
		],
		name: "Finance support",
	},
] as const;

export const USE_CASES_COPY = {
	agencies: {
		answers: [
			"Can we approve this software renewal before the client deposit lands?",
			"Which overdue invoice will break our payroll buffer?",
			"What vendor spend can we cut before next month?",
		],
		description:
			"Keep agency spend aligned with client cash across project milestones, delays, contractor bills, and renewals.",
		label: "Agencies",
	},
	consulting: {
		answers: [
			"Can we book travel for the workshop without dipping under buffer?",
			"Which retainer needs a collection nudge today?",
			"Which team has budget room for a contractor?",
		],
		description:
			"Review consulting spend with retainer timing in view so travel, contractors, and partner tools stay cash-aware.",
		label: "Consulting",
	},
	"software-services": {
		answers: [
			"Can we add cloud spend for this project?",
			"Which subscription seats are idle before renewal?",
			"What happens if a milestone payment slips one week?",
		],
		description:
			"Review project spend before cash gets tight across payroll, cloud costs, contractors, retainers, and client milestone risk.",
		label: "Software Services",
	},
} as const;

export const PROOF_POINTS_COPY = [
	{
		metric: "$18.4k",
		text: "overdue invoice surfaced as the top inbox item before payroll pressure",
	},
	{
		metric: "$2.6k",
		text: "monthly vendor costs flagged from unused seats and duplicate tools",
	},
	{
		metric: "3 min",
		text: "to walk through the read-only Studio Nova sample inbox",
	},
] as const;

export const FOOTER_LINKS_COPY = [
	{
		label: "Product",
		links: [
			{ href: "/features", label: NAV_LABELS.features },
			{ href: "/pricing", label: NAV_LABELS.pricing },
			{ href: "/demo", label: NAV_LABELS.bookWalkthrough },
			{ href: "/dashboard", label: NAV_LABELS.dashboard },
		],
	},
	{
		label: "Solutions",
		links: [
			{ href: "/use-cases/agencies", label: USE_CASES_COPY.agencies.label },
			{ href: "/use-cases/consulting", label: USE_CASES_COPY.consulting.label },
			{ href: "/use-cases/software-services", label: USE_CASES_COPY["software-services"].label },
		],
	},
	{
		label: "Company",
		links: [
			{ href: "/customers", label: "Customers" },
			{ href: "/developers", label: "Developers" },
			{ href: "/help", label: "Help" },
			{ href: "/contact", label: "Contact" },
		],
	},
	{
		label: "Legal",
		links: [
			{ href: "/terms", label: "Terms" },
			{ href: "/privacy", label: "Privacy" },
		],
	},
] as const;

export const PRODUCT_NAV_COPY = [
	{ href: "/features", label: NAV_LABELS.features },
	{ href: "/demo", label: NAV_LABELS.bookWalkthrough },
	{ href: "/pricing", label: NAV_LABELS.pricing },
] as const;

export const HELP_FAQ_GROUPS_COPY = [
	{
		icon: "chart-spline",
		items: [
			{
				answer: "CashLift sorts work by urgency, due date, and cash impact, then keeps the reason beside each item.",
				question: "How does CashLift rank what needs attention?",
				slug: "how-does-cashlift-rank-actions",
			},
			{
				answer:
					"CashLift shows collection, approval, vendor cost, budget, and cash-warning work so teams can act on what matters now.",
				question: "What kinds of work does CashLift show?",
				slug: "what-kinds-of-decisions-does-cashlift-surface",
			},
			{
				answer:
					"Each example keeps cash impact, urgency, owner, and supporting context next to the recommended next step.",
				question: "What context comes with each item?",
				slug: "what-context-comes-with-each-action",
			},
			{
				answer:
					"Each spend request shows budget remaining, cash after approval, and invoice timing so a manager can decide with cash context.",
				question: "What does CashLift show before a manager approves spend?",
				slug: "what-does-cashlift-show-before-a-manager-approves-spend",
			},
			{
				answer:
					"The collection queue keeps owner, probability, due date, and next step beside receivables so the team knows what to follow up.",
				question: "How does CashLift turn overdue invoices into daily work?",
				slug: "how-does-cashlift-turn-overdue-invoices-into-daily-work",
			},
			{
				answer:
					"CashLift flags unused seats, duplicate tools, trials close to renewal, and vendor bills that can wait.",
				question: "What vendor costs can CashLift help me review?",
				slug: "what-vendor-leaks-can-cashlift-help-me-review",
			},
			{
				answer:
					"The 13-week cash outlook shows weekly balance, inflows, outflows, payroll pressure, and buffer risk without a spreadsheet.",
				question: "What does the cash outlook include?",
				slug: "what-does-the-cash-outlook-include",
			},
		],
		name: "How it works",
	},
	{
		icon: "life-buoy",
		items: [
			{
				answer:
					"The live demo uses read-only Studio Nova sample data. It does not connect to QuickBooks, Xero, a bank, or your company records.",
				question: "Where does CashLift get its data?",
				slug: "where-does-cashlift-get-its-data",
			},
			{
				answer:
					"No. The Studio Nova workspace is a read-only sample. You cannot enter or import your company books in the public tour.",
				question: "Can I manage my own company cash in the demo?",
				slug: "can-i-try-the-demo-with-real-company-data",
			},
			{
				answer: "Nothing in the public demo. It is read-only sample data for exploring the workflow.",
				question: "What can I change in the live demo?",
				slug: "what-can-i-change-in-the-live-demo",
			},
			{
				answer: "No. CashLift does not move money, issue cards, or provide financial, legal, or tax advice.",
				question: "Does CashLift make payments or financial decisions for me?",
				slug: "does-the-demo-make-payments-or-financial-decisions-for-me",
			},
			{
				answer:
					"Read-only means the Studio Nova workspace is sample data for exploring the workflow. Do not enter company records in the public tour.",
				question: "What does read-only mean in the live demo?",
				slug: "what-does-read-only-mean-in-the-live-demo",
			},
			{
				answer:
					"Company data is loaded into a workspace record by operators or integrations. There is no public connect-or-import screen in the current product.",
				question: "How does company data get into CashLift?",
				slug: "how-does-company-data-get-into-cashlift",
			},
		],
		name: "Demo",
	},
	{
		icon: "users",
		items: [
			{
				answer:
					"Finance sees the full inbox. Managers can approve or reject spend in a signed-in workspace. Employee request and receipt forms are not in the current product.",
				question: "Which roles can use a company workspace?",
				slug: "which-roles-can-use-a-company-workspace",
			},
			{
				answer:
					"Finance teams, owners, and managers at service companies who need one place to see what to collect, approve, or cut today.",
				question: "Who is CashLift for?",
				slug: "who-is-the-demo-designed-for",
			},
			{
				answer:
					"Finance reviews the ranked inbox. Managers decide team spend when signed in. Real collection, cancellation, and payment work still happen outside CashLift.",
				question: "How do finance leads and managers use CashLift?",
				slug: "how-do-finance-managers-and-employees-use-cashlift",
			},
		],
		name: "Company workspace",
	},
	{
		icon: "credit-card",
		items: [
			{
				answer: "Open /pricing for current plan details, feature coverage, and the full comparison.",
				question: "Where can I compare plans?",
				slug: "where-can-i-compare-plans",
			},
			{
				answer:
					"The pricing page is the source of truth for current plan details. See /pricing before making a buying decision.",
				question: "Where should I check current pricing?",
				slug: "where-should-i-check-current-pricing",
			},
		],
		name: "Plans",
	},
	{
		icon: "banknote-arrow-up",
		items: [
			{
				answer: "No. You can open the live demo without creating an account.",
				question: "Do I need an account to explore the demo?",
				slug: "do-i-need-an-account-to-explore-the-demo",
			},
			{
				answer:
					"Start with the ranked daily inbox, then open one collection, approval, or vendor-cost example to see its context.",
				question: "Where should I start in the live demo?",
				slug: "where-should-i-start-in-the-live-demo",
			},
			{
				answer: "Open the live demo to review the sample inbox without creating an account or moving any money.",
				question: "How can we get started?",
				slug: "how-can-we-get-started",
			},
			{
				answer:
					"Open the live demo, review the ranked daily inbox, and open one collection, approval, or vendor-cost example. Then use /pricing to compare current plan details.",
				question: "What is the fastest way to evaluate CashLift?",
				slug: "what-is-the-fastest-way-to-evaluate-cashlift",
			},
		],
		name: "Getting started",
	},
] as const;

export const HELP_FAQ_ARTICLES = {
	"what-does-cashlift-show-before-a-manager-approves-spend": {
		description: "See the cash context beside a request before deciding whether to approve it.",
		relatedSlugs: [
			"what-context-comes-with-each-action",
			"how-does-cashlift-rank-actions",
			"what-kinds-of-decisions-does-cashlift-surface",
		],
		sections: [
			{
				body: "Each request shows budget remaining, cash after approval, and invoice timing beside the decision.",
				heading: "What it shows",
			},
			{
				body: "Keeping those details next to the request helps a manager decide with cash context before saying yes.",
				heading: "Why it matters",
			},
			{
				body: "Open the read-only Studio Nova demo, review the ranked daily inbox, and open an approval example to see its context.",
				heading: "Next step",
			},
		],
	},
} as const;

export const LLMS_TXT = {
	intro: PRODUCT.purpose,
	summary:
		"CashLift ranks overdue invoices, spend requests, vendor costs, and cash warnings in one daily inbox. The live Studio Nova tour is read-only sample data. CashLift does not move money, connect to your books in the public demo, issue cards, or provide financial, legal, or tax advice.",
} as const;

export const AGENT_MARKDOWN = {
	contactIntro: "Use the CashLift contact page to request a walkthrough or ask a sales and support question.",
	customersIntro:
		"CashLift is designed for service firms managing spend, invoices, vendor renewals, and cash pressure across projects and teams. Customer proof on this site is illustrative sample content.",
	demoIntro:
		"The CashLift demo walks service firms through the read-only Studio Nova sample inbox for collections, approvals, vendor costs, and cash warnings. You can explore it without creating an account or entering company records.",
	developersIntro:
		"CashLift publishes a machine-readable OpenAPI description for workspace routes and concise authentication guidance. Production workspace requests require an authenticated Clerk session. The public demo uses read-only sample data. CashLift does not currently publish webhooks or an MCP server.",
	featuresIntro:
		"CashLift gives service firms one ranked inbox for approvals, overdue invoices, vendor costs, and cash warnings. It shows budget remaining, cash after approval, invoice timing, collection ownership, vendor renewal risk, and a 13-week cash outlook.",
	helpIntro:
		"CashLift help covers the read-only demo, inbox ranking, cash context, current plans, and getting started.",
	homeIntro: [
		PRODUCT.purpose,
		"CashLift ranks overdue invoice collection, spend approvals, vendor cost review, cash-buffer warnings, and a 13-week cash outlook in one daily inbox. Each item keeps cash impact, urgency, owner, and supporting context beside the recommended next step.",
		"The live demo is a read-only Studio Nova sample. It does not move money, connect to your books, issue cards, or provide financial, legal, or tax advice.",
	].join("\n\n"),
	pricingIntro:
		"The CashLift pricing page is the source of truth for current plan details, feature coverage, and plan comparison.",
} as const;
