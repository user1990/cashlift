import { ArrowUpRight, ReceiptText, Users } from "lucide-react";
import { ActionTile } from "./ActionTile";

export const DashboardFooterActions = () => (
	<section>
		<ul className="grid gap-4 md:grid-cols-3">
			<li>
				<ActionTile
					icon={<Users aria-hidden className="size-4" />}
					label="Employees request, managers approve"
					meta="Request-only seats stay unlimited so the whole team can use CashLift."
					value="Roles"
				/>
			</li>

			<li>
				<ActionTile
					icon={<ArrowUpRight aria-hidden className="size-4" />}
					label="Accounting first, no money movement"
					meta="Mocked QuickBooks/Xero-style data proves the workflow without cards or payments."
					value="MVP"
				/>
			</li>

			<li>
				<ActionTile
					icon={<ReceiptText aria-hidden className="size-4" />}
					label="Free cash leak audit hook"
					meta="Lead with a fast audit before asking a business to invite employees."
					value="Audit"
				/>
			</li>
		</ul>
	</section>
);
