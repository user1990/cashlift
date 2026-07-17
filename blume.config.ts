import { defineConfig } from "blume";

export default defineConfig({
	title: "CashLift Docs",
	description: "Documentation for CashLift, the cash decision command center for service firms.",
	lastModified: true,
	deployment: {
		output: "static",
		site: "https://cashlift-docs.vercel.app",
	},
});
