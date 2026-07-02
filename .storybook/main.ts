import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	addons: ["@storybook/addon-docs", "@storybook/addon-mcp"],
	framework: {
		name: "@storybook/nextjs-vite",
		options: {},
	},
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
};

export default config;
