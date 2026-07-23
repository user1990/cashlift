"use client";

import { useSyncExternalStore } from "react";
import { getInvoiceRiskTotal } from "@/modules/invoices/utils";
import type { FinancialDataset } from "@/modules/workspace/types";

export const useInvoiceRiskTotal = (invoices: FinancialDataset["invoices"]) =>
	useSyncExternalStore(
		subscribeToBrowserTime,
		() => getInvoiceRiskTotal(invoices, new Date()),
		getServerInvoiceRiskTotal,
	);

function subscribeToBrowserTime(onStoreChange: () => void) {
	let timeoutId: ReturnType<typeof setTimeout>;

	function scheduleNextMidnight() {
		const now = new Date();
		const nextMidnight = new Date(now);
		nextMidnight.setHours(24, 0, 0, 0);

		timeoutId = setTimeout(() => {
			onStoreChange();
			scheduleNextMidnight();
		}, nextMidnight.getTime() - now.getTime());
	}

	scheduleNextMidnight();

	return () => clearTimeout(timeoutId);
}

function getServerInvoiceRiskTotal() {
	return undefined;
}
