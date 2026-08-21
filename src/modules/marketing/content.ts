import type { LucideIcon } from "lucide-react";
import {
	BanknoteArrowUp,
	ChartSpline,
	ClipboardCheck,
	CreditCard,
	FileClock,
	LifeBuoy,
	SearchCheck,
	ShieldCheck,
	Users,
} from "lucide-react";

type DemoStep = {
	description: string;
	icon: LucideIcon;
	title: string;
};

type FooterLinkGroup = {
	label: string;
	links: readonly MarketingNavItem[];
};

type HelpFaqItem = {
	answer: string;
	question: string;
};

export type HelpFaqGroup = {
	items: readonly HelpFaqItem[];
	name: string;
};

type MarketingCard = {
	description: string;
	icon: LucideIcon;
	title: string;
};

type MarketingNavItem = {
	href: string;
	label: string;
};

type PricingPlan = {
	annualPrice: string;
	annualTotal: string;
	description: string;
	features: readonly string[];
	name: string;
	price: string;
	slug: PricingPlanSlug;
	highlighted?: boolean;
};

type UseCase = {
	answers: readonly string[];
	description: string;
	label: string;
};

type UseCaseSlug = "agencies" | "consulting" | "software-services";
type PricingPlanSlug = "enterprise" | "professional" | "starter";
export type PricingBilling = "annual" | "monthly";

export const DEFAULT_PRICING_PLAN_SLUG = "professional" satisfies PricingPlanSlug;

export const PRODUCT_NAV = [
	{ href: "/features", label: "Features" },
	{ href: "/demo", label: "Demo" },
	{ href: "/pricing", label: "Pricing" },
] as const satisfies readonly MarketingNavItem[];

export const SOLUTION_NAV = [
	{ href: "/use-cases/agencies", label: "Agencies" },
	{ href: "/use-cases/consulting", label: "Consulting" },
	{ href: "/use-cases/software-services", label: "Software Services" },
] as const satisfies readonly MarketingNavItem[];

export const FEATURE_CARDS = [
	{
		description: "One prioritized feed for approvals, overdue invoices, vendor leaks, and cash buffer warnings.",
		icon: ClipboardCheck,
		title: "Today’s CashLift",
	},
	{
		description:
			"Every request shows budget remaining, cash after approval, and invoice timing before a manager says yes.",
		icon: CreditCard,
		title: "Cash impact approvals",
	},
	{
		description: "Turn receivables into daily work: owner, probability, due date, and next action.",
		icon: FileClock,
		title: "Invoice collection queue",
	},
	{
		description: "Find unused seats, duplicate tools, trials about to renew, and vendor bills that can wait.",
		icon: SearchCheck,
		title: "Vendor leak finder",
	},
	{
		description: "See weekly balance, inflows, outflows, payroll pressure, and buffer risk without spreadsheets.",
		icon: ChartSpline,
		title: "13-week cash outlook",
	},
	{
		description:
			"Finance sees all cash decisions. Managers approve team spend. Employees submit requests and receipts.",
		icon: Users,
		title: "Company roles",
	},
] as const satisfies readonly MarketingCard[];

export const PRICING_PLANS = [
	{
		annualPrice: "$6",
		annualTotal: "$72",
		description: "For owners cleaning up cash leaks and approvals.",
		features: ["Free cash leak audit", "1 company workspace", "Spend request inbox", "13-week cash outlook"],
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
] as const satisfies readonly PricingPlan[];

export const PRICING_COMPARISON_GROUPS = [
	{
		features: [
			{ name: "Free cash leak audit", values: [true, true, true] },
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

export const getPricingPlanBySlug = (slug: string | undefined) =>
	PRICING_PLANS.find((plan) => plan.slug === slug) ??
	PRICING_PLANS.find((plan) => plan.slug === DEFAULT_PRICING_PLAN_SLUG) ??
	PRICING_PLANS[0];

export const USE_CASES = {
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
			"Approve consulting spend with retainer timing in view, so travel, contractors, and partner tools stay cash-aware.",
		label: "Consulting",
	},
	"software-services": {
		answers: [
			"Can we add cloud spend for this project?",
			"Which subscription seats are idle before renewal?",
			"What happens if a milestone payment slips one week?",
		],
		description:
			"Control project spend before cash gets tight across payroll, cloud costs, contractors, retainers, and client milestone risk.",
		label: "Software Services",
	},
} as const satisfies Record<UseCaseSlug, UseCase>;

export const HELP_FAQ_GROUPS = [
	{
		items: [
			{
				answer:
					"CashLift ranks the demo workspace by cash impact and urgency, then keeps the reason for each action beside the decision.",
				question: "How does CashLift rank actions?",
			},
			{
				answer: "The daily inbox groups the demo actions into collection, approval, and renewal decisions.",
				question: "What kinds of actions does CashLift surface?",
			},
			{
				answer:
					"Each example keeps its cash impact, urgency, owner, and supporting context next to the recommended action.",
				question: "What context comes with each action?",
			},
			{
				answer:
					"A cash action is a prioritized piece of daily finance work tied to a cash impact, such as collecting an invoice or deciding a spend request.",
				question: "What is a cash action?",
			},
			{
				answer:
					"The cash buffer is the company’s target reserve that should remain after expected inflows and outflows.",
				question: "What is a cash buffer?",
			},
		],
		name: "How it works",
	},
	{
		items: [
			{
				answer:
					"The live demo uses a read-only Studio Nova workspace. It does not claim or require a production integration to explore the workflow.",
				question: "Where does CashLift get its data?",
			},
			{
				answer:
					"No. The Studio Nova workspace is a read-only sample, so you can explore it without entering company records.",
				question: "Can I try the demo with real company data?",
			},
			{
				answer: "No. The live demo is available to explore without creating an account.",
				question: "Do I need an account to explore the demo?",
			},
			{
				answer: "No. This demo does not move money, issue cards, or provide financial, legal, or tax advice.",
				question: "Does the demo make payments or financial decisions for me?",
			},
			{
				answer:
					"Start with the ranked daily inbox, then open a collection, approval, or renewal example to see its context.",
				question: "Where should I start in the live demo?",
			},
		],
		name: "Demo",
	},
	{
		items: [
			{
				answer:
					"A company workspace is the company-scoped operating space where members review cash actions, spend requests, invoices, vendor bills, subscriptions, budgets, and forecasts.",
				question: "What is a company workspace?",
			},
			{
				answer: "Finance sees all cash decisions. Managers approve team spend. Employees submit requests and receipts.",
				question: "What roles exist in a company workspace?",
			},
			{
				answer:
					"Visible cash actions depend on role. Finance sees the full ranked inbox; managers and employees see the decisions assigned to them.",
				question: "Do managers and finance see the same inbox?",
			},
			{
				answer:
					"The 13-week cash outlook is a weekly forecast of opening balance, inflow, outflow, and ending balance for the company workspace.",
				question: "What is the 13-week cash outlook?",
			},
			{
				answer:
					"A vendor leak is a subscription or vendor cost likely to be waste because it is unused, duplicated, or low-use trial spend.",
				question: "What is a vendor leak?",
			},
		],
		name: "Company workspace",
	},
	{
		items: [
			{
				answer:
					"Starter, Professional, and Enterprise are listed on the pricing page with the features included in each plan.",
				question: "Which plans are available?",
			},
			{
				answer:
					"Starter includes a free cash leak audit, one company workspace, a spend request inbox, and the 13-week cash outlook.",
				question: "What is included in Starter?",
			},
			{
				answer:
					"Professional adds unlimited request-only employees, manager approval queues, team budgets, and vendor renewal reviews. Enterprise adds multi-company view, custom approval rules, cash scenario reviews, and priority onboarding.",
				question: "How do Professional and Enterprise differ?",
			},
			{
				answer:
					"No. CashLift does not move money, issue cards, or provide financial, legal, or tax advice in this demo.",
				question: "Does a paid plan move money or issue cards?",
			},
		],
		name: "Plans",
	},
	{
		items: [
			{
				answer: "The landing page is designed around service-firm questions: what to collect, approve, or cut today.",
				question: "Who is CashLift designed for?",
			},
			{
				answer: "Open the live demo to review the daily inbox without creating an account or moving any money.",
				question: "How can we get started?",
			},
			{
				answer: "Use the contact page to reach sales or support. Demo mode keeps those requests local.",
				question: "How do I contact support?",
			},
		],
		name: "Getting started",
	},
] as const satisfies readonly HelpFaqGroup[];

export const PROOF_POINTS = [
	{
		metric: "$18.4k",
		text: "overdue invoice surfaced as top action before payroll pressure",
	},
	{
		metric: "$2.6k",
		text: "monthly vendor leaks identified in unused seats and duplicate tools",
	},
	{
		metric: "3 min",
		text: "to run a mock accounting-style cash leak audit in the demo",
	},
] as const satisfies readonly { metric: string; text: string }[];

export const FOOTER_LINKS = [
	{
		label: "Product",
		links: [
			{ href: "/features", label: "Features" },
			{ href: "/pricing", label: "Pricing" },
			{ href: "/demo", label: "Demo" },
			{ href: "/dashboard", label: "Dashboard" },
		],
	},
	{
		label: "Solutions",
		links: SOLUTION_NAV,
	},
	{
		label: "Company",
		links: [
			{ href: "/customers", label: "Customers" },
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
] as const satisfies readonly FooterLinkGroup[];

export const DEMO_STEPS = [
	{
		description: "Use mocked QuickBooks/Xero-style invoices, bills, budgets, and renewals.",
		icon: BanknoteArrowUp,
		title: "Connect accounting data",
	},
	{
		description: "CashLift ranks approvals, collections, vendor leaks, and buffer risks.",
		icon: ShieldCheck,
		title: "Run the cash leak audit",
	},
	{
		description: "Invite finance, managers, and employees into the right daily workflow.",
		icon: LifeBuoy,
		title: "Roll out team actions",
	},
] as const satisfies readonly DemoStep[];
