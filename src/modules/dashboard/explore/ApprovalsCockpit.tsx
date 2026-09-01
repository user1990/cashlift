"use client";

import { Shield } from "lucide-react";
import type { ReactNode } from "react";
import { ApprovalDecisionActions } from "@/modules/spend-requests/components/ApprovalDecisionActions";
import { useSpendRequestDecision } from "@/modules/spend-requests/hooks/useSpendRequestDecision";
import { WORKSPACE_DATASET_QUERY_KEYS } from "@/modules/workspace/query";
import type { FinancialDataset } from "@/modules/workspace/types";
import { formatDashboardDate } from "../overviewDateRangeLabel";
import type { DashboardViewModel } from "../types";
import { buildDashboardViewModel } from "../view-model";
import { type ApprovalsPresentation, buildApprovalsPresentation, formatSpendCategory } from "./approvalsModel";
import { ExploreKicker, ExploreMoney } from "./exploreUi";
import { GlassCard } from "./GlassCard";

type ApprovalsCockpitProps = {
	dataset: FinancialDataset;
	readOnly?: boolean;
};

type PendingSpendRequest = DashboardViewModel["pendingApprovals"][number];

type ApprovalsCockpitViewProps = {
	dashboard: DashboardViewModel;
	presentation: ApprovalsPresentation;
	renderActions?: (request: PendingSpendRequest, size: "large" | "small") => ReactNode;
};

export const ApprovalsCockpit = ({ dataset, readOnly = false }: ApprovalsCockpitProps) => {
	const dashboard = buildDashboardViewModel({ dataset });
	const presentation = buildApprovalsPresentation(dashboard);

	if (readOnly) {
		return <ApprovalsCockpitView dashboard={dashboard} presentation={presentation} />;
	}

	return <InteractiveApprovalsCockpit dashboard={dashboard} presentation={presentation} />;
};

function InteractiveApprovalsCockpit({ dashboard, presentation }: Omit<ApprovalsCockpitViewProps, "renderActions">) {
	const { decide, pending, pendingDecision } = useSpendRequestDecision(WORKSPACE_DATASET_QUERY_KEYS.all);

	return (
		<ApprovalsCockpitView
			dashboard={dashboard}
			presentation={presentation}
			renderActions={(request, size) => (
				<ApprovalDecisionActions
					disabled={pending}
					id={request.id}
					onDecide={decide}
					pendingDecision={pendingDecision}
					size={size}
					vendor={request.vendor}
				/>
			)}
		/>
	);
}

function ApprovalsCockpitView({ dashboard, presentation, renderActions }: ApprovalsCockpitViewProps) {
	const primaryRequest = presentation.primaryRequest;
	const belowBuffer =
		primaryRequest?.cashAfterApprovalCents !== undefined &&
		primaryRequest.cashAfterApprovalCents < dashboard.cashBufferTargetCents;

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<p className="text-muted-foreground text-s">{presentation.contextLine}</p>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{presentation.headline}
				</h1>

				<dl className="mt-6 grid gap-5 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-s">Pending spend</dt>

						<dd>
							<ExploreMoney cents={presentation.pendingAmountCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Cash on hand</dt>

						<dd>
							<ExploreMoney cents={dashboard.cashAvailableCents} className="text-3xl+" />
						</dd>
					</div>

					{primaryRequest?.cashAfterApprovalCents !== undefined ? (
						<div>
							<dt className="flex items-center gap-1.5 text-muted-foreground text-s">
								<Shield aria-hidden className="size-3.5 text-primary" />
								Cash after next approval
							</dt>

							<dd>
								<ExploreMoney
									cents={primaryRequest.cashAfterApprovalCents}
									className="text-3xl+"
									warning={belowBuffer}
								/>
							</dd>
						</div>
					) : (
						<div>
							<dt className="flex items-center gap-1.5 text-muted-foreground text-s">
								<Shield aria-hidden className="size-3.5 text-primary" />
								Cash buffer
							</dt>

							<dd>
								<ExploreMoney cents={dashboard.cashBufferTargetCents} className="text-3xl+" />
							</dd>
						</div>
					)}
				</dl>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" className="h-full" contentClassName="flex h-full flex-col" intensity="active">
					{primaryRequest ? (
						renderPriorityRequest(primaryRequest, belowBuffer, renderActions)
					) : (
						<>
							<ExploreKicker>Priority</ExploreKicker>

							<p className="mt-4 text-m text-muted-foreground">You are clear on spend.</p>
						</>
					)}
				</GlassCard>

				<GlassCard atmosphere="queue">
					<ExploreKicker>Queue</ExploreKicker>

					<h2 className="mt-1 text-panel-foreground text-xl+">What matters next</h2>

					{presentation.remainingRequests.length > 0 ? (
						<ol className="mt-4 divide-y divide-white/10">
							{presentation.remainingRequests.map((request) => (
								<li key={request.id}>{renderQueueRequest(request, renderActions)}</li>
							))}
						</ol>
					) : (
						<p className="mt-4 text-m text-muted-foreground">No other open spend requests.</p>
					)}
				</GlassCard>
			</section>

			<GlassCard atmosphere="support">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Approval policy, kept quieter</h2>

				<div className="mt-5 space-y-3 text-m text-shell-muted leading-6">
					<p>Managers approve team spend after CashLift shows cash impact.</p>

					<p>Finance holds non-essential requests if buffer risk appears.</p>

					<p>Employees can request spend and upload receipts only.</p>
				</div>
			</GlassCard>
		</div>
	);
}

function renderPriorityRequest(
	request: PendingSpendRequest,
	belowBuffer: boolean,
	renderActions?: ApprovalsCockpitViewProps["renderActions"],
) {
	const { amountCents, cashAfterApprovalCents, category, neededByDate, reason, requester, team, vendor } = request;

	return (
		<>
			<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
				<span className="text-muted-foreground text-s">{formatSpendCategory(category)}</span>

				<span className="text-muted-foreground text-s">Needed {formatDashboardDate(neededByDate)}</span>

				<span className="text-muted-foreground text-s">
					{requester} · {team}
				</span>
			</div>

			<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">{vendor}</h2>

			<p className="mt-3 text-m text-shell-muted leading-6">{reason}</p>

			<p className="mt-5">
				<ExploreMoney cents={amountCents} className="text-2xl+" exact />

				<span className="ml-2 text-muted-foreground text-s">money affected</span>
			</p>

			{cashAfterApprovalCents !== undefined && (
				<p className={belowBuffer ? "mt-1 text-s text-warning" : "mt-1 text-muted-foreground text-s"}>
					Cash after approval <ExploreMoney cents={cashAfterApprovalCents} exact warning={belowBuffer} />
				</p>
			)}

			{renderActions && <div className="mt-6">{renderActions(request, "large")}</div>}
		</>
	);
}

function renderQueueRequest(request: PendingSpendRequest, renderActions?: ApprovalsCockpitViewProps["renderActions"]) {
	const { amountCents, category, neededByDate, requester, team, vendor } = request;

	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground text-s">{formatSpendCategory(category)}</span>

					<span className="text-muted-foreground text-s">Needed {formatDashboardDate(neededByDate)}</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{vendor}</span>

				<span className="mt-1 block text-muted-foreground text-s">
					{requester} · {team}
				</span>
			</span>

			<span className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
				<ExploreMoney cents={amountCents} exact />

				{renderActions?.(request, "small")}
			</span>
		</div>
	);
}
