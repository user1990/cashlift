import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_ROOTS = ["src/modules", "src/ui", "src/services"];
const MODULE_IMPORT_PATTERN = /from\s+["']@\/app\//g;
export const runModuleArchitectureCheck = () => {
	const failures = getModuleAppImportFailures();

	if (failures.length > 0) {
		console.error("Module architecture check failed:");
		for (const failure of failures) {
			console.error(`- ${failure}`);
		}
		process.exitCode = 1;
		return;
	}

	console.log("Module architecture check passed.");
};

const getModuleAppImportFailures = () => {
	const failures = [];

	for (const file of listSourceFiles(SOURCE_ROOTS)) {
		const source = readFileSync(file, "utf8");

		for (const match of source.matchAll(MODULE_IMPORT_PATTERN)) {
			const lineNumber = source.slice(0, match.index).split("\n").length;
			failures.push(`${file}:${lineNumber} imports from @/app (move shared assets to src/ui or public).`);
		}
	}

	return failures;
};

const listSourceFiles = (roots) => {
	const files = [];

	for (const root of roots) {
		walk(root, files);
	}

	return files;
};

const walk = (directory, files) => {
	for (const entry of readdirSync(directory)) {
		const path = join(directory, entry);
		const stats = statSync(path);

		if (stats.isDirectory()) {
			walk(path, files);
			continue;
		}

		if (/\.(ts|tsx)$/.test(path)) {
			files.push(path);
		}
	}
};

if (process.argv[1] && fileURLToPath(import.meta.url) === join(process.argv[1])) {
	runModuleArchitectureCheck();
}
