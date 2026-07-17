import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ServerAuthProvider } from "@/services/clerk/serverProvider";
import { AuthGlassLoading } from "../../_components/AuthGlassLoading";
import { AuthGlassShell } from "../../_components/AuthGlassShell";

export const metadata: Metadata = {
	title: "Login — CashLift",
	description: "Log in to a CashLift company workspace.",
};

export const instant = false;

const SIGN_IN_APPEARANCE = {
	options: { logoPlacement: "none" },
	variables: {
		borderRadius: "0.375rem",
		colorBackground: "transparent",
		colorBorder: "var(--border-strong)",
		colorForeground: "var(--panel-foreground)",
		colorInput: "color-mix(in srgb, var(--shell-elevated) 50%, transparent)",
		colorInputForeground: "var(--panel-foreground)",
		colorMuted: "color-mix(in srgb, var(--panel-muted) 50%, transparent)",
		colorMutedForeground: "var(--muted-foreground)",
		colorPrimary: "var(--primary)",
		colorPrimaryForeground: "var(--primary-foreground)",
		colorRing: "var(--primary)",
	},
	elements: {
		card: { background: "transparent", border: 0, boxShadow: "none", padding: 0 },
		cardBox: { boxShadow: "none", width: "100%" },
		footer: { display: "none" },
		formFieldInput: {
			border: "1px solid transparent !important",
			boxShadow: "inset 0 0 0 1px var(--border-strong) !important",
			boxSizing: "border-box",
			"&:focus": {
				borderColor: "transparent !important",
				boxShadow: "inset 0 0 0 1px var(--primary) !important",
				outline: "none !important",
			},
			"&:focus-visible": {
				borderColor: "transparent !important",
				boxShadow: "inset 0 0 0 1px var(--primary) !important",
				outline: "none !important",
			},
		},
		formButtonPrimary: { borderRadius: "0.75rem !important", overflow: "hidden" },
		rootBox: { width: "100%" },
		socialButtonsBlockButton: {
			background: "color-mix(in srgb, var(--shell-elevated) 50%, transparent)",
			borderColor: "var(--shell-border)",
		},
	},
} as const;

export default async function Login() {
	await connection();

	return (
		<AuthGlassShell signUpHref="/signup">
			<ServerAuthProvider>
				<ClerkLoading>
					<AuthGlassLoading />
				</ClerkLoading>

				<ClerkLoaded>
					<SignIn appearance={SIGN_IN_APPEARANCE} fallbackRedirectUrl="/dashboard" signUpUrl="/signup" />
				</ClerkLoaded>
			</ServerAuthProvider>
		</AuthGlassShell>
	);
}
