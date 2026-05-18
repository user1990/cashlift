import { ChartPlaceholder } from "@/modules/dashboard/components/ChartPlaceholder";
import { Panel, PanelHeader } from "@/ui/components/Panel";

export default function WorkspaceLoading() {
	return (
		<main id="main-content" className="min-h-screen bg-shell text-shell-foreground">
			<div className="mx-auto grid w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[236px_1fr]">
				<aside className="rounded-lg border border-shell-border bg-shell-elevated p-3 shadow-shell lg:sticky lg:top-4 lg:self-start">
					<p className="p-2 text-s+ uppercase tracking-normal text-primary">CashLift</p>

					<div className="mt-4 grid gap-2">
						{["Overview", "Cash", "Invoices", "Approvals", "Vendors"].map((label) => (
							<div key={label} className="h-10 rounded-lg bg-panel-muted" />
						))}
					</div>
				</aside>

				<section className="min-w-0 space-y-5">
					<Panel className="p-6">
						<PanelHeader eyebrow="Today" title="Loading cash command center..." />

						<div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
							{["Cash buffer", "Runway", "Approvals", "Leaks"].map((label) => (
								<div key={label} className="h-24 rounded-lg bg-panel-muted" />
							))}
						</div>
					</Panel>

					<div className="grid gap-4 xl:grid-cols-2">
						<Panel className="min-h-[365px] p-6">
							<PanelHeader eyebrow="13-week cash outlook" title="Cash outlook from accounting-style data" />

							<ChartPlaceholder />
						</Panel>

						<Panel className="min-h-[365px] p-6">
							<PanelHeader eyebrow="Team budgets" title="Committed spend by team" />

							<ChartPlaceholder />
						</Panel>
					</div>
				</section>
			</div>
		</main>
	);
}
