export const FIND_DIRECTIONS = {
	a: {
		href: "/dashboard/explore/find/a",
		id: "a",
		name: "Command-first",
		promise: "Type to find, grouped as you go",
		summary:
			"The search field is the product. Results group by kind, with recent queries and keyboard movement. Categories exist only as groups inside the list.",
	},
	b: {
		href: "/dashboard/explore/find/b",
		id: "b",
		name: "Catalog-first",
		promise: "Browse a kind, then narrow",
		summary:
			"A category rail of invoices, spend requests, subscriptions, vendor bills, cash actions, and budgets. Search and filters narrow that catalog.",
	},
	c: {
		href: "/dashboard/explore/find/c",
		id: "c",
		name: "Action-first",
		promise: "Find the next cash decision in seconds",
		summary:
			"Search first, then work categories (collect, approve, cut, pay, review). Progressive filters and dense rows with one action each.",
	},
} as const;

export const FIND_DIRECTION_IDS = ["a", "b", "c"] as const;

export type FindDirectionId = (typeof FIND_DIRECTION_IDS)[number];

export const isFindDirectionId = (value: string): value is FindDirectionId =>
	FIND_DIRECTION_IDS.some((id) => id === value);
