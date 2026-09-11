import { MainContent } from "@/modules/page-shell/components/MainContent";
import { Hero } from "./Hero";

export const AboutPage = () => (
	<MainContent variant="marketing">
		<Hero
			variant="page-title"
			label="About CashLift"
			description="CashLift helps service companies see what money-related work needs attention today, with the reason, cash impact, owner, and next step kept together."
		/>

		<div className="mt-14 grid gap-10 border-shell-border border-t pt-10 md:grid-cols-2">
			<section>
				<h2 className="text-3xl+ text-primary tracking-normal">A decision-support workspace</h2>

				<div className="mt-4 grid gap-4 text-shell-muted leading-7">
					<p>
						CashLift is built for owners, finance leads, and managers at agencies, consultancies, studios, and software
						service companies. It brings overdue invoices, spend requests, vendor costs, team budgets, and cash warnings
						into one daily inbox so a team can decide what to collect, approve, or cut.
					</p>

					<p>
						The product does not move money, issue cards, connect accounting books in the public tour, or make decisions
						on a company's behalf. CashLift keeps people responsible for consequential choices and shows the evidence
						beside the recommended next step.
					</p>
				</div>
			</section>

			<section>
				<h2 className="text-3xl+ text-primary tracking-normal">Start with the sample</h2>

				<div className="mt-4 grid gap-4 text-shell-muted leading-7">
					<p>
						The public Studio Nova experience is a read-only sample designed to make the workflow easy to inspect
						without an account or company records. Open the ranked inbox, inspect a collection or approval item, and
						follow the cash context before deciding whether the example needs a follow-up.
					</p>

					<p>
						Signed-in workspaces add company-scoped data and authorized spend decisions. Production requests remain
						protected by Clerk authentication and Supabase row-level security, while the public demo stays separate from
						production records.
					</p>
				</div>
			</section>
		</div>
	</MainContent>
);
