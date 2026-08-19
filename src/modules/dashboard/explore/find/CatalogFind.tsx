import {
	CATALOG_CATEGORY_IDS,
	countFindCategory,
	FIND_KINDS,
	type FindItem,
	type FindKind,
	KIND_LABELS,
} from "./findModel";
import {
	FindEmptyState,
	FindFilterButton,
	FindLoadingState,
	FindRecentList,
	FindResultRow,
	FindSearchField,
	FindSuggestionList,
} from "./findUi";
import { useFindSession } from "./useFindSession";

type CatalogFindProps = {
	items: FindItem[];
};

export const CatalogFind = ({ items }: CatalogFindProps) => {
	const session = useFindSession(items, "kind");
	const noMatches = items.length > 0 && session.results.length === 0 && !session.pending;

	return (
		<div className="@container grid @lg:grid-cols-[14rem_minmax(0,1fr)] gap-6">
			<nav aria-label="Item kinds" className="min-w-0 rounded-lg border border-shell-border p-3">
				<p className="px-3 text-muted-foreground text-s">Catalog</p>

				<ul className="mt-2 space-y-1">
					{CATALOG_CATEGORY_IDS.map((category) => {
						const selected = session.query.category === category;
						const label = category === "all" ? "All items" : KIND_LABELS[category as FindKind];

						return (
							<li key={category}>
								<button
									aria-current={selected ? "page" : undefined}
									className={
										selected
											? "flex min-h-11 w-full items-center justify-between rounded-md bg-shell-elevated px-3 text-left font-semibold text-m text-panel-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
											: "flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-m text-shell-muted outline-none hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
									}
									onClick={() => session.updateQuery({ category })}
									type="button"
								>
									<span>{label}</span>

									<span className="font-mono text-s tabular-nums">{countFindCategory(items, category, "kind")}</span>
								</button>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="min-w-0 space-y-4">
				<FindSearchField
					id="find-search"
					inputRef={session.inputRef}
					onChange={(value) => session.updateQuery({ query: value })}
					onKeyDown={session.handleSearchKeyDown}
					placeholder="Filter this catalog…"
					value={session.query.query}
				/>

				<FindSuggestionList onSelect={session.applySearch} suggestions={session.suggestions} />

				{!session.query.query && (
					<FindRecentList onSelect={session.applySearch} recentSearches={session.recentSearches} />
				)}

				<div className="flex flex-wrap items-end justify-between gap-3 border-border border-b pb-2">
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

					{session.hasFilters && (
						<button
							className="inline-flex min-h-11 items-center text-m text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-primary/20"
							onClick={session.clearFilters}
							type="button"
						>
							Clear all
						</button>
					)}
				</div>

				<p aria-live="polite" className="text-muted-foreground text-s">
					{session.pending
						? "Updating…"
						: `${session.results.length} ${session.results.length === 1 ? "item" : "items"}`}
				</p>

				<FindLoadingState visible={session.pending && session.results.length === 0} />

				{noMatches && (
					<FindEmptyState
						title="No items in this catalog slice"
						detail="Try another kind, or clear status and search."
						onClear={session.clearAll}
					/>
				)}

				{FIND_KINDS.filter((kind) => session.results.some((item) => item.kind === kind)).map((kind) => (
					<section key={kind}>
						<h2 className="text-l+ text-panel-foreground">{KIND_LABELS[kind]}</h2>

						<ul
							className="mt-2 divide-y divide-border border-border border-t"
							id={kind === session.results[0]?.kind ? "find-results" : undefined}
						>
							{session.results
								.filter((item) => item.kind === kind)
								.map((item) => (
									<li key={item.id}>
										<FindResultRow
											item={item}
											highlightQuery={session.query.query}
											selected={session.selectedId === item.id}
											showKind={false}
										/>
									</li>
								))}
						</ul>
					</section>
				))}
			</div>
		</div>
	);
};
