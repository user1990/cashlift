import { globSync, readFileSync, realpathSync } from "node:fs";
import { relative, resolve } from "node:path";
import { chdir } from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
chdir(ROOT);

const SCAN_GLOBS = [".agents/**/*.{md,yaml,yml}", "docs/contributing/architecture/primitives.yaml"];

const PATH_PATTERN =
	/`((?:\.agents|src|docs|supabase|public|e2e|scripts)\/[^`\s]+|(?:package\.json|lefthook\.yml|AGENTS\.md|DESIGN\.md|PRODUCT\.md|CONTEXT\.md))`/g;

const collectFiles = () => {
	const files = SCAN_GLOBS.flatMap((pattern) => globSync(pattern));

	return [...new Set(files)];
};

const isGlobPath = (value) => value.includes("*") || value.includes("{") || value.includes("(");

const resolveCandidatePath = (candidate) => {
	const absolute = resolve(ROOT, candidate);
	const normalizedRoot = `${ROOT}/`;

	if (!absolute.startsWith(normalizedRoot) && absolute !== ROOT) {
		return null;
	}

	return absolute;
};

const failures = [];

for (const file of collectFiles()) {
	// nosemgrep: javascript.lang.security.audit.detect-non-literal-fs-filename.detect-non-literal-fs-filename
	const source = readFileSync(file, "utf8");

	for (const match of source.matchAll(PATH_PATTERN)) {
		const candidate = match[1];

		if (isGlobPath(candidate)) {
			continue;
		}

		const absolute = resolveCandidatePath(candidate);

		if (!absolute) {
			failures.push(`${relative(ROOT, file)}: path escapes repo root \`${candidate}\``);
			continue;
		}

		try {
			// nosemgrep: javascript.lang.security.audit.detect-non-literal-fs-filename.detect-non-literal-fs-filename
			realpathSync(absolute);
		} catch {
			failures.push(`${relative(ROOT, file)}: missing path \`${candidate}\``);
		}
	}
}

if (failures.length > 0) {
	console.error("Agent reference check failed:");
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}
	process.exitCode = 1;
} else {
	console.log("Agent reference check passed.");
}
