import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const COMPANY_SCOPED_READ_TABLES = [
	"company_members",
	"invoices",
	"vendor_bills",
	"subscriptions",
	"spend_requests",
	"team_budgets",
	"forecast_points",
] as const;

describe("production Supabase policies", () => {
	it("do not grant anonymous demo access", () => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");

		expect(productionPolicies).not.toMatch(/\bto\s+anon\b/i);
		expect(productionPolicies).not.toMatch(/Allow demo/i);
	});

	it.each(COMPANY_SCOPED_READ_TABLES)("restricts %s reads to authenticated company members", (table) => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");

		expect(productionPolicies).toMatch(
			new RegExp(
				`create policy "[^"]+"\\s+on ${table}\\s+for select\\s+to authenticated\\s+using \\(company_id in \\(select current_user_company_ids\\(\\)\\)\\)`,
				"i",
			),
		);
	});

	it("restricts company reads to authenticated company members", () => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");

		expect(productionPolicies).toMatch(
			/create policy "Members can read own company"\s+on companies\s+for select\s+to authenticated\s+using \(id in \(select current_user_company_ids\(\)\)\)/i,
		);
	});

	it("requires an approver role before a spend request can be updated", () => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");
		const spendRequestUpdatePolicy = productionPolicies.match(
			/create policy "Approvers can update spend requests"[\s\S]*?(?=\n\ndrop policy|\s*$)/,
		)?.[0];

		expect(spendRequestUpdatePolicy).toBeDefined();
		expect(spendRequestUpdatePolicy).toContain("to authenticated");
		expect(spendRequestUpdatePolicy).toContain("role in ('owner-finance', 'manager')");
		expect(spendRequestUpdatePolicy).toContain("with check");
	});

	it("restrict cash actions to the authenticated member's company and role", () => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");
		const companyRoleFunction = productionPolicies.match(
			/create or replace function current_user_company_roles\(\)[\s\S]*?\$\$;/,
		)?.[0];
		const cashActionPolicy = productionPolicies.match(
			/create policy "Members can read visible cash actions"[\s\S]*?(?=\n\ndrop policy|\s*$)/,
		)?.[0];

		expect(companyRoleFunction).toBeDefined();
		expect(companyRoleFunction).toContain("company_members.company_id, company_members.role");
		expect(companyRoleFunction).toContain("company_members.clerk_user_id = auth.jwt() ->> 'sub'");
		expect(companyRoleFunction).toContain("security definer");
		expect(productionPolicies).toContain("revoke all on function current_user_company_roles() from public");
		expect(productionPolicies).toContain("grant execute on function current_user_company_roles() to authenticated");
		expect(cashActionPolicy).toBeDefined();
		expect(cashActionPolicy).toContain("from current_user_company_roles() as membership");
		expect(cashActionPolicy).toContain("membership.company_id = cash_actions.company_id");
		expect(cashActionPolicy).toContain("membership.role = any(cash_actions.visible_to)");
	});
});
