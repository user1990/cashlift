import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { getWorkspaceRuntimeConfig, workspaceDemoEnabled } from "@/services/env/app";

type AppLayoutProps = {
	children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
	const config = getWorkspaceRuntimeConfig();

	if (!config.configured) {
		return <WorkspaceUnavailable message={config.message} />;
	}

	if (workspaceDemoEnabled()) {
		return children;
	}

	return (
		<Show when="signed-in" fallback={<SignedOutFallback />}>
			{children}
		</Show>
	);
}

const SignedOutFallback = () => (
	<main id="main-content" className="flex min-h-screen items-center justify-center bg-shell px-4">
		<div className="max-w-md rounded-lg border border-border bg-panel p-6 text-center shadow-panel">
			<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

			<h1 className="mt-2 text-4xl+ tracking-normal text-panel-foreground">Log in to open workspace</h1>

			<p className="mt-3 text-m leading-6 text-muted-foreground">
				Protected company routes use Clerk when auth keys are configured.
			</p>

			<Link
				className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-m font-medium text-primary-foreground"
				href="/login"
			>
				Log in
			</Link>
		</div>
	</main>
);

const WorkspaceUnavailable = ({ message }: { message: string }) => (
	<main id="main-content" className="flex min-h-screen items-center justify-center bg-shell px-4">
		<div className="max-w-md rounded-lg border border-border bg-panel p-6 text-center shadow-panel">
			<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

			<h1 className="mt-2 text-4xl+ tracking-normal text-panel-foreground">Workspace unavailable</h1>

			<p className="mt-3 text-m leading-6 text-muted-foreground">{message}</p>
		</div>
	</main>
);
