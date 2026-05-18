import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { domAnimation, LazyMotion as LazyMotionProvider } from "motion/react";
import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/services/clerk/provider";
import messages from "@/services/i18n/messages/en.json";
import { QueryProvider } from "@/services/query/provider";
import { ScrollToTopButton } from "./ScrollToTopButton";
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

export default async function RootLayout({ children }: RootLayoutProps) {
	await connection();

	return (
		<html lang="en" className="h-full">
			<body className="grid min-h-full grid-cols-[1fr_0px] antialiased" id="top">
				<a
					href="#main-content"
					className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md border border-primary bg-shell-elevated px-3 py-2 text-m font-medium text-shell-foreground shadow-shell outline-none transition-transform duration-150 focus-visible:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-primary/20"
				>
					Skip to content
				</a>

				<NextIntlClientProvider locale="en" messages={messages}>
					<AuthProvider>
						<QueryProvider>
							<LazyMotionProvider features={domAnimation} strict>
								{children}
							</LazyMotionProvider>

							<ScrollToTopButton />

							<SpeedInsights />

							<Analytics />
						</QueryProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
