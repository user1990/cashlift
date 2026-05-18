import { Panel } from "@/ui/components/Panel";
import { PROOF_POINTS } from "../content";

export const CustomersPage = () => (
	<main id="main-content" className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
		<p className="text-s+ uppercase tracking-normal text-primary">Customers</p>

		<h1 className="mt-4 max-w-3xl text-6xl+ tracking-normal text-shell-foreground">
			Service teams use CashLift to make money decisions earlier.
		</h1>

		<p className="mt-5 max-w-2xl text-xl leading-8 text-shell-muted">
			MVP proof stories use demo data until real customer evidence exists. They show the outcomes CashLift is built to
			create.
		</p>

		<ul className="mt-10 grid gap-4 md:grid-cols-3">
			{PROOF_POINTS.map(({ metric, text }) => (
				<li key={metric}>
					<Panel as="article">
						<dl>
							<dt className="sr-only">Customer proof point</dt>

							<dd className="font-mono text-5xl+ text-primary-strong">{metric}</dd>
						</dl>

						<p className="mt-3 text-m leading-6 text-muted-foreground">{text}</p>
					</Panel>
				</li>
			))}
		</ul>
	</main>
);
