import type { Metadata, Viewport } from "next";
import { MAIN_CONTENT_ID } from "@/modules/page-shell/components/MainContent";
import { Toaster } from "@/ui/components/Toaster";
import { ClientTelemetry } from "./ClientTelemetry";
import "./globals.css";

export const metadata: Metadata = {
	title: "CashLift",
	description: "A cash-aware spend decision command center for service firms.",
};

export const viewport: Viewport = {
	themeColor: "#040a12",
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

const TELEMETRY_ENABLED = Boolean(process.env.VERCEL_ENV);

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className="h-full" data-scroll-behavior="smooth">
			<body className="grid min-h-full grid-cols-[1fr_0px] antialiased" id="top">
				<a
					href={`#${MAIN_CONTENT_ID}`}
					className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md border border-primary bg-shell-elevated px-3 py-2 text-m font-medium text-shell-foreground shadow-shell outline-none transition-transform duration-150 focus-visible:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-primary/20"
				>
					Skip to content
				</a>

				{children}

				<Toaster />

				{TELEMETRY_ENABLED ? <ClientTelemetry /> : null}
			</body>
		</html>
	);
}
