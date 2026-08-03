import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(rootDir, "src"),
		},
	},
	test: {
		coverage: {
			exclude: ["src/**/*.stories.{ts,tsx}", "src/test/**"],
			include: ["src/**/*.{ts,tsx}"],
			provider: "v8",
			reporter: ["text", "json-summary", "html"],
		},
		environment: "node",
		exclude: ["**/e2e/**", "**/node_modules/**"],
		reporters: process.stdout.isTTY ? ["tree"] : ["default"],
		setupFiles: ["./src/test/setup.ts"],
	},
});
