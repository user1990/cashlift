import type { Metadata } from "next";
import { WorkspaceSetupForm } from "@/modules/onboarding/components/WorkspaceSetupForm";
import { MainContent } from "@/modules/page-shell/components/MainContent";

export const metadata: Metadata = {
	title: "Set up your workspace — CashLift",
	description: "Create your CashLift company workspace.",
};

export default function OnboardingPage() {
	return (
		<MainContent variant="workspace" className="flex justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
			<section
				aria-labelledby="workspace-setup-title"
				className="w-full max-w-md rounded-lg border border-border bg-panel p-6 shadow-panel"
			>
				<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

				<h1 className="mt-2 text-3xl+ tracking-normal text-panel-foreground" id="workspace-setup-title">
					Set up your company workspace
				</h1>

				<p className="mt-3 text-m leading-6 text-muted-foreground">
					Start with the essentials. You can add cash details after you are inside.
				</p>

				<WorkspaceSetupForm />
			</section>
		</MainContent>
	);
}
