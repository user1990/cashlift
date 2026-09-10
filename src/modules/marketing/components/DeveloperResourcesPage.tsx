import Link from "next/link";
import { MainContent } from "@/modules/page-shell/components/MainContent";
import { Hero } from "./Hero";

export const DeveloperResourcesPage = () => (
	<MainContent variant="marketing">
		<Hero
			variant="page-title"
			label="CashLift developer resources"
			description="Find the machine-readable workspace API contract, authentication boundary, and agent guidance for CashLift."
		/>

		<div className="mt-14 grid gap-10 border-shell-border border-t pt-10 md:grid-cols-3">
			<ResourceSection title="API">
				<p className="text-shell-muted leading-7">
					Use the versioned OpenAPI document when an agent needs the current workspace dataset and spend-request
					decision routes.
				</p>

				<Link href="/openapi.json" className="mt-5 inline-block text-primary">
					OpenAPI specification →
				</Link>
			</ResourceSection>

			<ResourceSection title="Authentication">
				<p className="text-shell-muted leading-7">
					Production workspace requests require an authenticated Clerk session. Demo mode uses read-only fixtures and
					does not require an account.
				</p>
			</ResourceSection>

			<ResourceSection title="Other integrations">
				<p className="text-shell-muted leading-7">
					CashLift publishes a read-only MCP Streamable HTTP server for agents. Production workspace data still requires
					an authenticated session, and the MCP tool never mutates financial records.
				</p>

				<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
					<Link href="/.well-known/mcp" className="inline-block text-primary">
						MCP discovery manifest →
					</Link>

					<Link href="/llms.txt" className="inline-block text-primary">
						Read agent guidance →
					</Link>
				</div>
			</ResourceSection>
		</div>
	</MainContent>
);

type ResourceSectionProps = {
	children: React.ReactNode;
	title: string;
};

function ResourceSection({ children, title }: ResourceSectionProps) {
	return (
		<section>
			<h2 className="text-3xl+ text-primary tracking-normal">{title}</h2>

			<div className="mt-4">{children}</div>
		</section>
	);
}
