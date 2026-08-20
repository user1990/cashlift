import { getRemainingTeamBudget } from "@/modules/budgets/utils";
import { formatCurrency } from "@/modules/money/format";
import type { MoneyCents } from "@/modules/money/types";
import { isVendorLeak } from "@/modules/subscriptions/utils";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getCashActionDestination } from "../../cashActionDestination";
import { formatDashboardDate } from "../../overviewDateRangeLabel";
import { CASH_ACTION_NEXT_STEP } from "../exploreModel";

export const FIND_KINDS = ["invoice", "spend-request", "subscription", "vendor-bill", "cash-action", "budget"] as const;

export type FindKind = (typeof FIND_KINDS)[number];

export const FIND_WORK = ["collect", "approve", "cut", "pay", "review"] as const;

export type FindWork = (typeof FIND_WORK)[number];

export type FindItem = {
	actionHref: string;
	actionLabel: string;
	amountCents: MoneyCents;
	dueDate?: string;
	id: string;
	kind: FindKind;
	kindLabel: string;
	owner: string;
	status: string;
	subtitle: string;
	title: string;
	work: FindWork;
	team?: string;
};

export type FindQuery = {
	category: string;
	owner: string;
	query: string;
	status: string;
};

export const KIND_LABELS: Record<FindKind, string> = {
	budget: "Budget",
	"cash-action": "Cash Action",
	invoice: "Invoice",
	"spend-request": "Spend Request",
	subscription: "Subscription",
	"vendor-bill": "Vendor Bill",
};

export const WORK_LABELS: Record<FindWork, string> = {
	approve: "Approve",
	collect: "Collect",
	cut: "Cut",
	pay: "Pay",
	review: "Review",
};

export const CATALOG_CATEGORY_IDS = ["all", ...FIND_KINDS] as const;
export const ACTION_CATEGORY_IDS = ["all", ...FIND_WORK] as const;

export const buildFindItems = (dataset: FinancialDataset, basePath: string): FindItem[] => {
	const invoices = dataset.invoices.map((invoice) => ({
		actionHref: `${basePath}/invoices`,
		actionLabel: "Open invoices",
		amountCents: invoice.amountCents,
		dueDate: invoice.dueDate,
		id: invoice.id,
		kind: "invoice" as const,
		kindLabel: KIND_LABELS.invoice,
		owner: invoice.owner,
		status: invoice.status,
		subtitle: `${invoice.status} · ${invoice.owner}`,
		title: invoice.client,
		work: "collect" as const,
	}));
	const spendRequests = dataset.spendRequests.map((request) => ({
		actionHref: `${basePath}/approvals`,
		actionLabel: "Open approvals",
		amountCents: request.amountCents,
		dueDate: request.neededByDate,
		id: request.id,
		kind: "spend-request" as const,
		kindLabel: KIND_LABELS["spend-request"],
		owner: request.requester,
		status: request.status,
		subtitle: `${request.team} · ${request.reason}`,
		team: request.team,
		title: request.vendor,
		work: "approve" as const,
	}));
	const subscriptions = dataset.subscriptions.map((subscription) => ({
		actionHref: `${basePath}/vendors`,
		actionLabel: "Open vendors",
		amountCents: subscription.amountCents,
		dueDate: subscription.renewalDate,
		id: subscription.id,
		kind: "subscription" as const,
		kindLabel: KIND_LABELS.subscription,
		owner: subscription.owner,
		status: subscription.status,
		subtitle: isVendorLeak(subscription)
			? `Vendor leak · ${subscription.owner}`
			: `${subscription.status} · ${subscription.owner}`,
		title: subscription.vendor,
		work: "cut" as const,
	}));
	const vendorBills = dataset.vendorBills.map((bill) => ({
		actionHref: `${basePath}/vendors`,
		actionLabel: "Open vendors",
		amountCents: bill.amountCents,
		dueDate: bill.dueDate,
		id: bill.id,
		kind: "vendor-bill" as const,
		kindLabel: KIND_LABELS["vendor-bill"],
		owner: dataset.profile.name,
		status: bill.status,
		subtitle: `${bill.category} · ${bill.status}`,
		title: bill.vendor,
		work: "pay" as const,
	}));
	const cashActions = dataset.cashActions.map((action) => ({
		actionHref: getCashActionDestination(action.type, basePath),
		actionLabel: CASH_ACTION_NEXT_STEP[action.type],
		amountCents: action.impactCents,
		dueDate: action.dueDate,
		id: action.id,
		kind: "cash-action" as const,
		kindLabel: KIND_LABELS["cash-action"],
		owner: action.owner,
		status: action.status,
		subtitle: action.description,
		title: action.title,
		work: getCashActionWork(action.type),
	}));
	const budgets = dataset.teamBudgets.map((budget) => ({
		actionHref: `${basePath}/budgets`,
		actionLabel: "Open budgets",
		amountCents: getRemainingTeamBudget(budget),
		id: budget.id,
		kind: "budget" as const,
		kindLabel: KIND_LABELS.budget,
		owner: budget.team,
		status: getRemainingTeamBudget(budget) >= 0 ? "on-track" : "over-budget",
		subtitle: `${budget.team} remaining this range`,
		team: budget.team,
		title: budget.team,
		work: "review" as const,
	}));

	return [...cashActions, ...invoices, ...spendRequests, ...subscriptions, ...vendorBills, ...budgets];
};

export const filterFindItems = (items: FindItem[], query: FindQuery, categoryMode: "kind" | "work") =>
	items.filter((item) => itemMatchesFindQuery(item, query, categoryMode));

export const getFindSuggestions = (items: FindItem[], query: string, limit = 6) => {
	const normalizedQuery = normalizeFindQuery(query);

	if (!normalizedQuery) {
		return [];
	}

	const seen = new Set<string>();
	const suggestions: string[] = [];

	for (const item of items) {
		if (!getFindHaystack(item).includes(normalizedQuery) || seen.has(item.title)) {
			continue;
		}

		seen.add(item.title);
		suggestions.push(item.title);

		if (suggestions.length >= limit) {
			break;
		}
	}

	return suggestions;
};

export const getFindFacetValues = (items: FindItem[], field: "owner" | "status") =>
	[...new Set(items.map((item) => item[field]))].toSorted((left, right) => left.localeCompare(right));

export const countFindCategory = (items: FindItem[], category: string, categoryMode: "kind" | "work") => {
	if (category === "all") {
		return items.length;
	}

	return items.filter((item) => (categoryMode === "kind" ? item.kind : item.work) === category).length;
};

export const groupFindItems = (items: FindItem[]) => {
	const groups: { id: FindKind; items: FindItem[]; label: string }[] = [];

	for (const kind of FIND_KINDS) {
		const kindItems = items.filter((item) => item.kind === kind);

		if (kindItems.length) {
			groups.push({ id: kind, items: kindItems, label: KIND_LABELS[kind] });
		}
	}

	return groups;
};

export const formatFindAmount = (cents: MoneyCents) => formatCurrency(cents);

export const formatFindDueDate = (isoDate: string | undefined) => (isoDate ? formatDashboardDate(isoDate) : undefined);

export const EMPTY_FIND_QUERY: FindQuery = {
	category: "all",
	owner: "",
	query: "",
	status: "",
};

export const hasActiveFindFilters = (query: FindQuery) => Boolean(query.owner || query.status);

export type FindExample = {
	category: string;
	hint?: string;
	id: string;
	label: string;
	query?: string;
};

export const getFindExamples = (items: FindItem[], categoryMode: "kind" | "work", limit = 6): FindExample[] => {
	const examples: FindExample[] = [];

	for (const category of categoryMode === "kind" ? CATALOG_CATEGORY_IDS : ACTION_CATEGORY_IDS) {
		if (category === "all") {
			continue;
		}

		const match = items.find((item) => (categoryMode === "kind" ? item.kind : item.work) === category);

		if (!match) {
			continue;
		}

		examples.push({
			category,
			hint: match.title,
			id: `example-${category}`,
			label: categoryMode === "kind" ? KIND_LABELS[category as FindKind] : WORK_LABELS[category as FindWork],
		});

		if (examples.length >= limit) {
			break;
		}
	}

	return examples;
};

function itemMatchesFindQuery(item: FindItem, query: FindQuery, categoryMode: "kind" | "work") {
	const categoryValue = categoryMode === "kind" ? item.kind : item.work;
	const normalizedQuery = normalizeFindQuery(query.query);

	return (
		(query.category === "all" || categoryValue === query.category) &&
		(!query.status || item.status === query.status) &&
		(!query.owner || item.owner === query.owner) &&
		(!normalizedQuery || getFindHaystack(item).includes(normalizedQuery))
	);
}

function getCashActionWork(type: FinancialDataset["cashActions"][number]["type"]): FindWork {
	if (type === "collection") {
		return "collect";
	}

	if (type === "approval") {
		return "approve";
	}

	if (type === "vendor-leak") {
		return "cut";
	}

	return "review";
}

function normalizeFindQuery(query: string) {
	return query.trim().toLowerCase();
}

function getFindHaystack(item: FindItem) {
	return [item.title, item.subtitle, item.owner, item.status, item.kindLabel, item.team ?? ""].join(" ").toLowerCase();
}
