import { FindEmptyState, FindResultHeader, FindResultRow } from "./findUi";
import type { useFindSession } from "./useFindSession";

type WorkspaceFindSession = ReturnType<typeof useFindSession>;

type WorkspaceFindResultsProps = {
	itemsCount: number;
	session: WorkspaceFindSession;
};

export const WorkspaceFindResults = ({ itemsCount, session }: WorkspaceFindResultsProps) => {
	const emptyCatalog = itemsCount === 0;
	const noMatches = !emptyCatalog && session.results.length === 0;

	if (emptyCatalog) {
		return <FindEmptyState title="No workspace items to search yet." />;
	}

	if (noMatches) {
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

	return (
		<>
			<div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
				<p aria-live="polite" className="text-muted-foreground text-s">
					{`${session.results.length} ${session.results.length === 1 ? "result" : "results"}`}
				</p>

				<button
					className="inline-flex min-h-11 items-center text-m text-muted-foreground outline-none hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
					onClick={session.clearAll}
					type="button"
				>
					Clear all
				</button>
			</div>

			{session.results.length > 0 && (
				<div className="min-w-0" id="find-results">
					<FindResultHeader glass />

					<ul className="divide-y divide-white/10">
						{session.results.map((item) => (
							<li key={item.id}>
								<FindResultRow
									glass
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
			)}
		</>
	);
};
