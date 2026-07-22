import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const chromePath = process.env.LIGHTHOUSE_CHROME_PATH;
const maxMedianLcp = Number(process.env.LCP_MAX_MEDIAN_MS);
const runCount = Number(process.env.LCP_RUNS ?? 5);
const summaryPath = process.env.LCP_SUMMARY_PATH;
const url = process.env.LCP_URL ?? "https://cashlift.vercel.app/";

if (!Number.isInteger(runCount) || runCount < 5) {
	throw new Error("LCP_RUNS must be an integer of at least 5.");
}

const reportDirectory = await mkdtemp(join(tmpdir(), "cashlift-lcp-"));

try {
	const reports = [];

	for (let index = 0; index < runCount; index += 1) {
		const reportPath = join(reportDirectory, `run-${index + 1}.json`);
		const args = [
			"--yes",
			"lighthouse@12.8.2",
			url,
			"--only-categories=performance",
			"--form-factor=mobile",
			"--output=json",
			`--output-path=${reportPath}`,
			"--quiet",
		];

		if (chromePath) {
			args.push(`--chrome-path=${chromePath}`);
		}

		await execFileAsync("npx", args);
		reports.push(JSON.parse(await readFile(reportPath, "utf8")));
	}

	const lcpValues = reports
		.map((report) => report.audits["largest-contentful-paint"].numericValue)
		.sort((a, b) => a - b);
	const medianLcp = lcpValues[Math.floor(lcpValues.length / 2)];

	console.table(
		reports.map((report, index) => ({
			lcpMs: Math.round(report.audits["largest-contentful-paint"].numericValue),
			run: index + 1,
		})),
	);
	console.log(`Median mobile LCP: ${Math.round(medianLcp)} ms`);

	if (summaryPath) {
		await writeFile(summaryPath, JSON.stringify({ medianLcp, runs: lcpValues, url }, null, 2));
	}

	if (Number.isFinite(maxMedianLcp) && medianLcp > maxMedianLcp) {
		throw new Error(`Median LCP ${Math.round(medianLcp)} ms exceeds LCP_MAX_MEDIAN_MS=${maxMedianLcp}.`);
	}
} finally {
	await rm(reportDirectory, { force: true, recursive: true });
}
