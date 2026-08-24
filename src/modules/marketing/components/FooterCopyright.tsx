"use client";

import { useSyncExternalStore } from "react";

const MAX_TIMEOUT_MS = 2_147_483_647;

export const FooterCopyright = () => {
	const currentYear = useSyncExternalStore(subscribeToYearChange, getCurrentYear, getServerYear);

	return <span>© {currentYear} CashLift. All rights reserved.</span>;
};

function subscribeToYearChange(onStoreChange: () => void) {
	let timeoutId: ReturnType<typeof setTimeout>;

	function scheduleYearCheck() {
		const now = new Date();
		const nextYear = new Date(now.getFullYear() + 1, 0, 1);
		const delay = Math.min(nextYear.getTime() - now.getTime(), MAX_TIMEOUT_MS);

		timeoutId = setTimeout(() => {
			onStoreChange();
			scheduleYearCheck();
		}, delay);
	}

	scheduleYearCheck();

	return () => clearTimeout(timeoutId);
}

function getCurrentYear() {
	return new Date().getFullYear();
}

function getServerYear() {
	return new Date().getFullYear();
}
