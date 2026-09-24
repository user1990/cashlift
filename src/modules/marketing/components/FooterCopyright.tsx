"use client";

import { useSyncExternalStore } from "react";
import { subscribeToBrowserMidnight } from "@/utilities/dates/subscribeToBrowserMidnight";

export const FooterCopyright = () => {
	const year = useSyncExternalStore(subscribeToBrowserMidnight, getFooterCopyrightYear, getFooterCopyrightYear);

	return <span>© {year} CashLift. All rights reserved.</span>;
};

function getFooterCopyrightYear() {
	return String(new Date().getFullYear());
}
