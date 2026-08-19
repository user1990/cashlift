import { type FindItem, groupFindItems } from "./findModel";
import { FindEmptyState, FindRecentList, FindResultRow, FindSearchField, FindSuggestionList } from "./findUi";
import { useFindSession } from "./useFindSession";

type CommandFindProps = {
	items: FindItem[];
};

export const CommandFind = ({ items }: CommandFindProps) => {
	const session = useFindSession(items, "kind");
	const groups = groupFindItems(session.results);
	const showIdle = !session.query.query && !session.hasFilters;
	const noMatches = !showIdle && session.results.length === 0 && !session.pending;
	const suggested = items.filter((item) => item.kind === "cash-action").slice(0, 3);

	return (
		<div className="mx-auto max-w-3xl">
			<FindSearchField
				id="find-search"
				inputRef={session.inputRef}
				onChange={(value) => session.updateQuery({ query: value })}
				onKeyDown={session.handleSearchKeyDown}
				placeholder="Jump to a client, vendor, request, or Cash Action…"
				value={session.query.query}
			/>

			<FindSuggestionList onSelect={session.applySearch} suggestions={session.suggestions} />

			{!session.query.query && (
				<FindRecentList onSelect={session.applySearch} recentSearches={session.recentSearches} />
			)}

			<div className="mt-4 flex flex-wrap gap-2">
				{session.statuses.map((status) => {
					const selected = session.query.status === status;

					return (
						<button
							key={status}
							aria-pressed={selected}
							className={
								selected
									? "inline-flex min-h-11 items-center rounded-md border border-primary/40 bg-primary-subtle px-3 text-m text-panel-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
									: "inline-flex min-h-11 items-center rounded-md border border-shell-border px-3 text-m text-shell-muted outline-none hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
							}
							onClick={() => session.updateQuery({ status: selected ? "" : status })}
							type="button"
						>
							status:{status}
						</button>
					);
				})}

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

			{session.pending && session.results.length === 0 && (
				<p className="mt-4 text-muted-foreground text-s" role="status">
					Updating…
				</p>
			)}

			{showIdle && (
				<>
					<p className="mt-6 text-m text-muted-foreground">
						Start typing. Arrow keys move. Enter opens the matching workspace route.
					</p>

					{suggested.length > 0 && (
						<section className="mt-6">
							<h2 className="text-muted-foreground text-s">Suggested</h2>

							<ul className="mt-2 divide-y divide-border" id="find-results">
								{suggested.map((item) => (
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
					)}
				</>
			)}

			{noMatches && (
				<div className="mt-6">
					<FindEmptyState
						title={`No matches for “${session.query.query}”`}
						detail="Commands only search the current Company Workspace dataset."
						onClear={session.clearAll}
					/>
				</div>
			)}

			{!showIdle && groups.length > 0 && (
				<div className="mt-6 space-y-5" id="find-results">
					{groups.map((group) => (
						<section key={group.id}>
							<h2 className="text-muted-foreground text-s">{group.label}</h2>

							<ul className="mt-2 divide-y divide-border">
								{group.items.map((item) => (
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
			)}
		</div>
	);
};
