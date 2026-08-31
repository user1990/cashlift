import { Panel } from "@/ui/components/layout/Panel";

export default function DashboardLoading() {
	return (
		<div className="space-y-5">
			<p className="sr-only">Loading dashboard…</p>

			<div className="space-y-5" aria-hidden>
				<div className="space-y-2">
					<div className="h-8 w-4/5 max-w-3xl rounded bg-panel-muted" />

					<div className="h-4 w-1/3 rounded bg-panel-muted" />
				</div>

				<Panel className="grid gap-0 p-0 md:grid-cols-3">
					<div className="h-28 border-shell-border/60 border-b p-5 md:border-b-0 md:border-l md:first:border-l-0">
						<div className="h-4 w-24 rounded bg-panel-muted" />

						<div className="mt-3 h-8 w-28 rounded bg-panel-muted" />
					</div>

					<div className="h-28 border-shell-border/60 border-b p-5 md:border-b-0 md:border-l">
						<div className="h-4 w-32 rounded bg-panel-muted" />

						<div className="mt-3 h-8 w-24 rounded bg-panel-muted" />
					</div>

					<div className="h-28 border-shell-border/60 p-5 md:border-l">
						<div className="h-4 w-28 rounded bg-panel-muted" />

						<div className="mt-3 h-8 w-20 rounded bg-panel-muted" />
					</div>
				</Panel>

				<Panel>
					<div className="mb-4 space-y-2">
						<div className="h-3 w-24 rounded bg-panel-muted" />

						<div className="h-5 w-64 rounded bg-panel-muted" />
					</div>

					<div className="space-y-3">
						<div className="h-16 rounded-lg bg-panel-muted" />

						<div className="h-16 rounded-lg bg-panel-muted" />

						<div className="h-16 rounded-lg bg-panel-muted" />
					</div>
				</Panel>
			</div>
		</div>
	);
}
