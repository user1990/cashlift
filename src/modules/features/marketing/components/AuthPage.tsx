import Link from "next/link";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { LeadCaptureForm } from "./LeadCaptureForm";

type AuthPageProps = {
	mode: "login" | "signup";
};

const AUTH_PAGE_CONTENT = {
	login: {
		buttonLabel: "Log in to demo",
		eyebrow: "Login",
		headline: "Open your CashLift workspace.",
		panelTitle: "Log in",
	},
	signup: {
		buttonLabel: "Create workspace",
		eyebrow: "Start trial",
		headline: "Create a CashLift team workspace.",
		panelTitle: "Start free trial",
	},
} satisfies Record<
	AuthPageProps["mode"],
	{
		buttonLabel: string;
		eyebrow: string;
		headline: string;
		panelTitle: string;
	}
>;

export const AuthPage = ({ mode }: AuthPageProps) => {
	const content = AUTH_PAGE_CONTENT[mode];

	return (
		<main className="mx-auto grid max-w-[980px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20">
			<div>
				<p className="text-s+ uppercase tracking-normal text-primary">{content.eyebrow}</p>

				<h1 className="mt-4 text-6xl+ tracking-normal text-shell-foreground">{content.headline}</h1>

				<p className="mt-5 text-xl leading-8 text-shell-muted">
					Clerk powers auth when environment keys are configured. Demo mode keeps the mock workspace available without
					credentials.
				</p>

				<Link
					className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-shell-border bg-shell-elevated px-4 text-m font-medium text-shell-foreground transition-[border-color,color] duration-150 ease hover:border-primary-subtle-border hover:text-primary"
					href="/app"
				>
					Continue to demo workspace
				</Link>
			</div>

			<Panel>
				<PanelHeader eyebrow="Demo credentials" title={content.panelTitle} />

				<LeadCaptureForm buttonLabel={content.buttonLabel} />
			</Panel>
		</main>
	);
};
