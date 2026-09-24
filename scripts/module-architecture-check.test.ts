import { describe, expect, it } from "vitest";
import { runModuleArchitectureCheck } from "./module-architecture-check.mjs";

describe("module architecture check", () => {
	it("passes on the current repository tree", () => {
		const previousExitCode = process.exitCode;
		process.exitCode = 0;

		runModuleArchitectureCheck();

		expect(process.exitCode ?? 0).toBe(0);
		process.exitCode = previousExitCode;
	});
});
