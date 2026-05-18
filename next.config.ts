import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	poweredByHeader: false,
	reactCompiler: true,
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["turbopack-inline-svg-loader"],
				condition: {
					content: /^[\s\S]{0,4000}$/, // Inline SVGs smaller than ~4Kb
				},
				as: "*.js",
			},
		},
	},
};

const withNextIntl = createNextIntlPlugin("./src/services/i18n/request.ts");

const baseConfig = withNextIntl(nextConfig);

const sentryBuildOptions = {
	// https://www.npmjs.com/package/@sentry/webpack-plugin#options
	org: "dev-experts",
	project: "cash-lift",
	silent: !process.env.CI,
	widenClientFileUpload: true,
	treeshake: {
		removeDebugLogging: true,
	},
};

// `withSentryConfig` hooks webpack/Turbopack with loaders, debug IDs, and release
// tooling. That cost is appropriate for production builds but routinely blows dev
// memory/CPU (multiple compilations + source-map-related work per rebuild).
// Runtime reporting still uses instrumentation.ts, instrumentation-client.ts, and
// sentry.*.config.ts when you run `next dev`.
export default process.env.NODE_ENV === "production" ? withSentryConfig(baseConfig, sentryBuildOptions) : baseConfig;
