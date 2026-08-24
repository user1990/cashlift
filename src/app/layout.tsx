import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { MAIN_CONTENT_ID } from "@/modules/page-shell/components/MainContent";
import { ClientTelemetry } from "./ClientTelemetry";
import "./globals.css";

type RootLayoutProps = {
	children: React.ReactNode;
};

export const metadata: Metadata = {
	title: "CashLift",
	description: "A cash-aware spend decision command center for service firms.",
	icons: {
		apple: "/brand/cashlift-icon.svg",
		icon: "/brand/cashlift-icon.svg",
	},
};

export const viewport: Viewport = {
	themeColor: "#040a12",
};

export const instant = false;

export default async function RootLayout({ children }: RootLayoutProps) {
	await connection();

	return (
		<html lang="en" className="h-full" data-scroll-behavior="smooth">
			<body className="grid min-h-full grid-cols-[1fr_0px] antialiased" id="top">
				<a
					href={`#${MAIN_CONTENT_ID}`}
					className="fixed top-4 left-4 z-50 -translate-y-24 rounded-md border border-primary bg-shell-elevated px-3 py-2 font-medium text-m text-shell-foreground shadow-shell outline-none transition-transform duration-150 focus-visible:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-primary/20"
				>
					Skip to content
				</a>

				{children}

				{!!process.env.VERCEL_ENV && <ClientTelemetry />}
			</body>
		</html>
	);
}
