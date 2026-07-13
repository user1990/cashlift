import type { Metadata } from "next";
import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";

export const metadata: Metadata = {
	title: "Finish workspace setup — CashLift",
	description: "Recover your CashLift company workspace setup.",
};

export default function WorkspaceRecoveryPage() {
	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<section
				aria-labelledby="workspace-recovery-title"
				className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-panel"
			>
				<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

				<h1 className="mt-2 text-3xl+ tracking-normal text-panel-foreground" id="workspace-recovery-title">
					Finish setting up your workspace
				</h1>

				<p className="mt-3 text-m leading-6 text-muted-foreground">
					Your sign-in worked, but no company workspace is available yet.
				</p>

				<div className="mt-6 flex flex-wrap gap-4">
					<Link
						href="/onboarding"
						className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 text-m font-medium text-primary-foreground"
					>
						Retry setup
					</Link>

					<Link
						className="inline-flex h-10 items-center justify-center px-1 text-m font-medium text-primary underline underline-offset-4"
						href="/contact"
					>
						Contact support
					</Link>
				</div>
			</section>
		</MainContent>
	);
}
