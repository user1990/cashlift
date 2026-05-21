import { auth } from "@clerk/nextjs/server";
import { CompanyMembershipNotFoundError } from "@/modules/company-memberships/repositories/supabase";
import { reduceDatasetForScope } from "@/modules/workspace/read-models";
import { supabaseFinanceRepository } from "@/modules/workspace/repositories/supabase";
import type { FinancialDataset, WorkspaceDatasetScope } from "@/modules/workspace/types";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";
import { captureAppException, captureAppMessage } from "@/services/platform/integrations/sentry";
import { demoWorkspaceDataset } from "./demoDataset";

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
): Promise<ResolveWorkspaceDatasetResult> => {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		const requestId = captureWorkspaceDatasetMessage(config.message, "config");

		return { kind: "config", message: config.message, requestId };
	}

	if (workspaceDemoEnabled()) {
		return { dataset: reduceDatasetForScope(demoWorkspaceDataset, scope), kind: "success" };
	}

	try {
		const session = await auth();

		if (!session.userId) {
			return { kind: "unauthenticated", message: "Sign in to load workspace data." };
		}

		const accessToken = await session.getToken({ template: "supabase" });

		if (!accessToken) {
			const message = "Workspace data token is not configured.";
			const requestId = captureWorkspaceDatasetMessage(message, "missing-data-token");

			return { kind: "service", message, requestId };
		}

		try {
			const dataset = await supabaseFinanceRepository.getWorkspaceDataset(session.userId, accessToken, scope);

			return { dataset, kind: "success" };
		} catch (error) {
			if (error instanceof CompanyMembershipNotFoundError) {
				return { kind: "forbidden", message: "No company workspace is assigned to this user." };
			}

			const requestId = captureWorkspaceDatasetException(error, "data-error", { userId: session.userId });

			return { kind: "data_error", message: GENERIC_DATA_MESSAGE, requestId };
		}
	} catch (error) {
		const message = "Workspace auth is not configured.";
		const requestId = captureWorkspaceDatasetException(error, "auth-service-error");

		return { kind: "service", message, requestId };
	}
};
