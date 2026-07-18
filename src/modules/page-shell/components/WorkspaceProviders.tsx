"use client";

import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode, Suspense } from "react";
import { AuthProvider } from "@/services/clerk/provider";
import messages from "@/services/i18n/messages/en.json";
import { QueryProvider } from "@/services/query/provider";
import { Toaster } from "@/ui/components/Toaster";

type WorkspaceProvidersProps = {
	children: ReactNode;
	authEnabled?: boolean;
	authFallback?: ReactNode;
};

export const WorkspaceProviders = ({ authEnabled = true, authFallback, children }: WorkspaceProvidersProps) => {
	const content = authEnabled ? (
		<Suspense fallback={authFallback}>
			<AuthProvider>{children}</AuthProvider>
		</Suspense>
	) : (
		children
	);

	return (
		<NuqsAdapter>
			<NextIntlClientProvider locale="en" messages={messages}>
				<QueryProvider>{content}</QueryProvider>

				<Toaster />
			</NextIntlClientProvider>
		</NuqsAdapter>
	);
};
