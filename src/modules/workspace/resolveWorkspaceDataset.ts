import { CompanyMembershipNotFoundError } from "@/modules/company-memberships/repositories/supabase";
import {
	captureWorkspaceOperationException,
	getWorkspaceAccessToken,
	getWorkspaceAuthSession,
	isWorkspaceOperationFailure,
} from "@/modules/workspace/access";
import { reduceDatasetForDateRange, reduceDatasetForScope } from "@/modules/workspace/read-models";
import { supabaseFinanceRepository } from "@/modules/workspace/repositories/supabase";
import type { FinancialDataset, WorkspaceDatasetDateRange, WorkspaceDatasetScope } from "@/modules/workspace/types";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { DEMO_WORKSPACE_DATASET } from "./demoDataset";

export type ResolveWorkspaceDatasetResult =
	| { dataset: FinancialDataset; kind: "success" }
	| { kind: "config"; message: string; requestId?: string }
	| { kind: "data_error"; message: string; requestId?: string }
	| { kind: "forbidden"; message: string }
	| { kind: "service"; message: string; requestId?: string }
	| { kind: "unauthenticated"; message: string };

const GENERIC_DATA_MESSAGE = "Unable to load workspace data.";

export const resolveWorkspaceDataset = async (
	scope: WorkspaceDatasetScope = "overview",
	dateRange?: WorkspaceDatasetDateRange,
): Promise<ResolveWorkspaceDatasetResult> => {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		return { kind: "config", message: config.message };
	}

	if (workspaceDemoEnabled()) {
		return { dataset: reduceDatasetForDateRange(loadDemoWorkspaceDataset(scope), dateRange), kind: "success" };
	}

	const session = await getWorkspaceAuthSession();

	if (isWorkspaceOperationFailure(session)) {
		return session.kind === "service"
			? { kind: "service", message: session.message, requestId: session.requestId }
			: { kind: session.kind, message: session.message };
	}

	if (!session.userId) {
		return { kind: "unauthenticated", message: "Sign in to load workspace data." };
	}

	const accessToken = await getWorkspaceAccessToken(session);

	if (isWorkspaceOperationFailure(accessToken)) {
		return accessToken.kind === "service"
			? { kind: "service", message: accessToken.message, requestId: accessToken.requestId }
			: { kind: accessToken.kind, message: accessToken.message };
	}

	try {
		const dataset = await supabaseFinanceRepository.getWorkspaceDataset(session.userId, accessToken, scope);

		return { dataset: reduceDatasetForDateRange(dataset, dateRange), kind: "success" };
	} catch (error) {
		if (error instanceof CompanyMembershipNotFoundError) {
			return { kind: "forbidden", message: "No company workspace is assigned to this user." };
		}

		const requestId = captureWorkspaceOperationException(error, "data-error");

		return { kind: "data_error", message: GENERIC_DATA_MESSAGE, requestId };
	}
};

const loadDemoWorkspaceDataset = (scope: WorkspaceDatasetScope): FinancialDataset =>
	reduceDatasetForScope(DEMO_WORKSPACE_DATASET, scope);
