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
import {
	DEMO_STEPS_COPY,
	FEATURE_CARDS_COPY,
	FOOTER_LINKS_COPY,
	HELP_FAQ_ARTICLES,
	HELP_FAQ_GROUPS_COPY,
	PRICING_COMPARISON_GROUPS_COPY,
	PRICING_PLANS_COPY,
	PRODUCT_NAV_COPY,
	PROOF_POINTS_COPY,
	USE_CASES_COPY,
} from "./site";

type DemoStep = {
	description: string;
	icon: LucideIcon;
	title: string;
};

export type HelpFaqIconName = "banknote-arrow-up" | "chart-spline" | "credit-card" | "life-buoy" | "users";

type HelpFaqGroup = {
	icon: HelpFaqIconName;
	items: readonly HelpFaqItem[];
	name: string;
};

export type HelpFaqItem = {
	answer: string;
	question: string;
	slug: string;
};

export type HelpFaqArticle = {
	description: string;
	sections: readonly {
		body: string;
		heading: string;
	}[];
	relatedSlugs?: readonly string[];
};

type MarketingCard = {
	description: string;
	icon: LucideIcon;
	title: string;
};

type PricingPlan = (typeof PRICING_PLANS_COPY)[number];
type PricingPlanSlug = PricingPlan["slug"];
export type PricingBilling = "annual" | "monthly";

export const DEFAULT_PRICING_PLAN_SLUG = "professional" satisfies PricingPlanSlug;

export const PRODUCT_NAV = PRODUCT_NAV_COPY;

export const SOLUTION_NAV = FOOTER_LINKS_COPY[1].links;

const FEATURE_CARD_ICONS = [ClipboardCheck, CreditCard, FileClock, SearchCheck, ChartSpline, Users] as const;

export const FEATURE_CARDS = FEATURE_CARDS_COPY.map((card, index) => ({
	...card,
	icon: FEATURE_CARD_ICONS[index] ?? ClipboardCheck,
})) as readonly MarketingCard[];

export const PRICING_PLANS = PRICING_PLANS_COPY;

export const PRICING_COMPARISON_GROUPS = PRICING_COMPARISON_GROUPS_COPY;

export const getPricingPlanBySlug = (slug: string | undefined) =>
	PRICING_PLANS.find((plan) => plan.slug === slug) ??
	PRICING_PLANS.find((plan) => plan.slug === DEFAULT_PRICING_PLAN_SLUG) ??
	PRICING_PLANS[0];

export const USE_CASES = USE_CASES_COPY;

const PROOF_POINT_ICONS = [FileClock, SearchCheck, ClipboardCheck] as const;

export const PROOF_POINTS = PROOF_POINTS_COPY.map((point, index) => ({
	...point,
	icon: PROOF_POINT_ICONS[index] ?? ClipboardCheck,
	image:
		[
			"/marketing/customers-invoice-bg.webp",
			"/marketing/customers-vendor-bg.webp",
			"/marketing/customers-audit-bg.webp",
		][index] ?? "/marketing/customers-audit-bg.webp",
})) as readonly { icon: LucideIcon; image: string; metric: string; text: string }[];

export const HELP_FAQ_GROUPS: readonly HelpFaqGroup[] = HELP_FAQ_GROUPS_COPY;

export const getHelpFaqItemBySlug = (slug: string): HelpFaqItem | undefined =>
	HELP_FAQ_GROUPS.flatMap(({ items }) => items).find((item) => item.slug === slug);

export const getHelpFaqArticleBySlug = (slug: string) => HELP_FAQ_ARTICLES[slug as keyof typeof HELP_FAQ_ARTICLES];

export const FOOTER_LINKS = FOOTER_LINKS_COPY;

const DEMO_STEP_ICONS = [BanknoteArrowUp, ShieldCheck, LifeBuoy] as const;

export const DEMO_STEPS = DEMO_STEPS_COPY.map((step, index) => ({
	...step,
	icon: DEMO_STEP_ICONS[index] ?? ShieldCheck,
})) as readonly DemoStep[];
