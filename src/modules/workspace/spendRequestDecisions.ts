import { auth } from "@clerk/nextjs/server";
import {
	CompanyMembershipNotFoundError,
	selectCompanyMembership,
} from "@/modules/company-memberships/repositories/supabase";
import type { SpendRequestDecisionInput } from "@/modules/spend-requests/schemas";
import { spendRequestDecisionSchema } from "@/modules/spend-requests/schemas";
import type { SpendRequest } from "@/modules/spend-requests/types";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { captureAppException, captureAppMessage } from "@/services/platform/integrations/sentry";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { demoWorkspaceDataset } from "./demoDataset";
import { SpendRequestNotFoundError, supabaseFinanceRepository } from "./repositories/supabase";

export type SpendRequestDecisionResult =
	| {
			request: SpendRequest;
			status: "success";
	  }
	| {
			code: "forbidden" | "invalid" | "not_found" | "service" | "unauthenticated" | "unavailable";
			message: string;
			status: "error";
	  };

type AuthSession = Awaited<ReturnType<typeof auth>>;

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

const decideDemoSpendRequest = ({ id, status }: SpendRequestDecisionInput): SpendRequestDecisionResult => {
	const request = demoWorkspaceDataset.spendRequests.find((spendRequest) => spendRequest.id === id);

	if (!request) {
		return { code: "not_found", message: "Spend request was not found.", status: "error" };
	}

	return { request: { ...request, status }, status: "success" };
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
		return decideDemoSpendRequest(parsed.data);
	}

	try {
		const session = authSession ?? (await auth());

		if (!session.userId) {
			return { code: "unauthenticated", message: "Sign in to update spend requests.", status: "error" };
		}

		const accessToken = await session.getToken();

		if (!accessToken) {
			const message = "Workspace data token is unavailable.";
			captureSpendRequestMessage(message, "missing-data-token");

			return { code: "service", message, status: "error" };
		}

		const client = createServerSupabaseClient({ accessToken });
		const membership = await selectCompanyMembership(client, session.userId);

		if (membership.role !== "owner-finance" && membership.role !== "manager") {
			return {
				code: "forbidden",
				message: "Only finance leads and managers can decide spend requests.",
				status: "error",
			};
		}

		const request = await supabaseFinanceRepository.updateSpendRequestStatus(
			session.userId,
			accessToken,
			parsed.data.id,
			parsed.data.status,
		);

		return { request, status: "success" };
	} catch (error) {
		if (error instanceof CompanyMembershipNotFoundError) {
			return { code: "forbidden", message: "No company workspace is assigned to this user.", status: "error" };
		}

		if (error instanceof SpendRequestNotFoundError) {
			return { code: "not_found", message: "Spend request was not found.", status: "error" };
		}

		captureSpendRequestException(error, "data-error");

		return { code: "unavailable", message: "Unable to update spend request.", status: "error" };
	}
};
