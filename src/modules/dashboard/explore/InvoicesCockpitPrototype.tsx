"use client";

import Link from "next/link";
import type { InvoiceStatus } from "@/modules/invoices/types";
import { getPercentage } from "@/modules/money/format";
import type { FinancialDataset } from "@/modules/workspace/types";
import { cn } from "@/ui/utils/cn";
import { CASH_ACTION_WORK } from "./exploreModel";
import { ExploreKicker, ExploreMoney, PriorityCue, SupportNoteList } from "./exploreUi";
import { GlassCard } from "./GlassCard";
import {
	buildInvoicesCockpitPresentation,
	formatInvoiceDueDate,
	getInvoiceAnchorId,
	INVOICE_STATUS_LABEL,
	type InvoiceCockpitRow,
	type InvoicesCockpitPresentation,
} from "./invoicesCockpitModel";
import { WorkspaceFindShell } from "./WorkspaceFindShell";

type InvoicesCockpitPrototypeProps = {
	dataset: FinancialDataset;
	basePath?: string;
	invoiceRiskTotal?: number;
};

/** Throwaway prototype: invoices page using the overview liquid-glass cockpit. */
export const InvoicesCockpitPrototype = ({
	basePath = "/dashboard",
	dataset,
	invoiceRiskTotal,
}: InvoicesCockpitPrototypeProps) => {
	const asOfDate = invoiceRiskTotal === undefined ? undefined : new Date();
	const presentation = buildInvoicesCockpitPresentation({ asOfDate, dataset, invoiceRiskTotal });

	return (
		<WorkspaceFindShell basePath={basePath} dataset={dataset}>
			{renderInvoicesCockpit(presentation)}
		</WorkspaceFindShell>
	);
};

function renderInvoicesCockpit(presentation: InvoicesCockpitPresentation) {
	const {
		companyName,
		dueSchedule,
		headline,
		invoiceCount,
		openOnTime,
		openOnTimeCents,
		overdue,
		overdueCents,
		paid,
		paidCents,
		primaryAction,
		primaryInvoice,
		queueInvoices,
		supportNotes,
	} = presentation;
	const overdueWarning = overdueCents !== undefined && overdueCents > 0;

	return (
		<div className="space-y-4 xl:space-y-5">
			<GlassCard atmosphere="status">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<p className="text-muted-foreground text-s">
						{companyName} · {invoiceCount} {invoiceCount === 1 ? "invoice" : "invoices"}
					</p>

					<p className="text-muted-foreground text-s">
						{overdue.length} {overdue.length === 1 ? "overdue invoice" : "overdue invoices"}
					</p>
				</div>

				<h1 className="mt-3 max-w-4xl font-semibold text-3xl+ text-panel-foreground tracking-normal">{headline}</h1>

				<dl className="mt-6 grid gap-5 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-s">Overdue</dt>

						<dd>
							{overdueCents === undefined ? (
								<span className="font-semibold text-3xl+ text-panel-foreground tracking-normal">Calculating…</span>
							) : (
								<ExploreMoney cents={overdueCents} className="text-3xl+" warning={overdueWarning} />
							)}
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Open on time</dt>

						<dd>
							<ExploreMoney cents={openOnTimeCents} className="text-3xl+" />
						</dd>
					</div>

					<div>
						<dt className="text-muted-foreground text-s">Collected</dt>

						<dd>
							<ExploreMoney cents={paidCents} className="text-3xl+" />
						</dd>
					</div>
				</dl>
			</GlassCard>

			<section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
				<GlassCard atmosphere="priority" className="h-full" contentClassName="flex h-full flex-col" intensity="active">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
						{primaryAction ? (
							<PriorityCue priority={primaryAction.priority} />
						) : (
							<ExploreKicker>Priority</ExploreKicker>
						)}

						{primaryInvoice && (
							<>
								<span className="text-muted-foreground text-s">{CASH_ACTION_WORK.collection}</span>

								<span className="text-muted-foreground text-s">Due {formatInvoiceDueDate(primaryInvoice.dueDate)}</span>
							</>
						)}
					</div>

					{primaryInvoice ? (
						<>
							<h2 className="mt-3 font-semibold text-2xl+ text-panel-foreground tracking-normal">
								{primaryAction?.title ?? primaryInvoice.client}
							</h2>

							{primaryAction && <p className="mt-3 text-m text-shell-muted leading-6">{primaryAction.description}</p>}

							<p className="mt-5">
								<ExploreMoney cents={primaryInvoice.amountCents} className="text-2xl+" exact />

								<span className="ml-2 text-muted-foreground text-s">money affected</span>
							</p>

							<p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-s">
								<InvoiceStatusCue status={primaryInvoice.viewStatus} />

								<span>
									{getPercentage(primaryInvoice.collectionProbability)} collection probability · {primaryInvoice.owner}
								</span>
							</p>
						</>
					) : (
						<p className="mt-4 text-m text-muted-foreground">You are clear for collections today.</p>
					)}
				</GlassCard>

				<div className="grid min-w-0 gap-4 xl:gap-5">
					<div id="overdue-collections">
						<GlassCard atmosphere="queue">
							<ExploreKicker>Priorities</ExploreKicker>

							<h2 className="mt-1 text-panel-foreground text-xl+">What is still overdue</h2>

							{queueInvoices.length > 0 ? (
								<ol className="mt-4 divide-y divide-white/10">
									{queueInvoices.map((invoice) => (
										<li key={invoice.id}>{renderQueueInvoice(invoice)}</li>
									))}
								</ol>
							) : overdue.length > 0 ? (
								<p className="mt-4 text-m text-muted-foreground">
									No other overdue invoices in this Company Workspace.
								</p>
							) : (
								<p className="mt-4 text-m text-muted-foreground">No overdue invoices need collection.</p>
							)}
						</GlassCard>
					</div>

					<GlassCard atmosphere="outlook">
						<ExploreKicker>Future</ExploreKicker>

						<h2 className="mt-1 text-panel-foreground text-xl+">When cash is due</h2>

						{dueSchedule.length > 0 ? (
							<ol className="mt-4 divide-y divide-white/10">
								{dueSchedule.map((invoice) => (
									<li key={invoice.id} id={getInvoiceAnchorId(invoice.id)}>
										{renderDueInvoice(invoice)}
									</li>
								))}
							</ol>
						) : (
							<p className="mt-4 text-m text-muted-foreground">No open invoices remain on the collection calendar.</p>
						)}
					</GlassCard>
				</div>
			</section>

			<GlassCard atmosphere="support">
				<ExploreKicker>Supporting work</ExploreKicker>

				<h2 className="mt-1 text-panel-foreground text-xl+">Useful context, kept quieter</h2>

				<div className="mt-5 grid gap-8 lg:grid-cols-12">
					<div className="min-w-0 lg:col-span-7">
						<p className="font-semibold text-m+ text-panel-foreground">Still on time</p>

						{openOnTime.length > 0 ? (
							<ul className="mt-3 divide-y divide-white/10">
								{openOnTime.map(({ amountCents, client, collectionProbability, dueDate, id, owner, viewStatus }) => (
									<li key={id} className="flex items-start justify-between gap-3 py-3">
										<div className="min-w-0">
											<p className="font-semibold text-m+ text-panel-foreground">{client}</p>

											<p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-s">
												<InvoiceStatusCue status={viewStatus} />

												<span>
													Due {formatInvoiceDueDate(dueDate)} · {owner} · {getPercentage(collectionProbability)}
												</span>
											</p>
										</div>

										<ExploreMoney cents={amountCents} exact />
									</li>
								))}
							</ul>
						) : (
							<p className="mt-3 text-m text-muted-foreground">No sent or promised invoices are still on time.</p>
						)}
					</div>

					<div className="min-w-0 lg:col-span-5">
						<p className="font-semibold text-m+ text-panel-foreground">Collected</p>

						{paid.length > 0 ? (
							<ul className="mt-3 divide-y divide-white/10">
								{paid.map(({ amountCents, client, dueDate, id, owner, viewStatus }) => (
									<li key={id} className="flex items-start justify-between gap-3 py-3" id={getInvoiceAnchorId(id)}>
										<div className="min-w-0">
											<p className="font-semibold text-m+ text-panel-foreground">{client}</p>

											<p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-s">
												<InvoiceStatusCue status={viewStatus} />

												<span>
													{owner} · Due {formatInvoiceDueDate(dueDate)}
												</span>
											</p>
										</div>

										<ExploreMoney cents={amountCents} exact />
									</li>
								))}
							</ul>
						) : (
							<p className="mt-3 text-m text-muted-foreground">No paid invoices in this Company Workspace.</p>
						)}
					</div>
				</div>
			</GlassCard>

			<SupportNoteList notes={supportNotes} />
		</div>
	);
}

function InvoiceStatusCue({ status }: { status: InvoiceStatus }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-s">
			<span
				aria-hidden
				className={cn(
					"size-1.5 rounded-full",
					status === "overdue" && "bg-warning",
					status === "promised" && "bg-primary",
					status === "sent" && "bg-shell-muted",
					status === "paid" && "bg-signal",
				)}
			/>

			<span
				className={cn(
					status === "overdue" && "text-warning",
					status === "promised" && "text-primary",
					(status === "sent" || status === "paid") && "text-muted-foreground",
				)}
			>
				{INVOICE_STATUS_LABEL[status]}
			</span>
		</span>
	);
}

function renderQueueInvoice(invoice: InvoiceCockpitRow) {
	const { amountCents, client, collectionProbability, dueDate, id, owner, viewStatus } = invoice;

	return (
		<Link
			className="flex flex-col gap-2 py-3 outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 sm:flex-row sm:items-start sm:justify-between"
			href={`#${getInvoiceAnchorId(id)}`}
		>
			<span className="min-w-0">
				<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<InvoiceStatusCue status={viewStatus} />

					<span className="text-muted-foreground text-s">Due {formatInvoiceDueDate(dueDate)}</span>
				</span>

				<span className="mt-1 block font-semibold text-m+ text-panel-foreground">{client}</span>

				<span className="mt-1 block text-muted-foreground text-s">
					{owner} · {getPercentage(collectionProbability)}
				</span>
			</span>

			<ExploreMoney cents={amountCents} className="shrink-0" exact />
		</Link>
	);
}

function renderDueInvoice(invoice: InvoiceCockpitRow) {
	const { amountCents, client, dueDate, owner, viewStatus } = invoice;

	return (
		<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
			<div className="min-w-0">
				<p className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<InvoiceStatusCue status={viewStatus} />

					<span className="text-muted-foreground text-s">{formatInvoiceDueDate(dueDate)}</span>
				</p>

				<p className="mt-1 font-semibold text-m+ text-panel-foreground">{client}</p>

				<p className="mt-1 text-muted-foreground text-s">{owner}</p>
			</div>

			<ExploreMoney cents={amountCents} className="shrink-0" exact />
		</div>
	);
}
