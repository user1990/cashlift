import { defineConfig } from "blume";

export default defineConfig({
	title: "CashLift Docs",
	description: "Documentation for CashLift, the cash decision command center for service firms.",
	lastModified: true,
	react: {
		compiler: false,
	},
	integrations: [
		{
			hooks: {
				"astro:config:setup": ({ updateConfig }) => {
					updateConfig({
						vite: {
							build: {
								// Mermaid's lazy-loaded langium parser is ~650 kB minified.
								chunkSizeWarningLimit: 700,
							},
						},
					});
				},
			},
			name: "cashlift-docs-build",
		},
	],
	deployment: {
		output: "static",
		site: "https://cashlift-docs.vercel.app",
	},
});
