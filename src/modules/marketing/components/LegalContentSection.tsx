import { Hero } from "./Hero";

export const LegalContentSection = () => (
	<section>
		<Hero
			description="Do not enter real credentials, personal financial data, or private company records into the demo workspace."
			label="Legal"
			labelAsHeading
			title="This MVP page is a placeholder for production legal copy. CashLift does not move money, issue cards, or provide financial, legal, or tax advice in this demo."
		/>

		<div className="mt-10 grid max-w-3xl gap-5 text-shell-muted leading-7">
			<p>
				The public CashLift site and Studio Nova demo are designed for product evaluation. The demo uses sample company
				data and is read-only, so visitors should not enter real credentials, personal financial information, or private
				company records.
			</p>

			<p>
				Signed-in workspaces are separate from the public demo. Workspace requests are protected by Clerk
				authentication, company membership checks, and Supabase row-level security. A request to approve or reject spend
				is an authorized human decision; CashLift does not move money or silently execute a payment.
			</p>

			<p>
				This page is an honest product boundary for the current MVP, not a substitute for the final legal terms that
				will govern a production service. Contact CashLift before sharing sensitive information or relying on the demo
				for a financial, legal, or tax decision.
			</p>
		</div>
	</section>
);
