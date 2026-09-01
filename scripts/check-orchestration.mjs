import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const json = args.includes("--json");
const baseIndex = args.indexOf("--base");
const requestedBase = baseIndex === -1 ? undefined : args[baseIndex + 1];

if (baseIndex !== -1 && !requestedBase) {
	console.error("Usage: node scripts/check-orchestration.mjs [--json] [--base REF]");
	process.exit(2);
}

function git(command, fallback = "") {
	try {
		return execFileSync("git", command, { encoding: "utf8" }).trim();
	} catch {
		return fallback;
	}
}

function refExists(ref) {
	return Boolean(git(["rev-parse", "--verify", "--quiet", ref]));
}

function changedFiles(command) {
	return git(command)
		.split("\n")
		.map((file) => file.trim())
		.filter(Boolean);
}

const branch = git(["branch", "--show-current"]) || "(detached HEAD)";
const baseCandidates = [requestedBase, "origin/main", "main", "HEAD^"].filter(Boolean);
const base = baseCandidates.find(refExists) ?? null;
const branchFiles = base ? changedFiles(["diff", "--name-only", `${base}...HEAD`]) : [];
const worktreeFiles = changedFiles(["diff", "--name-only", "HEAD"]);
const untrackedFiles = changedFiles(["ls-files", "--others", "--exclude-standard"]);

const generatedPrefixes = [
	".astro/",
	".next/",
	".pnpm-store/",
	"coverage/",
	"node_modules/",
	"playwright-report/",
	"test-results/",
	"storybook-static/",
];

function isMeaningful(file) {
	return !generatedPrefixes.some((prefix) => file.startsWith(prefix));
}

const files = [...new Set([...branchFiles, ...worktreeFiles, ...untrackedFiles])].filter(isMeaningful).sort();

function areaFor(file) {
	if (file.startsWith("src/app/")) return "src/app";
	if (file.startsWith("src/modules/")) return `src/modules/${file.split("/")[2]}`;
	if (file.startsWith("src/ui/")) return "src/ui";
	if (file.startsWith("src/services/")) return "src/services";
	if (file.startsWith("src/utilities/")) return "src/utilities";
	if (file.startsWith("e2e/") || file.includes(".test.") || file.includes(".spec.")) return "tests";
	if (file.startsWith("docs/")) return "docs";
	if (file.startsWith(".agents/") || file === "AGENTS.md") return "agent-workflow";
	if (file.startsWith("scripts/")) return "scripts";
	return "other";
}

const areas = [...new Set(files.map(areaFor))].sort();
const sharedSurfaces = files.filter(
	(file) =>
		file === "package.json" ||
		file === "pnpm-lock.yaml" ||
		file === "tsconfig.json" ||
		file === "src/app/globals.css" ||
		file === "src/app/layout.tsx" ||
		file === "src/proxy.ts" ||
		file.startsWith("src/ui/") ||
		file.startsWith(".agents/") ||
		file === "AGENTS.md",
);

const branchLooksLikeFeatureWork = branch !== "main" && branch !== "master" && branch !== "(detached HEAD)";
const broad =
	files.length >= 8 ||
	(files.length >= 5 && areas.length >= 3) ||
	(branchLooksLikeFeatureWork && files.length >= 6 && areas.length >= 2);
const recommendation = broad
	? sharedSurfaces.length > 0
		? "candidate-with-shared-surfaces"
		: "candidate"
	: "single-agent-likely";

const reasons = [];
if (files.length >= 8) reasons.push(`${files.length} meaningful changed files`);
if (areas.length >= 2) reasons.push(`${areas.length} changed areas: ${areas.join(", ")}`);
if (branchLooksLikeFeatureWork) reasons.push(`feature branch ${branch}; this is not proof of an existing PR`);
if (sharedSurfaces.length > 0)
	reasons.push(
		`shared surfaces need one owner: ${sharedSurfaces.slice(0, 5).join(", ")}${sharedSurfaces.length > 5 ? ", …" : ""}`,
	);
if (reasons.length === 0) reasons.push("the current change surface is small or concentrated");

const result = {
	recommendation,
	base,
	branch,
	meaningfulFileCount: files.length,
	areas,
	sharedSurfaces,
	files,
	reasons,
	limitations: [
		"This is an advisory heuristic, not proof that parallel work is faster.",
		"It cannot determine semantic dependencies, file conflicts, human intent, or whether a GitHub PR exists.",
	],
};

if (json) {
	console.log(JSON.stringify(result, null, 2));
} else {
	console.log(`Orchestration check: ${recommendation}`);
	console.log(`Scope: ${files.length} meaningful files across ${areas.length} areas${base ? `; base ${base}` : ""}.`);
	console.log(`Reasons: ${reasons.join("; ")}.`);
	console.log(
		recommendation === "single-agent-likely"
			? "Human note: one implementer is probably simpler."
			: "Human note: consider orchestrate; keep shared contracts with one integration owner.",
	);
	console.log("Limitations: heuristic only; it does not prove PR existence, dependency independence, or speedup.");
}
