"use client";

import { useSyncExternalStore } from "react";
import type { FinancialDataset } from "@/modules/workspace/types";
import { getInvoiceRiskTotal } from "@/modules/workspace/utils";

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
