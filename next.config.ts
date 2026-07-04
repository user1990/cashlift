import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const HOME_CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
	"style-src 'self' 'unsafe-inline'",
	"style-src-attr 'none'",
	"img-src 'self' blob: data: https:",
	"font-src 'self'",
	"connect-src 'self' https://vercel-insights.com https://*.vercel-insights.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io",
	"frame-src 'self'",
	"worker-src 'self' blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
	allowedDevOrigins: ["127.0.0.1"],
	cacheComponents: true,
	headers: async () => [
		{
			source: "/",
			headers: [
				{
					key: "Content-Security-Policy",
					value: HOME_CONTENT_SECURITY_POLICY,
				},
				{
					key: "Referrer-Policy",
					value: "strict-origin-when-cross-origin",
				},
				{
					key: "Permissions-Policy",
					value: "camera=(), microphone=(), geolocation=()",
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{
					key: "X-Frame-Options",
					value: "DENY",
				},
				{
					key: "X-Permitted-Cross-Domain-Policies",
					value: "none",
				},
				...(process.env.NODE_ENV === "production"
					? [
							{
								key: "Strict-Transport-Security",
								value: "max-age=63072000; includeSubDomains; preload",
							},
						]
					: []),
			],
		},
	],
	partialPrefetching: true,
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
	authToken: process.env.SENTRY_AUTH_TOKEN,
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
