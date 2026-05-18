export type AppErrorCode =
	| "api_request_failed"
	| "supabase_empty_row"
	| "supabase_query_failed"
	| "workspace_config_unavailable"
	| "workspace_data_unavailable"
	| "workspace_forbidden"
	| "workspace_service_unavailable"
	| "workspace_unauthenticated";

type AppErrorParams = {
	code: AppErrorCode;
	message: string;
	cause?: unknown;
	details?: Record<string, unknown>;
	requestId?: string;
	statusCode?: number;
};

export class AppError extends Error {
	readonly code: AppErrorCode;
	readonly details?: Record<string, unknown>;
	readonly requestId?: string;
	readonly statusCode?: number;

	constructor({ cause, code, details, message, requestId, statusCode }: AppErrorParams) {
		super(message, { cause });
		this.name = "AppError";
		this.code = code;
		this.details = details;
		this.requestId = requestId;
		this.statusCode = statusCode;
	}
}
