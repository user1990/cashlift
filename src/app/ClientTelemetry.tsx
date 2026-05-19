"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

export const ClientTelemetry = () => {
	const analyticsReady = useIdleReady();

	return (
		<>
			<SpeedInsights />

			{analyticsReady ? <Analytics /> : null}
		</>
	);
};

function useIdleReady() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const markReady = () => setReady(true);

		if ("requestIdleCallback" in window) {
			const idleId = window.requestIdleCallback(markReady, { timeout: 2_000 });

			return () => window.cancelIdleCallback(idleId);
		}

		const timeoutId = globalThis.setTimeout(markReady, 1_000);

		return () => globalThis.clearTimeout(timeoutId);
	}, []);

	return ready;
}
