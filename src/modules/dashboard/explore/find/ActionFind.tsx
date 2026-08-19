import Link from "next/link";
import { ACTION_CATEGORY_IDS, countFindCategory, type FindItem, type FindWork, WORK_LABELS } from "./findModel";
import {
	FindEmptyState,
	FindFilterButton,
	FindLoadingState,
	FindRecentList,
	FindResultHeader,
	FindResultRow,
	FindSearchField,
} from "./findUi";
import { useFindSession } from "./useFindSession";

type ActionFindProps = {
	items: FindItem[];
};

type ActionFindSession = ReturnType<typeof useFindSession>;

export const ActionFind = ({ items }: ActionFindProps) => {
	const session = useFindSession(items, "work");
	const emptyCatalog = items.length === 0;
	const noMatches = !emptyCatalog && session.results.length === 0 && !session.pending;
	const showRecents = !session.query.query && !session.hasFilters;
	const showSkeleton = session.pending && session.results.length === 0;

	return (
		<div className="@container">
			<div className="space-y-3">
				<FindSearchField
					id="find-search"
					inputRef={session.inputRef}
					onChange={(value) => session.updateQuery({ query: value })}
					onKeyDown={session.handleSearchKeyDown}
					onSelectSuggestion={session.applySearch}
					placeholder="Find a collection, approval, leak, bill, or budget…"
					suggestions={session.suggestions}
					value={session.query.query}
				/>

				{showRecents && <FindRecentList onSelect={session.applySearch} recentSearches={session.recentSearches} />}

				{actionFindToolbar(session)}
			</div>

			<div className="mt-5 grid @lg:grid-cols-[12.5rem_minmax(0,1fr)] gap-8">
				{actionWorkNav(items, session)}

				<div className="min-w-0 space-y-4">
					{actionFilterFields(session)}

					{emptyCatalog && <FindEmptyState title="No workspace items to search yet." />}

					{noMatches && actionNoMatches(session)}

					<FindLoadingState columns visible={showSkeleton} />

					{session.results.length > 0 && actionResultList(session)}

					<p className="text-muted-foreground text-s">
						Actions open the existing invoices, approvals, vendors, or budgets routes. This finder does not mutate
						workspace data.
					</p>

					<p>
						<Link className="text-m text-muted-foreground hover:text-panel-foreground" href="/dashboard">
							Production overview
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

function actionFindToolbar(session: ActionFindSession) {
	const resultLabel = session.pending
		? "Updating…"
		: `${session.results.length} ${session.results.length === 1 ? "result" : "results"}`;
	const showClearAll = session.hasFilters || session.query.category !== "all" || Boolean(session.query.query);

	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<p aria-live="polite" className="text-muted-foreground text-s">
				{resultLabel}
			</p>

			<div className="flex flex-wrap items-center gap-3">
				<p className="@lg:block hidden text-muted-foreground text-s">↑↓ to move, Enter to open</p>

				<button
					className="inline-flex @lg:hidden min-h-11 items-center rounded-md border border-shell-border px-3 text-m text-panel-foreground outline-none hover:border-primary-subtle-border focus-visible:ring-[3px] focus-visible:ring-primary/20"
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
	);
}

function actionWorkNav(items: FindItem[], session: ActionFindSession) {
	return (
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
	);
}

function actionFilterFields(session: ActionFindSession) {
	return (
		<div className={getActionFilterPanelClassName(session.filtersOpen)}>
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
	);
}

function actionNoMatches(session: ActionFindSession) {
	return (
		<FindEmptyState
			title="No results"
			actionLabel="Reset search"
			detail={
				session.query.query
					? `No matches for “${session.query.query}”. Try a client, vendor, owner, or status from this Company Workspace.`
					: "Nothing in this category matches the current filters."
			}
			onClear={session.clearAll}
		/>
	);
}

function actionResultList(session: ActionFindSession) {
	return (
		<div
			aria-busy={session.pending || undefined}
			className="overflow-hidden rounded-lg border border-shell-border"
			id="find-results"
		>
			<FindResultHeader />

			<ul className="divide-y divide-border">
				{session.results.map((item) => (
					<li key={item.id}>
						<FindResultRow
							item={item}
							highlightQuery={session.query.query}
							selected={session.selectedId === item.id}
							showColumns
							showKind
						/>
					</li>
				))}
			</ul>
		</div>
	);
}

function getWorkCategoryClassName(selected: boolean) {
	if (selected) {
		return "flex min-h-11 w-full items-center justify-between gap-3 rounded-md bg-primary-subtle px-3 text-left font-semibold text-m text-panel-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20";
	}

	return "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-m text-shell-muted outline-none hover:bg-shell-elevated hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20";
}

function getActionFilterPanelClassName(filtersOpen: boolean) {
	if (filtersOpen) {
		return "space-y-4 rounded-lg border @lg:border-0 border-shell-border @lg:p-0 p-4";
	}

	return "hidden space-y-4 @lg:block";
}
