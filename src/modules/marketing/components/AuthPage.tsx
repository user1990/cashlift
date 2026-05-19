import Link from "next/link";
import { Panel, PanelHeader } from "@/ui/components/Panel";
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
} as const satisfies Record<
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
		<main id="main-content" className="min-h-screen bg-shell px-4 py-10 text-shell-foreground sm:px-6 lg:px-8">
			<div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
				<div>
					<Link href="/" className="mb-12 inline-flex items-center gap-3">
						<span className="grid size-10 place-items-center rounded-lg bg-signal-subtle text-signal shadow-primary-glow">
							<span className="size-6 rounded-[6px] bg-signal [clip-path:polygon(50%_0,100%_100%,50%_78%,0_100%)]" />
						</span>

						<span className="text-2xl+ font-semibold tracking-normal text-shell-foreground">
							Cash<span className="text-signal">Lift</span>
						</span>
					</Link>

					<p className="text-s+ uppercase tracking-normal text-primary">{content.eyebrow}</p>

					<h1 className="mt-4 max-w-xl text-6xl+ tracking-normal text-shell-foreground">{content.headline}</h1>

					<p className="mt-5 max-w-xl text-xl leading-8 text-shell-muted">
						Clerk powers auth when environment keys are configured. Demo mode opens the reference cash command center
						without external services.
					</p>

					<Link
						href="/app"
						className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-primary bg-primary px-4 text-m font-medium text-primary-foreground transition-[background-color,box-shadow] duration-150 ease hover:bg-primary-hover hover:shadow-primary-glow"
					>
						Continue to demo workspace
					</Link>
				</div>

				<Panel className="p-6">
					<PanelHeader label="Demo credentials" title={content.panelTitle} />

					<LeadCaptureForm buttonLabel={content.buttonLabel} />
				</Panel>
			</div>
		</main>
	);
};
