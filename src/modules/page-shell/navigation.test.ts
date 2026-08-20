import { describe, expect, it } from "vitest";
import { getActiveWorkspaceNavItem, getWorkspaceNavGroups, getWorkspaceNavItems } from "./navigation";

describe("workspace navigation", () => {
	it("groups related workspace destinations with dividable sections", () => {
		const groups = getWorkspaceNavGroups("/dashboard");

		expect(groups.map((group) => group.id)).toEqual(["home", "cash", "receivables", "spend", "company"]);
		expect(getWorkspaceNavItems("/dashboard").map((item) => item.label)).toEqual([
			"Overview",
			"Operating cockpit",
			"Cash Insights",
			"13-week Outlook",
			"Invoices",
			"Overdue collections",
			"Spend approvals",
			"Vendor bills & leaks",
			"Team budgets",
			"Team",
			"Settings",
		]);
	});

	it("hides the operating cockpit shortcut outside the dashboard workspace", () => {
		expect(getWorkspaceNavItems("/demo/workspace").map((item) => item.label)).not.toContain("Operating cockpit");
	});

	it("prefers the most specific active destination for nested routes", () => {
		expect(getActiveWorkspaceNavItem("/dashboard/explore", "/dashboard")?.label).toBe("Operating cockpit");
		expect(getActiveWorkspaceNavItem("/dashboard/invoices", "/dashboard")?.label).toBe("Invoices");
		expect(getActiveWorkspaceNavItem("/dashboard", "/dashboard")?.label).toBe("Overview");
	});
});
