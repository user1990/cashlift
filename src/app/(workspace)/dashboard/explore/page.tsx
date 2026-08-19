import type { Metadata } from "next";
import Link from "next/link";
import { EXPLORE_DIRECTION_IDS, EXPLORE_DIRECTIONS } from "@/modules/dashboard/explore/directions";

export const metadata: Metadata = {
	title: "Dashboard design exploration — CashLift",
	description: "Three isolated /dashboard overview prototypes for visual UX comparison.",
};

export default function DashboardExploreIndex() {
	return (
		<div className="space-y-8">
			<header className="max-w-3xl space-y-3">
				<p className="text-muted-foreground text-s">Design prototype · production overview is unchanged</p>

				<h1 className="font-semibold text-3xl+ text-panel-foreground tracking-normal">Dashboard design exploration</h1>

				<p className="text-m+ text-shell-muted leading-6">
					Three overview directions using existing Company Workspace data. Open each full page to judge hierarchy,
					actions, forecast, and supporting work on desktop and mobile.
				</p>
			</header>

			<ul className="grid gap-4 lg:grid-cols-3">
				{EXPLORE_DIRECTION_IDS.map((id) => {
					const direction = EXPLORE_DIRECTIONS[id];

					return (
						<li key={id}>
							<Link
								className="ease flex min-h-44 flex-col rounded-lg border border-border bg-panel p-5 shadow-panel outline-none transition-[border-color] duration-150 hover:border-primary-subtle-border focus-visible:ring-[3px] focus-visible:ring-primary/20"
								href={direction.href}
							>
								<p className="text-muted-foreground text-s">Direction {id.toUpperCase()}</p>

								<h2 className="mt-2 text-panel-foreground text-xl+">{direction.name}</h2>

								<p className="mt-2 text-m text-shell-muted leading-6">{direction.promise}</p>

								<p className="mt-auto pt-6 text-m text-primary">Open full prototype</p>
							</Link>
						</li>
					);
				})}
			</ul>

			<p>
				<Link className="text-m text-muted-foreground hover:text-panel-foreground" href="/dashboard">
					Back to production overview
				</Link>
			</p>
		</div>
	);
}
