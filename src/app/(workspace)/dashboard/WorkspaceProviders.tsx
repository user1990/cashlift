"use client";

import { NextIntlClientProvider } from "next-intl";
import { type ReactNode, Suspense } from "react";
import { AuthProvider } from "@/services/clerk/provider";
import messages from "@/services/i18n/messages/en.json";

type WorkspaceProvidersProps = {
	authEnabled?: boolean;
	authFallback?: ReactNode;
	children: ReactNode;
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
		<NextIntlClientProvider locale="en" messages={messages}>
			{content}
		</NextIntlClientProvider>
	);
};
