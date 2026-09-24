import {
	CompanyMembershipNotFoundError,
	selectCompanyMembership,
} from "@/modules/company-memberships/repositories/supabase";
import { canDecideSpendRequests } from "@/modules/company-roles/utils";
import type { SpendRequestDecisionInput } from "@/modules/spend-requests/schemas";
import { SPEND_REQUEST_DECISION_SCHEMA } from "@/modules/spend-requests/schemas";
import type { SpendRequest } from "@/modules/spend-requests/types";
import {
	type AuthSession,
	captureWorkspaceOperationException,
	captureWorkspaceOperationMessage,
	getWorkspaceAccessToken,
	getWorkspaceAuthSession,
	isWorkspaceOperationFailure,
} from "@/modules/workspace/access";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { DEMO_WORKSPACE_DATASET } from "./demoDataset";
import {
	SpendRequestConflictError,
	SpendRequestNotFoundError,
	supabaseFinanceRepository,
} from "./repositories/supabase";

export type SpendRequestDecisionResult =
	| {
			request: SpendRequest;
			status: "success";
	  }
	| {
			code: "conflict" | "forbidden" | "invalid" | "not_found" | "service" | "unauthenticated" | "unavailable";
			message: string;
			requestId?: string;
			status: "error";
	  };

const decideDemoSpendRequest = ({ id, status }: SpendRequestDecisionInput): SpendRequestDecisionResult => {
	const request = DEMO_WORKSPACE_DATASET.spendRequests.find((spendRequest) => spendRequest.id === id);

	if (!request) {
		return { code: "not_found", message: "Spend request was not found.", status: "error" };
	}

	if (request.status !== "pending") {
		return { code: "conflict", message: "Spend request was already decided.", status: "error" };
	}

	return { request: { ...request, status }, status: "success" };
};

export const decideSpendRequest = async (
	input: SpendRequestDecisionInput,
	authSession?: AuthSession,
): Promise<SpendRequestDecisionResult> => {
	const parsed = SPEND_REQUEST_DECISION_SCHEMA.safeParse(input);

	if (!parsed.success) {
		return { code: "invalid", message: "Spend request decision is invalid.", status: "error" };
	}

	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		const requestId = captureWorkspaceOperationMessage(config.message, "config");

		return { code: "service", message: config.message, requestId, status: "error" };
	}

	if (workspaceDemoEnabled()) {
		return decideDemoSpendRequest(parsed.data);
	}

	return decideProductionSpendRequest(parsed.data, authSession);
};

const decideProductionSpendRequest = async (
	decision: SpendRequestDecisionInput,
	authSession?: AuthSession,
): Promise<SpendRequestDecisionResult> => {
	const sessionResult = authSession ?? (await getWorkspaceAuthSession());

	if (isWorkspaceOperationFailure(sessionResult)) {
		return sessionResult.kind === "service"
			? { code: "service", message: sessionResult.message, requestId: sessionResult.requestId, status: "error" }
			: { code: sessionResult.kind, message: sessionResult.message, status: "error" };
	}

	const session = sessionResult;

	if (!session.userId) {
		return { code: "unauthenticated", message: "Sign in to update spend requests.", status: "error" };
	}

	const accessToken = await getWorkspaceAccessToken(session);

	if (isWorkspaceOperationFailure(accessToken)) {
		return accessToken.kind === "service"
			? { code: "service", message: accessToken.message, requestId: accessToken.requestId, status: "error" }
			: { code: accessToken.kind, message: accessToken.message, status: "error" };
	}

	try {
		const client = createServerSupabaseClient({ accessToken });
		const membership = await selectCompanyMembership(client, session.userId);

		if (!canDecideSpendRequests(membership.role)) {
			return {
				code: "forbidden",
				message: "Only finance leads and managers can decide spend requests.",
				status: "error",
			};
		}

		const request = await supabaseFinanceRepository.updateSpendRequestStatus(
			membership.companyId,
			accessToken,
			decision.id,
			decision.status,
		);

		return { request, status: "success" };
	} catch (error) {
		if (error instanceof CompanyMembershipNotFoundError) {
			return { code: "forbidden", message: "No company workspace is assigned to this user.", status: "error" };
		}

		if (error instanceof SpendRequestConflictError) {
			return { code: "conflict", message: "Spend request was already decided.", status: "error" };
		}

		if (error instanceof SpendRequestNotFoundError) {
			return { code: "not_found", message: "Spend request was not found.", status: "error" };
		}

		const requestId = captureWorkspaceOperationException(error, "data-error");

		return { code: "unavailable", message: "Unable to update spend request.", requestId, status: "error" };
	}
};
