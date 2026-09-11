import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const isProhibitedTrackedFilename = (file) =>
	file.endsWith(".env") || file.includes(".env.") || file.endsWith(".map");

const runSecurityCheck = () => {
	const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
		.split("\n")
		.filter((file) => file && existsSync(file));

	const failures = [...getProductionPolicyFailures(trackedFiles), ...trackedFiles.flatMap(getTrackedFileFailures)];

	if (failures.length > 0) {
		console.error("Security check failed:");
		for (const failure of failures) {
			console.error(`- ${failure}`);
		}
		process.exitCode = 1;
		return;
	}

	console.log("Security check passed.");
};

const getProductionPolicyFailures = (trackedFiles) => {
	const productionPolicyFiles = trackedFiles.filter(
		(file) => file.startsWith("supabase/") && file.endsWith(".sql") && !file.includes("dev-"),
	);

	return productionPolicyFiles.flatMap((file) => {
		const source = readFileSync(file, "utf8");
		const failures = [];

		if (/\bto\s+anon\b/i.test(source)) {
			failures.push(`${file} grants access to anon.`);
		}

		if (/Allow demo/i.test(source)) {
			failures.push(`${file} contains demo Supabase policies.`);
		}

		return failures;
	});
};

const getTrackedFileFailures = (file) => {
	const failures = getProhibitedFilenameFailures(file);
	const textExtensions = new Set([
		".css",
		".env",
		".js",
		".json",
		".md",
		".mjs",
		".sql",
		".ts",
		".tsx",
		".yaml",
		".yml",
	]);

	if (file === "pnpm-lock.yaml" || !textExtensions.has(extname(file))) {
		return failures;
	}

	const source = readFileSync(file, "utf8");

	for (const [pattern, label] of getSecretPatterns()) {
		if (pattern.test(source)) {
			failures.push(`${file} appears to contain a ${label}.`);
		}
	}

	return failures;
};

const getProhibitedFilenameFailures = (file) => {
	if (!isProhibitedTrackedFilename(file)) {
		return [];
	}

	return [
		file.endsWith(".map") ? `${file} is a tracked source map.` : `${file} is tracked; env files must stay out of git.`,
	];
};

const getSecretPatterns = () => [
	[/\bsk_(live|test)_[A-Za-z0-9_-]{20,}\b/, "Clerk secret key"],
	[/\bsntrys_[A-Za-z0-9_-]{20,}\b/, "Sentry auth token"],
	[/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/, "JWT-like secret"],
	[/\bsupabase_service_role_[A-Za-z0-9_-]{12,}\b/i, "Supabase service role token"],
];

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
	runSecurityCheck();
}
