import { auth } from "@clerk/nextjs/server";
import {
	CompanyMembershipNotFoundError,
	supabaseFinanceRepository,
} from "@/modules/base/finance/repositories/supabase";
import type { FinancialDataset } from "@/modules/base/finance/types";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";

export type ResolveWorkspaceDatasetResult =
	| { dataset: FinancialDataset; kind: "success" }
	| { kind: "config"; message: string }
	| { kind: "data_error"; message: string }
	| { kind: "forbidden"; message: string }
	| { kind: "service"; message: string }
	| { kind: "unauthenticated"; message: string };

const GENERIC_DATA_MESSAGE = "Unable to load workspace data.";

const demoCompanyId = () => process.env.SUPABASE_DEMO_COMPANY_ID ?? "studio-nova";

export const resolveWorkspaceDataset = async (): Promise<ResolveWorkspaceDatasetResult> => {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		return { kind: "config", message: config.message };
	}

	if (workspaceDemoEnabled()) {
		try {
			const dataset = await supabaseFinanceRepository.getDashboardDatasetByCompanyId(demoCompanyId());

			return { dataset, kind: "success" };
		} catch {
			return { kind: "data_error", message: GENERIC_DATA_MESSAGE };
		}
	}

	try {
		const session = await auth();

		if (!session.userId) {
			return { kind: "unauthenticated", message: "Sign in to load workspace data." };
		}

		const accessToken = await session.getToken({ template: "supabase" });

		if (!accessToken) {
			return { kind: "service", message: "Workspace data token is not configured." };
		}

		try {
			const dataset = await supabaseFinanceRepository.getDashboardDataset(session.userId, accessToken);

			return { dataset, kind: "success" };
		} catch (error) {
			if (error instanceof CompanyMembershipNotFoundError) {
				return { kind: "forbidden", message: "No company workspace is assigned to this user." };
			}

			return { kind: "data_error", message: GENERIC_DATA_MESSAGE };
		}
	} catch {
		return { kind: "service", message: "Workspace auth is not configured." };
	}
};
