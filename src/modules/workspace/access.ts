import { auth } from "@clerk/nextjs/server";
import { captureAppException, captureAppMessage } from "@/services/platform/integrations/sentry";

export type AuthSession = Awaited<ReturnType<typeof auth>>;

export type WorkspaceOperationFailure =
	| { kind: "forbidden"; message: string }
	| { kind: "service"; message: string; requestId?: string }
	| { kind: "unauthenticated"; message: string };

const WORKSPACE_OPERATION_FEATURE = "workspace-operation";

export const captureWorkspaceOperationException = (
	error: unknown,
	failureKind: string,
	extra?: Record<string, unknown>,
) =>
	captureAppException({
		error,
		extra,
		fingerprint: [WORKSPACE_OPERATION_FEATURE, failureKind],
		tags: {
			failureKind,
			feature: WORKSPACE_OPERATION_FEATURE,
		},
	});

export const captureWorkspaceOperationMessage = (message: string, failureKind: string) =>
	captureAppMessage({
		fingerprint: [WORKSPACE_OPERATION_FEATURE, failureKind],
		message,
		tags: {
			failureKind,
			feature: WORKSPACE_OPERATION_FEATURE,
		},
	});

export const isWorkspaceOperationFailure = (
	value: AuthSession | WorkspaceOperationFailure | string,
): value is WorkspaceOperationFailure => typeof value === "object" && value !== null && "kind" in value;

export const getWorkspaceAuthSession = async (): Promise<AuthSession | WorkspaceOperationFailure> => {
	try {
		return await auth();
	} catch (error) {
		const message = "Workspace authentication is unavailable.";
		const requestId = captureWorkspaceOperationException(error, "auth-service-error");

		return { kind: "service", message, requestId };
	}
};

export const getWorkspaceAccessToken = async (session: AuthSession): Promise<string | WorkspaceOperationFailure> => {
	try {
		const accessToken = await session.getToken();

		if (!accessToken) {
			const message = "Workspace data token is unavailable.";
			const requestId = captureWorkspaceOperationMessage(message, "missing-data-token");

			return { kind: "service", message, requestId };
		}

		return accessToken;
	} catch (error) {
		const message = "Workspace data token is unavailable.";
		const requestId = captureWorkspaceOperationException(error, "data-token-error");

		return { kind: "service", message, requestId };
	}
};
