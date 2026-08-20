import { ACTION_CATEGORY_IDS, countFindCategory, type FindItem, type FindWork, WORK_LABELS } from "./findModel";
import { FindFilterButton, FindRecentList, FindSearchField } from "./findUi";
import type { useFindSession } from "./useFindSession";

type WorkspaceFindSession = ReturnType<typeof useFindSession>;

type WorkspaceFindHeaderProps = {
	items: FindItem[];
	session: WorkspaceFindSession;
};

export const WorkspaceFindHeader = ({ items, session }: WorkspaceFindHeaderProps) => {
	const showRecents = !session.query.query && !session.hasFilters;
	const resultLabel = session.pending
		? "Updating…"
		: `${session.results.length} ${session.results.length === 1 ? "result" : "results"}`;
	const showClearAll = session.hasFilters || session.query.category !== "all" || Boolean(session.query.query);

	return (
		<div className="@container space-y-4">
			<FindSearchField
				glass
				id="workspace-find-search"
				inputRef={session.inputRef}
				onChange={(value) => session.updateQuery({ query: value })}
				onKeyDown={session.handleSearchKeyDown}
				onSelectSuggestion={session.applySearch}
				placeholder="Find a collection, approval, leak, bill, or budget…"
				suggestions={session.suggestions}
				value={session.query.query}
			/>

			{showRecents && <FindRecentList onSelect={session.applySearch} recentSearches={session.recentSearches} />}

			<div className="flex flex-wrap items-center justify-between gap-3">
				<p aria-live="polite" className="text-muted-foreground text-s">
					{resultLabel}
				</p>

				<div className="flex flex-wrap items-center gap-3">
					<p className="@lg:block hidden text-muted-foreground text-s">↑↓ to move, Enter to open</p>

					<button
						className="inline-flex @lg:hidden min-h-11 items-center rounded-full border border-white/10 px-3 text-m text-panel-foreground outline-none hover:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20"
						onClick={() => session.setFiltersOpen(!session.filtersOpen)}
						type="button"
					>
						Filters
					</button>

					{showClearAll && (
						<button
							className="inline-flex min-h-11 items-center text-m text-muted-foreground outline-none hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
							onClick={session.clearAll}
							type="button"
						>
							Clear all
						</button>
					)}
				</div>
			</div>

			<div className="grid @xl:grid-cols-[12.5rem_minmax(0,1fr)] gap-4">
				<nav aria-label="Work categories" className="min-w-0">
					<ul className="@lg:block flex gap-2 @lg:space-y-1 overflow-x-auto">
						{ACTION_CATEGORY_IDS.map((category) => {
							const selected = session.query.category === category;
							const label = category === "all" ? "All work" : WORK_LABELS[category as FindWork];

							return (
								<li key={category}>
									<button
										aria-current={selected ? "page" : undefined}
										className={getWorkCategoryClassName(selected)}
										onClick={() => session.updateQuery({ category })}
										type="button"
									>
										<span className="whitespace-nowrap">{label}</span>

										<span className="font-mono text-s tabular-nums">{countFindCategory(items, category, "work")}</span>
									</button>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className={getFilterPanelClassName(session.filtersOpen)}>
					<div>
						<p className="text-muted-foreground text-s">Status</p>

						<div className="mt-1 flex flex-wrap gap-3">
							<FindFilterButton onClick={() => session.updateQuery({ status: "" })} selected={!session.query.status}>
								Any
							</FindFilterButton>

							{session.statuses.map((status) => (
								<FindFilterButton
									key={status}
									onClick={() => session.updateQuery({ status })}
									selected={session.query.status === status}
								>
									{status}
								</FindFilterButton>
							))}
						</div>
					</div>

					<div>
						<p className="text-muted-foreground text-s">Owner</p>

						<div className="mt-1 flex flex-wrap gap-3">
							<FindFilterButton onClick={() => session.updateQuery({ owner: "" })} selected={!session.query.owner}>
								Anyone
							</FindFilterButton>

							{session.owners.map((owner) => (
								<FindFilterButton
									key={owner}
									onClick={() => session.updateQuery({ owner })}
									selected={session.query.owner === owner}
								>
									{owner}
								</FindFilterButton>
							))}
						</div>
					</div>

					{session.hasFilters && (
						<button
							className="inline-flex min-h-11 items-center text-m text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-primary/20"
							onClick={session.clearFilters}
							type="button"
						>
							Clear filters
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

function getWorkCategoryClassName(selected: boolean) {
	if (selected) {
		return "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-full border border-primary/40 bg-panel/45 px-3 text-left font-semibold text-m text-panel-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] outline-none backdrop-blur-md focus-visible:ring-[3px] focus-visible:ring-primary/20";
	}

	return "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-full px-3 text-left text-m text-shell-muted outline-none hover:bg-white/5 hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20";
}

function getFilterPanelClassName(filtersOpen: boolean) {
	if (filtersOpen) {
		return "space-y-4 rounded-2xl border border-white/10 p-4 @lg:border-0 @lg:p-0";
	}

	return "hidden space-y-4 @lg:block";
}
