import { PRODUCT_NAV, SOLUTION_NAV } from "../content";

type NavItem = {
	href: string;
	label: string;
};

export type NavGroup = {
	items: readonly NavItem[];
	label: string;
};

const HEADER_PRODUCT_NAV = PRODUCT_NAV.filter((item) => item.href !== "/demo");

export const MARKETING_NAV_GROUPS = [
	{ items: HEADER_PRODUCT_NAV, label: "Product" },
	{ items: SOLUTION_NAV, label: "Solutions" },
] as const satisfies readonly NavGroup[];
