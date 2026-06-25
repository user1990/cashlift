import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const failures = [];

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter(Boolean);

const textExtensions = new Set([".css", ".env", ".js", ".json", ".md", ".mjs", ".sql", ".ts", ".tsx", ".yaml", ".yml"]);

const productionPolicyFiles = trackedFiles.filter(
	(file) => file.startsWith("supabase/") && file.endsWith(".sql") && !file.includes("dev-"),
);

for (const file of productionPolicyFiles) {
	const source = readFileSync(file, "utf8");

	if (/\bto\s+anon\b/i.test(source)) {
		failures.push(`${file} grants access to anon.`);
	}

	if (/Allow demo/i.test(source)) {
		failures.push(`${file} contains demo Supabase policies.`);
	}
}

const secretPatterns = [
	[/\bsk_(live|test)_[A-Za-z0-9_-]{20,}\b/, "Clerk secret key"],
	[/\bsntrys_[A-Za-z0-9_-]{20,}\b/, "Sentry auth token"],
	[/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/, "JWT-like secret"],
	[/\bsupabase_service_role_[A-Za-z0-9_-]{12,}\b/i, "Supabase service role token"],
];

const ignoredFiles = new Set(["pnpm-lock.yaml"]);

for (const file of trackedFiles) {
	if (ignoredFiles.has(file) || !textExtensions.has(extname(file))) {
		continue;
	}

	const source = readFileSync(file, "utf8");

	if (file.endsWith(".env") || file.includes(".env.")) {
		failures.push(`${file} is tracked; env files must stay out of git.`);
	}

	if (file.endsWith(".map")) {
		failures.push(`${file} is a tracked source map.`);
	}

	for (const [pattern, label] of secretPatterns) {
		if (pattern.test(source)) {
			failures.push(`${file} appears to contain a ${label}.`);
		}
	}
}

if (failures.length > 0) {
	console.error("Security check failed:");
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}
	process.exit(1);
}

console.log("Security check passed.");
