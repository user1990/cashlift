export const EXPLORE_DIRECTIONS = {
	a: {
		href: "/dashboard/explore/a",
		id: "a",
		name: "Decision-first",
		promise: "What deserves attention today, and why",
		summary: "Today’s Cash Action queue is the primary surface. Cash context stays compact and supporting.",
	},
	b: {
		href: "/dashboard/explore/b",
		id: "b",
		name: "Cash-health-first",
		promise: "Where cash is heading, and what could change it",
		summary: "Cash on hand and the 13-week outlook lead. Cash Actions are levers on that path, not a separate inbox.",
	},
	c: {
		href: "/dashboard/explore/c",
		id: "c",
		name: "Operating cockpit",
		promise: "Status, then priorities, then the future, then supporting work",
		summary: "A balanced desk: current cash state, the one decision that matters, and the outlook that explains why.",
	},
} as const;

export const EXPLORE_DIRECTION_IDS = ["a", "b", "c"] as const;

export type ExploreDirectionId = (typeof EXPLORE_DIRECTION_IDS)[number];

export const isExploreDirectionId = (value: string): value is ExploreDirectionId =>
	EXPLORE_DIRECTION_IDS.some((id) => id === value);
