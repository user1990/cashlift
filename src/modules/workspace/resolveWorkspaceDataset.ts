import { auth } from "@clerk/nextjs/server";
import { CompanyMembershipNotFoundError } from "@/modules/company-memberships/repositories/supabase";
import { reduceDatasetForDateRange, reduceDatasetForScope } from "@/modules/workspace/read-models";
import { supabaseFinanceRepository } from "@/modules/workspace/repositories/supabase";
import type { FinancialDataset, WorkspaceDatasetDateRange, WorkspaceDatasetScope } from "@/modules/workspace/types";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { captureAppException, captureAppMessage } from "@/services/platform/integrations/sentry";
import { DEMO_WORKSPACE_DATASET } from "./demoDataset";

export type ResolveWorkspaceDatasetResult =
	| { dataset: FinancialDataset; kind: "success" }
	| { kind: "config"; message: string; requestId?: string }
	| { kind: "data_error"; message: string; requestId?: string }
	| { kind: "forbidden"; message: string }
	| { kind: "service"; message: string; requestId?: string }
	| { kind: "unauthenticated"; message: string };

const GENERIC_DATA_MESSAGE = "Unable to load workspace data.";

const captureWorkspaceDatasetException = (error: unknown, failureKind: string, extra?: Record<string, unknown>) =>
	captureAppException({
		error,
		extra,
		fingerprint: ["workspace-dataset", failureKind],
		tags: {
			failureKind,
			feature: "workspace-dataset",
		},
	});

const captureWorkspaceDatasetMessage = (message: string, failureKind: string) =>
	captureAppMessage({
		fingerprint: ["workspace-dataset", failureKind],
		message,
		tags: {
			failureKind,
			feature: "workspace-dataset",
		},
	});

export const resolveWorkspaceDataset = async (
	scope: WorkspaceDatasetScope = "overview",
	dateRange?: WorkspaceDatasetDateRange,
): Promise<ResolveWorkspaceDatasetResult> => {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		return { kind: "config", message: config.message };
	}

	if (workspaceDemoEnabled()) {
		return { dataset: reduceDatasetForDateRange(await loadDemoWorkspaceDataset(scope), dateRange), kind: "success" };
	}

	let session: Awaited<ReturnType<typeof auth>>;

	try {
		session = await auth();
	} catch (error) {
		const message = "Workspace authentication is unavailable.";
		const requestId = captureWorkspaceDatasetException(error, "auth-service-error");

		return { kind: "service", message, requestId };
	}

	if (!session.userId) {
		return { kind: "unauthenticated", message: "Sign in to load workspace data." };
	}

	let accessToken: string | null;

	try {
		accessToken = await session.getToken();
	} catch (error) {
		const message = "Workspace data token is unavailable.";
		const requestId = captureWorkspaceDatasetException(error, "data-token-error");

		return { kind: "service", message, requestId };
	}

	if (!accessToken) {
		const message = "Workspace data token is unavailable.";
		const requestId = captureWorkspaceDatasetMessage(message, "missing-data-token");

		return { kind: "service", message, requestId };
	}

	try {
		const dataset = await supabaseFinanceRepository.getWorkspaceDataset(session.userId, accessToken, scope);

		return { dataset: reduceDatasetForDateRange(dataset, dateRange), kind: "success" };
	} catch (error) {
		if (error instanceof CompanyMembershipNotFoundError) {
			return { kind: "forbidden", message: "No company workspace is assigned to this user." };
		}

		const requestId = captureWorkspaceDatasetException(error, "data-error");

		return { kind: "data_error", message: GENERIC_DATA_MESSAGE, requestId };
	}
};

const loadDemoWorkspaceDataset = async (scope: WorkspaceDatasetScope): Promise<FinancialDataset> => {
	"use cache";

	return reduceDatasetForScope(DEMO_WORKSPACE_DATASET, scope);
};
