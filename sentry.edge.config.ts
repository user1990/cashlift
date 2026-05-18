// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

const PRODUCTION = process.env.NODE_ENV === "production";

Sentry.init({
	dsn: "https://15e710ef0ea8763f067c00e5b64daba1@o514352.ingest.us.sentry.io/4511378243977216",
	tracesSampleRate: PRODUCTION ? 0.05 : 1,
	enableLogs: !PRODUCTION,
	sendDefaultPii: false,
});
