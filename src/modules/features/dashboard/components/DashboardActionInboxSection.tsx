import { CheckCircle2, ReceiptText } from "lucide-react";
import { formatCompactCurrency, formatCurrency } from "@/modules/common/money/format";
import { Button } from "@/modules/ui/components/Button";
import { Panel, PanelHeader } from "@/modules/ui/components/Panel";
import { Reveal } from "@/modules/ui/components/Reveal";
import type { DashboardViewModel } from "../types";
import { ActionTile } from "./ActionTile";

type DashboardActionInboxSectionProps = {
	dashboard: DashboardViewModel;
};

export const DashboardActionInboxSection = ({ dashboard }: DashboardActionInboxSectionProps) => (
	<Reveal className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]" delay={0.08} duration={0.16} y={8}>
		<Panel>
			<PanelHeader
				action={
					<Button variant="ghost">
						<ReceiptText aria-hidden className="size-4" />
						Export actions
					</Button>
				}
				eyebrow="Action inbox"
				title="Highest cash decisions today"
			/>

			<ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
				{dashboard.actionInbox.map(({ description, id, impactCents, title }) => (
					<li key={id}>
						<ActionTile
							icon={<CheckCircle2 aria-hidden className="size-4" />}
							label={title}
							meta={description}
							value={formatCompactCurrency(impactCents)}
						/>
					</li>
				))}
			</ul>
		</Panel>

		<Panel>
			<PanelHeader eyebrow="Approvals" title="Spend requests waiting for cash context" />

			<ul className="space-y-3">
				{dashboard.pendingApprovals.map(
					({ amountCents, cashAfterApprovalCents, id, reason, requester, team, vendor }) => (
						<li key={id} className="rounded-lg border border-border bg-panel-muted p-3">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="text-m+ text-panel-foreground">{vendor}</p>

									<p className="mt-1 text-s leading-5 text-muted-foreground">
										{requester} · {team}
									</p>
								</div>

								<span className="font-mono text-m+">{formatCurrency(amountCents)}</span>
							</div>

							<p className="mt-3 text-s leading-5 text-muted-foreground">{reason}</p>

							<div className="mt-3 rounded-md bg-panel p-2 text-s text-muted-foreground">
								<span>Cash after approval: </span>

								<span className="font-mono text-s+ text-panel-foreground">
									{formatCurrency(cashAfterApprovalCents)}
								</span>
							</div>
						</li>
					),
				)}
			</ul>
		</Panel>
	</Reveal>
);
