import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("production Supabase policies", () => {
	it("do not grant anonymous demo access", () => {
		const productionPolicies = readFileSync("supabase/production-rls-policies.sql", "utf8");

		expect(productionPolicies).not.toMatch(/\bto\s+anon\b/i);
		expect(productionPolicies).not.toMatch(/Allow demo/i);
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
