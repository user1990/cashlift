import type { Metadata } from "next";
import Link from "next/link";
import { FIND_DIRECTION_IDS, FIND_DIRECTIONS } from "@/modules/dashboard/explore/find/directions";

export const metadata: Metadata = {
	title: "Find prototype — CashLift",
	description: "Three isolated search, category, and filter directions for finding workspace items.",
};

export default function DashboardFindExploreIndex() {
	return (
		<div className="space-y-8">
			<header className="max-w-3xl space-y-3">
				<p className="text-muted-foreground text-s">Design prototype · production lists are unchanged</p>

				<h1 className="font-semibold text-3xl+ text-panel-foreground tracking-normal">Find in under five seconds</h1>

				<p className="text-m+ text-shell-muted leading-6">
					Search, categories, filters, results, then one action. All three directions use the current Company Workspace
					dataset. Direction C is the high-fidelity recommendation.
				</p>
			</header>

			<ul className="grid gap-4 lg:grid-cols-3">
				{FIND_DIRECTION_IDS.map((id) => {
					const direction = FIND_DIRECTIONS[id];

					return (
						<li key={id}>
							<Link
								className="ease flex min-h-44 flex-col rounded-lg border border-border bg-panel p-5 shadow-panel outline-none transition-[border-color] duration-150 hover:border-primary-subtle-border focus-visible:ring-[3px] focus-visible:ring-primary/20"
								href={direction.href}
							>
								<p className="text-muted-foreground text-s">
									Direction {id.toUpperCase()}
									{id === "c" ? " · recommended" : ""}
								</p>

								<h2 className="mt-2 text-panel-foreground text-xl+">{direction.name}</h2>

								<p className="mt-2 text-m text-shell-muted leading-6">{direction.promise}</p>

								<p className="mt-auto pt-6 text-m text-primary">Open full prototype</p>
							</Link>
						</li>
					);
				})}
			</ul>

			<p>
				<Link className="text-m text-muted-foreground hover:text-panel-foreground" href="/dashboard/explore">
					Overview prototypes
				</Link>
			</p>
		</div>
	);
}
