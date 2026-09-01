import { ExploreKicker, ExploreMoney } from "@/modules/dashboard/explore/exploreUi";
import { GlassCard } from "@/modules/dashboard/explore/GlassCard";
import { formatDashboardDate } from "@/modules/dashboard/overviewDateRangeLabel";
import { getPercentage } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import {
	buildVendorsPresentation,
	SUBSCRIPTION_STATUS_LABELS,
	VENDOR_BILL_CATEGORY_LABELS,
	VENDOR_BILL_STATUS_LABELS,
	type VendorsPresentation,
} from "../vendorsPresentation";

type WorkspaceVendorsSectionProps = {
	dataset: FinancialDataset;
};

export const WorkspaceVendorsSection = ({ dataset }: WorkspaceVendorsSectionProps) => {
	const presentation = buildVendorsPresentation(dataset);

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<p className="text-muted-foreground text-s">{presentation.companyName} · Vendor bills & leaks</p>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">
					{presentation.headline}
				</h1>

				<dl className="mt-6 grid gap-5 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-s">Vendor leaks</dt>

						<dd>
							<ExploreMoney
								cents={presentation.leakSavingsCents}
								className="text-3xl+"
								warning={presentation.leakSavingsCents > 0}
							/>
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Vendor bills</dt>

						<dd>
							<ExploreMoney cents={presentation.billsTotalCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Needs review</dt>

						<dd>
							<ExploreMoney
								cents={presentation.reviewBillsCents}
								className="text-3xl+"
								warning={presentation.reviewBillsCents > 0}
							/>
						</dd>
					</div>
				</dl>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" className="h-full" contentClassName="flex h-full flex-col" intensity="active">
					{renderPrimaryWork(presentation)}
				</GlassCard>

				<div className="grid min-w-0 gap-4 xl:gap-5">
					<div id="vendor-leaks">
						<GlassCard atmosphere="queue">
							<ExploreKicker>Queue</ExploreKicker>

							<h2 className="mt-1 text-panel-foreground text-xl+">Vendor leaks</h2>

							{presentation.remainingLeaks.length > 0 ? (
								<ul className="mt-4 divide-y divide-white/10">
									{presentation.remainingLeaks.map((leak) => (
										<li key={leak.id}>{renderLeakRow(leak)}</li>
									))}
								</ul>
							) : (
								<p className="mt-4 text-m text-muted-foreground">
									{presentation.leaks.length > 0
										? "No other vendor leaks need action."
										: "No vendor leaks need action."}
								</p>
							)}
						</GlassCard>
					</div>

					<div id="vendor-bills">
						<GlassCard atmosphere="outlook">
							<ExploreKicker>Bills</ExploreKicker>

							<h2 className="mt-1 text-panel-foreground text-xl+">Vendor bills</h2>

							{presentation.remainingBills.length > 0 ? (
								<ul className="mt-4 divide-y divide-white/10">
									{presentation.remainingBills.map((bill) => (
										<li key={bill.id}>{renderBillRow(bill)}</li>
									))}
								</ul>
							) : (
								<p className="mt-4 text-m text-muted-foreground">
									{presentation.bills.length > 0 ? "No other vendor bills." : "No vendor bills in this workspace."}
								</p>
							)}
						</GlassCard>
					</div>
				</div>
			</section>

			<GlassCard atmosphere="support">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Other subscriptions</h2>

				{presentation.activeSubscriptions.length > 0 ? (
					<ul className="mt-4 divide-y divide-white/10">
						{presentation.activeSubscriptions.map((subscription) => (
							<li key={subscription.id}>{renderSubscriptionRow(subscription)}</li>
						))}
					</ul>
				) : (
					<p className="mt-4 text-m text-muted-foreground">No other subscriptions.</p>
				)}
			</GlassCard>
		</div>
	);
};

function renderPrimaryWork(presentation: VendorsPresentation) {
	const primaryLeak = presentation.primaryLeak;
	const primaryBill = presentation.primaryBill;

	if (primaryLeak) {
		return (
			<>
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground text-s">Vendor leak</span>

					<span className="text-muted-foreground text-s">{SUBSCRIPTION_STATUS_LABELS[primaryLeak.status]}</span>

					<span className="text-muted-foreground text-s">Renews {formatDashboardDate(primaryLeak.renewalDate)}</span>
				</div>

				<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">{primaryLeak.vendor}</h2>

				<p className="mt-3 text-m text-shell-muted leading-6">{getPercentage(primaryLeak.usagePercent)} used</p>

				<p className="mt-5">
					<ExploreMoney cents={primaryLeak.amountCents} className="text-2xl+" exact />

					<span className="ml-2 text-muted-foreground text-s">monthly</span>
				</p>
			</>
		);
	}

	if (primaryBill) {
		return (
			<>
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground text-s">Vendor bill</span>

					<span className="text-muted-foreground text-s">{VENDOR_BILL_STATUS_LABELS[primaryBill.status]}</span>

					<span className="text-muted-foreground text-s">Due {formatDashboardDate(primaryBill.dueDate)}</span>
				</div>

				<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">{primaryBill.vendor}</h2>

				<p className="mt-3 text-m text-shell-muted leading-6">
					{VENDOR_BILL_CATEGORY_LABELS[primaryBill.category]}
					{primaryBill.essential && " · Essential"}
				</p>

				<p className="mt-5">
					<ExploreMoney cents={primaryBill.amountCents} className="text-2xl+" exact />
				</p>
			</>
		);
	}

	return (
		<>
			<ExploreKicker>Priority</ExploreKicker>

			<p className="mt-4 text-m text-muted-foreground">No vendor leaks or vendor bills need action.</p>
		</>
	);
}

function renderLeakRow(leak: FinancialDataset["subscriptions"][number]) {
	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground text-s">{SUBSCRIPTION_STATUS_LABELS[leak.status]}</span>

					<span className="text-muted-foreground text-s">{getPercentage(leak.usagePercent)} used</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{leak.vendor}</span>
			</span>

			<ExploreMoney cents={leak.amountCents} className="shrink-0" exact />
		</div>
	);
}

function renderBillRow(bill: FinancialDataset["vendorBills"][number]) {
	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground text-s">{VENDOR_BILL_STATUS_LABELS[bill.status]}</span>

					<span className="text-muted-foreground text-s">Due {formatDashboardDate(bill.dueDate)}</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{bill.vendor}</span>

				<span className="mt-1 block text-muted-foreground text-s">
					{VENDOR_BILL_CATEGORY_LABELS[bill.category]}
					{bill.essential && " · Essential"}
				</span>
			</span>

			<ExploreMoney cents={bill.amountCents} className="shrink-0" exact />
		</div>
	);
}

function renderSubscriptionRow(subscription: FinancialDataset["subscriptions"][number]) {
	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-muted-foreground text-s">{SUBSCRIPTION_STATUS_LABELS[subscription.status]}</span>

					<span className="text-muted-foreground text-s">Renews {formatDashboardDate(subscription.renewalDate)}</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{subscription.vendor}</span>
			</span>

			<ExploreMoney cents={subscription.amountCents} className="shrink-0" exact />
		</div>
	);
}
