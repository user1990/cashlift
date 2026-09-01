import { describe, expect, it } from "vitest";
import { getActiveWorkspaceNavItem, getWorkspaceNavItems, isWorkspaceNavItemActive } from "./navigation";

describe("workspace navigation", () => {
	it("groups unique workspace destinations and prefers the most specific active route", () => {
		const items = getWorkspaceNavItems("/dashboard");
		const hrefs = items.map((item) => item.href);

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
		expect(getActiveWorkspaceNavItem("/dashboard/invoices", "/dashboard")?.label).toBe("Invoices");
		expect(getActiveWorkspaceNavItem("/dashboard", "/dashboard")?.label).toBe("Overview");
		expect(isWorkspaceNavItemActive("/dashboard/invoices", "/dashboard/invoices", "/dashboard")).toBe(true);
		expect(isWorkspaceNavItemActive("/dashboard/invoices", "/dashboard", "/dashboard")).toBe(false);
	});
});
