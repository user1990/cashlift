import { PRODUCT_NAV, SOLUTION_NAV } from "../content";

type NavItem = {
	href: string;
	label: string;
};

export type NavGroup = {
	items: readonly NavItem[];
	label: string;
};

export const MARKETING_NAV_GROUPS = [
	{ items: PRODUCT_NAV, label: "Product" },
	{ items: SOLUTION_NAV, label: "Solutions" },
] as const satisfies readonly NavGroup[];
