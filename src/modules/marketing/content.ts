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
	description: string;
	features: readonly string[];
	name: string;
	price: string;
	highlighted?: boolean;
};

type UseCase = {
	answers: readonly string[];
	description: string;
	headline: string;
	label: string;
};

type UseCaseSlug = "agencies" | "consulting" | "software-services";

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
		description: "For owners cleaning up cash leaks and approvals.",
		features: ["Free cash leak audit", "1 company workspace", "Spend request inbox", "13-week cash outlook"],
		name: "Control",
		price: "$99",
	},
	{
		description: "For teams using CashLift several times a day.",
		features: ["Unlimited request-only employees", "Manager approval queues", "Team budgets", "Vendor renewal reviews"],
		highlighted: true,
		name: "Command",
		price: "$199",
	},
	{
		description: "For multi-team service firms with finance support needs.",
		features: ["Multi-company view", "Custom approval rules", "Cash scenario reviews", "Priority onboarding"],
		name: "Scale",
		price: "$299",
	},
] as const satisfies readonly PricingPlan[];

export const USE_CASES = {
	agencies: {
		answers: [
			"Can we approve this software renewal before the client deposit lands?",
			"Which overdue invoice will break our payroll buffer?",
			"What vendor spend can we cut before next month?",
		],
		description:
			"Agency cash changes with project milestones, client delays, contractor bills, and tool renewals. CashLift turns those moving parts into daily actions.",
		headline: "Keep agency spend aligned with client cash.",
		label: "Agencies",
	},
	consulting: {
		answers: [
			"Can we book travel for the workshop without dipping under buffer?",
			"Which retainer needs a collection nudge today?",
			"Which team has budget room for a contractor?",
		],
		description:
			"Consulting teams need fast decisions across retainers, travel, contractors, and partner tools. CashLift shows the cash impact first.",
		headline: "Approve consulting spend with retainer timing in view.",
		label: "Consulting",
	},
	"software-services": {
		answers: [
			"Can we add cloud spend for this project?",
			"Which subscription seats are idle before renewal?",
			"What happens if a milestone payment slips one week?",
		],
		description:
			"Software service firms balance payroll, cloud costs, contractors, retainers, and client milestone risk. CashLift keeps decisions tied to runway.",
		headline: "Control project spend before cash gets tight.",
		label: "Software Services",
	},
} as const satisfies Record<UseCaseSlug, UseCase>;

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
			{ href: "/app", label: "App" },
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
