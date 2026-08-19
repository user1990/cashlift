import type { Reporter, TestCase } from "vitest/node";

const MAX_DURATION_MS = Number(process.env.TEST_MAX_DURATION_MS ?? 200);

type SlowTest = {
	duration: number;
	file: string;
	name: string;
};

export default class SlowTestReporter implements Reporter {
	private slowTests: SlowTest[] = [];

	onTestCaseResult(testCase: TestCase) {
		const duration = testCase.diagnostic()?.duration;

		if (duration === undefined || duration <= MAX_DURATION_MS) {
			return;
		}

		this.slowTests.push({
			duration,
			file: testCase.module.relativeModuleId,
			name: testCase.fullName,
		});
	}

	onTestRunEnd() {
		if (this.slowTests.length === 0) {
			return;
		}

		this.slowTests.sort((left, right) => right.duration - left.duration);

		console.error(`Found ${this.slowTests.length} test(s) slower than ${MAX_DURATION_MS}ms:`);

		for (const test of this.slowTests) {
			console.error(`  ${Math.round(test.duration)}ms  ${test.file}  > ${test.name}`);
		}

		process.exit(1);
	}
}
