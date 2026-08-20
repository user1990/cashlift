import { FindEmptyState, FindLoadingState, FindResultHeader, FindResultRow } from "./findUi";
import type { useFindSession } from "./useFindSession";

type WorkspaceFindSession = ReturnType<typeof useFindSession>;

type WorkspaceFindResultsProps = {
	itemsCount: number;
	session: WorkspaceFindSession;
};

export const WorkspaceFindResults = ({ itemsCount, session }: WorkspaceFindResultsProps) => {
	const emptyCatalog = itemsCount === 0;
	const noMatches = !emptyCatalog && session.results.length === 0 && !session.pending;
	const showSkeleton = session.pending && session.results.length === 0;

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
			<FindLoadingState columns glass visible={showSkeleton} />

			{session.results.length > 0 && (
				<div aria-busy={session.pending || undefined} className="min-w-0" id="find-results">
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
