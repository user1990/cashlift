"use client";

import type { LucideIcon } from "lucide-react";
import {
	ArrowRightLeft,
	CalendarCheck,
	CircleDollarSign,
	CreditCard,
	FolderOpen,
	Scissors,
	SearchCheck,
} from "lucide-react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { getFindOptionId } from "./findDom";
import {
	ACTION_CATEGORY_IDS,
	type FindExample,
	type FindItem,
	type FindWork,
	getFindExamples,
	WORK_LABELS,
} from "./findModel";
import { FindCategoryChip, FindEmptyState, FindResultRow, FindSearchField, FindShortcutFooter } from "./findUi";
import type { useFindSession } from "./useFindSession";

type WorkspaceFindSession = ReturnType<typeof useFindSession>;

type WorkspaceFindCommandPaletteProps = {
	items: FindItem[];
	session: WorkspaceFindSession;
};

const WORK_EXAMPLE_ICONS: Record<FindWork, LucideIcon> = {
	approve: SearchCheck,
	collect: CircleDollarSign,
	cut: Scissors,
	pay: CreditCard,
	review: FolderOpen,
};

export const WorkspaceFindCommandPalette = ({ items, session }: WorkspaceFindCommandPaletteProps) => {
	const examples = getFindExamples(items, "work");
	const hasQuery = Boolean(session.query.query.trim());
	const showExamples = !hasQuery && !session.hasFilters;
	const showResults = hasQuery || session.hasFilters || session.query.category !== "all";
	const showEmpty = showResults && session.results.length === 0;

	return (
		<ModalOverlay
			className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-[12vh] backdrop-blur-[2px]"
			isDismissable
			isOpen={session.open}
			onOpenChange={(nextOpen) => {
				if (nextOpen) {
					session.openPalette();
					return;
				}

				session.closePalette();
			}}
		>
			<Modal className="w-full max-w-2xl outline-none">
				<Dialog
					aria-label="Search Company Workspace"
					className="overflow-hidden rounded-2xl border border-white/15 bg-panel/95 text-panel-foreground shadow-[0_24px_80px_rgb(15_23_42/0.35)] outline-none backdrop-blur-2xl"
				>
					<div className="border-white/10 border-b px-4 py-3">
						<FindSearchField
							glass
							hideShortcut
							id="workspace-find-command"
							inputRef={session.inputRef}
							onChange={(value) => session.updateQuery({ query: value })}
							onKeyDown={session.handleSearchKeyDown}
							placeholder="Search for anything"
							activeOptionId={session.selectedId ? `find-option-${session.selectedId}` : undefined}
							hasPopup={showResults && session.results.length > 0}
							value={session.query.query}
						/>
					</div>

					<div className="border-white/10 border-b px-4 py-3">
						<div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
							{ACTION_CATEGORY_IDS.map((category) => {
								const selected = session.query.category === category;
								const label = category === "all" ? "All" : WORK_LABELS[category as FindWork];

								return (
									<FindCategoryChip
										key={category}
										onClick={() => session.updateQuery({ category })}
										selected={selected}
									>
										{label}
									</FindCategoryChip>
								);
							})}
						</div>
					</div>

					<div className="max-h-[min(24rem,50vh)] overflow-y-auto" id="find-results">
						<div aria-live="polite" className="sr-only">
							{`${session.results.length} ${session.results.length === 1 ? "result" : "results"}`}
						</div>

						{showEmpty && (
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
						)}

						{showExamples && (
							<div className="divide-y divide-white/10">
								<div className="px-4 py-2">
									<p className="font-semibold text-muted-foreground text-s">Examples</p>
								</div>

								{examples.map((example) => (
									<FindExampleRow
										example={example}
										key={example.id}
										onSelect={() => applyFindExample(example, session)}
									/>
								))}

								{session.recentSearches.map((recentSearch) => (
									<FindExampleRow
										example={{
											category: "all",
											hint: "Recent search",
											id: `recent-${recentSearch}`,
											label: recentSearch,
										}}
										icon={ArrowRightLeft}
										key={`recent-${recentSearch}`}
										onSelect={() => session.applySearch(recentSearch)}
									/>
								))}
							</div>
						)}

						{showResults && session.results.length > 0 && (
							<div className="divide-y divide-white/10" role="listbox">
								{session.results.map((item) => (
									<div
										aria-selected={session.selectedId === item.id}
										id={getFindOptionId(item.id)}
										key={item.id}
										role="option"
										tabIndex={-1}
									>
										<FindResultRow
											glass
											highlightQuery={session.query.query}
											item={item}
											selected={session.selectedId === item.id}
											showKind
										/>
									</div>
								))}
							</div>
						)}
					</div>

					<FindShortcutFooter />
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
};

type FindExampleRowProps = {
	example: FindExample;
	icon?: LucideIcon;
	onSelect: () => void;
};

const FindExampleRow = ({
	example,
	icon: Icon = WORK_EXAMPLE_ICONS[example.category as FindWork] ?? CalendarCheck,
	onSelect,
}: FindExampleRowProps) => (
	<div role="presentation">
		<button
			className="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left outline-none transition-[background-color] duration-150 hover:bg-white/5 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none"
			onClick={onSelect}
			type="button"
		>
			<span className="flex min-w-0 items-center gap-3">
				<span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-muted-foreground">
					<Icon aria-hidden className="size-4" />
				</span>

				<span className="min-w-0">
					<span className="block truncate font-medium text-m text-panel-foreground">{example.label}</span>

					{example.hint && <span className="mt-0.5 block truncate text-muted-foreground text-s">{example.hint}</span>}
				</span>
			</span>
		</button>
	</div>
);

function applyFindExample(example: FindExample, session: WorkspaceFindSession) {
	if (example.query) {
		session.applySearch(example.query);
		return;
	}

	session.updateQuery({ category: example.category, query: "" });
}
