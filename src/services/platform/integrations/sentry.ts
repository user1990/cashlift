import * as Sentry from "@sentry/nextjs";

type CaptureAppExceptionParams = {
	error: unknown;
	extra?: Record<string, unknown>;
	fingerprint?: string[];
	level?: "debug" | "error" | "fatal" | "info" | "log" | "warning";
	tags?: Record<string, string>;
};

type CaptureAppMessageParams = {
	extra?: Record<string, unknown>;
	fingerprint?: string[];
	level?: "debug" | "error" | "fatal" | "info" | "log" | "warning";
	message: string;
	tags?: Record<string, string>;
};

export const captureAppException = ({ error, extra, fingerprint, level = "error", tags }: CaptureAppExceptionParams) =>
	Sentry.captureException(error, {
		extra,
		fingerprint,
		level,
		tags,
	});

export const captureAppMessage = ({ extra, fingerprint, level = "error", message, tags }: CaptureAppMessageParams) =>
	Sentry.captureMessage(message, {
		extra,
		fingerprint,
		level,
		tags,
	});
