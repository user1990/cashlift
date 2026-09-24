import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const SCAN_ROOTS = [join(ROOT, ".agents"), join(ROOT, "docs/contributing/architecture/primitives.yaml")];

const PATH_PATTERN = /`((?:src|docs|supabase|public|e2e|scripts)\/[^`\s]+)`/g;

const listMarkdownFiles = (dir) => {
	const entries = [];

	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		const stat = statSync(path);

		if (stat.isDirectory()) {
			entries.push(...listMarkdownFiles(path));
			continue;
		}

		if (name.endsWith(".md") || name.endsWith(".yaml") || name.endsWith(".yml")) {
			entries.push(path);
		}
	}

	return entries;
};

const collectFiles = () => {
	const files = [];

	for (const root of SCAN_ROOTS) {
		try {
			const stat = statSync(root);
			if (stat.isDirectory()) {
				files.push(...listMarkdownFiles(root));
			} else {
				files.push(root);
			}
		} catch {
			// skip missing roots
		}
	}

	return [...new Set(files)];
};

const isGlobPath = (value) => value.includes("*") || value.includes("{") || value.includes("(");

const failures = [];

for (const file of collectFiles()) {
	const source = readFileSync(file, "utf8");

	for (const match of source.matchAll(PATH_PATTERN)) {
		const candidate = match[1];

		if (isGlobPath(candidate)) {
			continue;
		}

		const absolute = join(ROOT, candidate);

		try {
			statSync(absolute);
		} catch {
			failures.push(`${file.replace(`${ROOT}/`, "")}: missing path \`${candidate}\``);
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
