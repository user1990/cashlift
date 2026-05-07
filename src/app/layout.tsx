import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AppAuthProvider } from "@/providers/app-auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "Cashlift",
	description: "A cashflow command center for better daily money decisions.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body className="flex min-h-full flex-col antialiased">
				<NextIntlClientProvider locale="en" messages={messages}>
					<AppAuthProvider>
						<QueryProvider>{children}</QueryProvider>
					</AppAuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
