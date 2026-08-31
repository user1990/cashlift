import { describe, expect, it } from "vitest";
import {
	getActiveWorkspaceNavItem,
	getWorkspaceNavGroups,
	getWorkspaceNavItems,
	isWorkspaceNavItemActive,
} from "./navigation";

describe("workspace navigation", () => {
	it("groups related workspace destinations with dividable sections", () => {
		const groups = getWorkspaceNavGroups("/dashboard");
		const items = getWorkspaceNavItems("/dashboard");
		const hrefs = items.map((item) => item.href);

		expect(groups.map((group) => group.id)).toEqual(["home", "cash", "receivables", "spend", "company"]);
		expect(items.map((item) => item.label)).toEqual([
			"Overview",
			"Cash Insights",
			"13-week Outlook",
			"Invoices",
			"Spend approvals",
			"Vendor bills & leaks",
			"Team budgets",
			"Team",
			"Settings",
		]);
		expect(hrefs).toEqual([...new Set(hrefs)]);
		expect(items.find((item) => item.label === "13-week Outlook")?.href).toBe("/dashboard#cash-outlook");
		expect(items.find((item) => item.label === "Invoices")?.href).toBe("/dashboard/invoices");
	});

	it("prefers the most specific active destination for nested routes", () => {
		expect(getActiveWorkspaceNavItem("/dashboard/invoices", "/dashboard")?.label).toBe("Invoices");
		expect(getActiveWorkspaceNavItem("/dashboard", "/dashboard")?.label).toBe("Overview");
		expect(isWorkspaceNavItemActive("/dashboard/invoices", "/dashboard/invoices", "/dashboard")).toBe(true);
		expect(isWorkspaceNavItemActive("/dashboard/invoices", "/dashboard", "/dashboard")).toBe(false);
	});
});
