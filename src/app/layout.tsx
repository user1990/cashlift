import type { Metadata, Viewport } from "next";
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

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" className="h-full" data-scroll-behavior="smooth">
			<body className="grid min-h-full grid-cols-[1fr_0px] antialiased" id="top">
				<a
					href="#main-content"
					className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md border border-primary bg-shell-elevated px-3 py-2 text-m font-medium text-shell-foreground shadow-shell outline-none transition-transform duration-150 focus-visible:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-primary/20"
				>
					Skip to content
				</a>

				{children}

				<ClientTelemetry />
			</body>
		</html>
	);
}
