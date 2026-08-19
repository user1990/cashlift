import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX_DURATION_MS = Number(process.env.TEST_MAX_DURATION_MS ?? 200);
const resultsPath = resolve(process.cwd(), process.argv[2] ?? ".vitest-results.json");

if (!existsSync(resultsPath)) {
	console.error(`Missing Vitest JSON report at ${resultsPath}. Run vitest with a JSON reporter first.`);
	process.exit(1);
}

const report = JSON.parse(readFileSync(resultsPath, "utf8"));
const slowTests = [];

for (const fileResult of report.testResults ?? []) {
	for (const testResult of fileResult.assertionResults ?? []) {
		const duration = testResult.duration ?? 0;

		if (duration > MAX_DURATION_MS) {
			slowTests.push({
				duration,
				file: fileResult.name.replace(`${process.cwd()}/`, ""),
				name: testResult.fullName ?? testResult.title,
			});
		}
	}
}

slowTests.sort((left, right) => right.duration - left.duration);

if (slowTests.length > 0) {
	console.error(`Found ${slowTests.length} test(s) slower than ${MAX_DURATION_MS}ms:`);

	for (const test of slowTests) {
		console.error(`  ${Math.round(test.duration)}ms  ${test.file}  > ${test.name}`);
	}

	process.exit(1);
}

const durations = (report.testResults ?? []).flatMap((fileResult) =>
	(fileResult.assertionResults ?? []).map((testResult) => testResult.duration ?? 0),
);
const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
const slowest = durations.length > 0 ? Math.max(...durations) : 0;

console.log(
	`Test duration check passed: ${durations.length} tests, ${Math.round(totalDuration)}ms total, slowest ${Math.round(slowest)}ms (limit ${MAX_DURATION_MS}ms).`,
);
