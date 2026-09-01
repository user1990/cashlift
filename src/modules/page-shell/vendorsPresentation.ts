import { formatPreciseCompactCurrency } from "@/modules/money/format";
import { getVendorLeakSavings, isVendorLeak } from "@/modules/subscriptions/utils";
import type { FinancialDataset } from "@/modules/workspace/types";
import { sumAmounts } from "@/utilities/amounts/sumAmounts";

type Subscription = FinancialDataset["subscriptions"][number];
type VendorBill = FinancialDataset["vendorBills"][number];

export const VENDOR_BILL_STATUS_LABELS = {
	approved: "Approved",
	"needs-review": "Needs review",
	scheduled: "Scheduled",
} as const satisfies Record<VendorBill["status"], string>;

export const VENDOR_BILL_CATEGORY_LABELS = {
	contractor: "Contractor",
	operations: "Operations",
	payroll: "Payroll",
	software: "Software",
	tax: "Tax",
} as const satisfies Record<VendorBill["category"], string>;

export const SUBSCRIPTION_STATUS_LABELS = {
	active: "Active",
	duplicate: "Duplicate",
	trial: "Trial",
	unused: "Unused",
} as const satisfies Record<Subscription["status"], string>;

export type VendorsPresentation = ReturnType<typeof buildVendorsPresentation>;

export const buildVendorsPresentation = (dataset: FinancialDataset) => {
	const leaks = dataset.subscriptions
		.filter(isVendorLeak)
		.toSorted((left, right) => right.amountCents - left.amountCents);
	const bills = dataset.vendorBills.toSorted(compareVendorBills);
	const reviewBills = bills.filter((bill) => bill.status === "needs-review");
	const leakSavingsCents = getVendorLeakSavings(dataset.subscriptions);
	const billsTotalCents = sumAmounts(bills, (bill) => bill.amountCents);
	const reviewBillsCents = sumAmounts(reviewBills, (bill) => bill.amountCents);
	const primaryLeak = leaks[0];
	const primaryBill = primaryLeak ? undefined : (reviewBills[0] ?? bills[0]);

	return {
		activeSubscriptions: dataset.subscriptions.filter((subscription) => !isVendorLeak(subscription)),
		bills,
		billsTotalCents,
		companyName: dataset.profile.name,
		headline: getVendorsHeadline({ billsTotalCents, leakSavingsCents, reviewBillCount: reviewBills.length }),
		leakSavingsCents,
		leaks,
		primaryBill,
		primaryLeak,
		remainingBills: primaryBill ? bills.filter((bill) => bill.id !== primaryBill.id) : bills,
		remainingLeaks: leaks.slice(1),
		reviewBillsCents,
	};
};

function compareVendorBills(left: VendorBill, right: VendorBill) {
	if (left.status === "needs-review" && right.status !== "needs-review") {
		return -1;
	}

	if (right.status === "needs-review" && left.status !== "needs-review") {
		return 1;
	}

	return left.dueDate.localeCompare(right.dueDate);
}

function getVendorsHeadline({
	billsTotalCents,
	leakSavingsCents,
	reviewBillCount,
}: {
	billsTotalCents: number;
	leakSavingsCents: number;
	reviewBillCount: number;
}) {
	if (leakSavingsCents > 0) {
		return `${formatPreciseCompactCurrency(leakSavingsCents)} in monthly vendor leak savings`;
	}

	if (reviewBillCount === 1) {
		return "1 vendor bill needs review";
	}

	if (reviewBillCount > 1) {
		return `${reviewBillCount} vendor bills need review`;
	}

	if (billsTotalCents > 0) {
		return `${formatPreciseCompactCurrency(billsTotalCents)} in vendor bills`;
	}

	return "No vendor leaks or vendor bills need action";
}
