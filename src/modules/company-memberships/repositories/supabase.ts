import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "@/utilities/errors/AppError";

type CompanyMemberRow = {
	company_id: string;
};

export class CompanyMembershipNotFoundError extends AppError {
	constructor() {
		super({
			code: "workspace_forbidden",
			message: "No company workspace is assigned to this user.",
		});
		this.name = "CompanyMembershipNotFoundError";
	}
}

export const selectCompanyId = async (client: SupabaseClient, userId: string) => {
	const { data, error } = await client
		.from("company_members")
		.select("company_id")
		.eq("clerk_user_id", userId)
		.limit(1)
		.maybeSingle<CompanyMemberRow>();

	if (error) {
		throw new AppError({
			cause: error,
			code: "supabase_query_failed",
			details: { table: "company_members", supabaseCode: error.code },
			message: "Unable to find company membership.",
		});
	}

	if (!data) {
		throw new CompanyMembershipNotFoundError();
	}

	return data.company_id;
};
