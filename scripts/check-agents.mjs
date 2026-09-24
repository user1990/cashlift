import { globSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { chdir } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
chdir(ROOT);

const SCAN_GLOBS = [".agents/**/*.{md,yaml,yml}", "docs/contributing/architecture/primitives.yaml"];

const INDEX_GLOBS = [
	".agents/**",
	"src/**",
	"docs/**",
	"supabase/**",
	"public/**",
	"e2e/**",
	"scripts/**",
	"package.json",
	"lefthook.yml",
	"AGENTS.md",
	"DESIGN.md",
	"PRODUCT.md",
	"CONTEXT.md",
];

const PATH_PATTERN =
	/`((?:\.agents|src|docs|supabase|public|e2e|scripts)\/[^`\s]+|(?:package\.json|lefthook\.yml|AGENTS\.md|DESIGN\.md|PRODUCT\.md|CONTEXT\.md))`/g;

const collectFiles = () => {
	const files = SCAN_GLOBS.flatMap((pattern) => globSync(pattern));

	return [...new Set(files)];
};

const buildKnownRepoPaths = () => {
	const paths = new Set();

	for (const pattern of INDEX_GLOBS) {
		for (const entry of globSync(pattern, { nodir: false })) {
			paths.add(entry);
		}
	}

	return paths;
};

const knownRepoPaths = buildKnownRepoPaths();

const isGlobPath = (value) => value.includes("*") || value.includes("{") || value.includes("(");

const resolveCandidatePath = (candidate) => {
	if (candidate.includes("..")) {
		return null;
	}

	const absolute = resolve(ROOT, candidate);
	const normalizedRoot = `${ROOT}/`;

	if (!absolute.startsWith(normalizedRoot) && absolute !== ROOT) {
		return null;
	}

	return absolute;
};

const repoPathExists = (candidate) => {
	const normalized = candidate.replace(/\/$/, "");

	if (knownRepoPaths.has(normalized) || knownRepoPaths.has(candidate)) {
		return true;
	}

	const prefix = `${normalized}/`;

	for (const path of knownRepoPaths) {
		if (path === normalized || path.startsWith(prefix)) {
			return true;
		}
	}

	return false;
};

const readRepoUtf8 = async (relativePath) => {
	if (relativePath.includes("..")) {
		throw new Error("invalid path");
	}

	const absolute = resolve(ROOT, relativePath);
	const normalizedRoot = `${ROOT}/`;

	if (!absolute.startsWith(normalizedRoot) && absolute !== ROOT) {
		throw new Error("path escapes repo root");
	}

	return readFile(pathToFileURL(absolute), "utf8");
};

const failures = [];

for (const file of collectFiles()) {
	const source = await readRepoUtf8(file);

	for (const match of source.matchAll(PATH_PATTERN)) {
		const candidate = match[1];

		if (isGlobPath(candidate)) {
			continue;
		}

		if (!resolveCandidatePath(candidate)) {
			failures.push(`${relative(ROOT, file)}: path escapes repo root \`${candidate}\``);
			continue;
		}

		if (!repoPathExists(candidate)) {
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
