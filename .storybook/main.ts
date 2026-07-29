import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	addons: ["@storybook/addon-docs", "@storybook/addon-mcp"],
	framework: {
		name: "@storybook/nextjs-vite",
		options: {},
	},
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
	viteFinal: async (viteConfig) => ({
		...viteConfig,
		build: {
			...viteConfig.build,
			chunkSizeWarningLimit: 1_400, // The Storybook preview runtime is 1.35 MB before app stories load.
		},
	}),
};

export default config;
