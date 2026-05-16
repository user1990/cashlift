import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	/* config options here */
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
	// For all available options, see:
	// https://www.npmjs.com/package/@sentry/webpack-plugin#options

	org: "dev-experts",

	project: "cash-lift",

	// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	webpack: {
		// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
		// See the following for more information:
		// https://docs.sentry.io/product/crons/
		// https://vercel.com/docs/cron-jobs
		automaticVercelMonitors: true,

		// Tree-shaking options for reducing bundle size
		treeshake: {
			// Automatically tree-shake Sentry logger statements to reduce bundle size
			removeDebugLogging: true,
		},
	},
};

// `withSentryConfig` hooks webpack/Turbopack with loaders, debug IDs, and release
// tooling. That cost is appropriate for production builds but routinely blows dev
// memory/CPU (multiple compilations + source-map-related work per rebuild).
// Runtime reporting still uses instrumentation.ts, instrumentation-client.ts, and
// sentry.*.config.ts when you run `next dev`.
export default process.env.NODE_ENV === "production" ? withSentryConfig(baseConfig, sentryBuildOptions) : baseConfig;
