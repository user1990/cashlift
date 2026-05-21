import { auth } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { captureAppException, captureAppMessage } from "@/services/platform/integrations/sentry";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { AppError } from "@/utilities/errors/AppError";
import type { SpendRequestDecisionInput } from "./schemas";
import { spendRequestDecisionSchema } from "./schemas";

type CompanyMemberRow = {
	company_id: string;
};

type UpdatedSpendRequestRow = {
	id: string;
};

type SupabaseQueryError = {
	code?: string;
	message: string;
};

type SupabaseQueryResult<Data> = {
	data: Data | null;
	error: SupabaseQueryError | null;
};

export type SpendRequestDecisionResult =
	| {
			refresh: boolean;
			status: "success";
	  }
	| {
			code: "forbidden" | "invalid" | "not_found" | "service" | "unauthenticated" | "unavailable";
			message: string;
			status: "error";
	  };

type AuthSession = Awaited<ReturnType<typeof auth>>;

class SpendRequestCompanyMembershipNotFoundError extends AppError {
	constructor() {
		super({
			code: "workspace_forbidden",
			message: "No company workspace is assigned to this user.",
		});
		this.name = "SpendRequestCompanyMembershipNotFoundError";
	}
}

class SpendRequestNotFoundError extends AppError {
	constructor() {
		super({
			code: "supabase_empty_row",
			message: "Spend request was not found.",
		});
		this.name = "SpendRequestNotFoundError";
	}
}

const captureSpendRequestException = (error: unknown, failureKind: string, extra?: Record<string, unknown>) =>
	captureAppException({
		error,
		extra,
		fingerprint: ["spend-request-decision", failureKind],
		tags: {
			failureKind,
			feature: "spend-request-decision",
		},
	});

const captureSpendRequestMessage = (message: string, failureKind: string) =>
	captureAppMessage({
		fingerprint: ["spend-request-decision", failureKind],
		message,
		tags: {
			failureKind,
			feature: "spend-request-decision",
		},
	});

const selectCompanyId = async (client: SupabaseClient, userId: string) => {
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
		throw new SpendRequestCompanyMembershipNotFoundError();
	}

	return data.company_id;
};

const updateSpendRequestStatus = async (
	client: SupabaseClient,
	companyId: string,
	decision: SpendRequestDecisionInput,
) => {
	const { data, error } = (await client
		.from("spend_requests")
		.update({ status: decision.status })
		.eq("company_id", companyId)
		.eq("id", decision.id)
		.select("id")
		.maybeSingle<UpdatedSpendRequestRow>()) as SupabaseQueryResult<UpdatedSpendRequestRow>;

	if (error) {
		throw new AppError({
			cause: error,
			code: "supabase_query_failed",
			details: { table: "spend_requests", supabaseCode: error.code },
			message: "Unable to update spend request.",
		});
	}

	if (!data) {
		throw new SpendRequestNotFoundError();
	}
};

export const decideSpendRequest = async (
	input: SpendRequestDecisionInput,
	authSession?: AuthSession,
): Promise<SpendRequestDecisionResult> => {
	const parsed = spendRequestDecisionSchema.safeParse(input);

	if (!parsed.success) {
		return { code: "invalid", message: "Spend request decision is invalid.", status: "error" };
	}

	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		captureSpendRequestMessage(config.message, "config");

		return { code: "service", message: config.message, status: "error" };
	}

	if (workspaceDemoEnabled()) {
		return { refresh: false, status: "success" };
	}

	try {
		const session = authSession ?? (await auth());

		if (!session.userId) {
			return { code: "unauthenticated", message: "Sign in to update spend requests.", status: "error" };
		}

		const accessToken = await session.getToken({ template: "supabase" });

		if (!accessToken) {
			const message = "Workspace data token is not configured.";
			captureSpendRequestMessage(message, "missing-data-token");

			return { code: "service", message, status: "error" };
		}

		const client = createServerSupabaseClient({ accessToken });
		const companyId = await selectCompanyId(client, session.userId);

		await updateSpendRequestStatus(client, companyId, parsed.data);

		return { refresh: true, status: "success" };
	} catch (error) {
		if (error instanceof SpendRequestCompanyMembershipNotFoundError) {
			return { code: "forbidden", message: "No company workspace is assigned to this user.", status: "error" };
		}

		if (error instanceof SpendRequestNotFoundError) {
			return { code: "not_found", message: "Spend request was not found.", status: "error" };
		}

		captureSpendRequestException(error, "data-error");

		return { code: "unavailable", message: "Unable to update spend request.", status: "error" };
	}
};
