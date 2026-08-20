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
import { cn } from "@/ui/utils/cn";
import {
	ACTION_CATEGORY_IDS,
	type FindExample,
	type FindItem,
	type FindWork,
	getFindExamples,
	WORK_LABELS,
} from "./findModel";
import {
	FindCategoryChip,
	FindEmptyState,
	FindLoadingState,
	FindResultRow,
	FindSearchField,
	FindShortcutFooter,
} from "./findUi";
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
	const showEmpty = showResults && !session.pending && session.results.length === 0;

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
							onSelectSuggestion={session.applySearch}
							placeholder="Search for anything"
							suggestions={session.suggestions}
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
							{session.pending ? "Updating results" : `${session.results.length} results`}
						</div>

						<FindLoadingState glass visible={session.pending && session.results.length === 0} />

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

						{showExamples && !session.pending && (
							<div className="divide-y divide-white/10" role="listbox">
								<div className="px-4 py-2">
									<p className="font-semibold text-muted-foreground text-s">Examples</p>
								</div>

								{examples.map((example, index) => (
									<FindExampleRow
										example={example}
										highlighted={session.selectedId === example.id}
										key={example.id}
										onSelect={() => applyFindExample(example, session)}
										optionId={`find-example-${index}`}
									/>
								))}

								{session.recentSearches.map((recentSearch, index) => (
									<FindExampleRow
										example={{
											category: "all",
											hint: "Recent search",
											id: `recent-${recentSearch}`,
											label: recentSearch,
										}}
										highlighted={session.selectedId === `recent-${recentSearch}`}
										icon={ArrowRightLeft}
										key={`recent-${recentSearch}`}
										onSelect={() => session.applySearch(recentSearch)}
										optionId={`find-recent-${index}`}
									/>
								))}
							</div>
						)}

						{showResults && session.results.length > 0 && (
							<div className="divide-y divide-white/10" role="listbox">
								{session.results.map((item) => (
									<div key={item.id} role="presentation">
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
	highlighted?: boolean;
	icon?: LucideIcon;
	onSelect: () => void;
	optionId: string;
};

const FindExampleRow = ({
	example,
	highlighted = false,
	icon: Icon = WORK_EXAMPLE_ICONS[example.category as FindWork] ?? CalendarCheck,
	onSelect,
	optionId,
}: FindExampleRowProps) => (
	<div role="presentation">
		<button
			aria-selected={highlighted}
			className={cn(
				"flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left outline-none transition-[background-color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
				highlighted ? "bg-primary-subtle" : "hover:bg-white/5",
			)}
			id={optionId}
			onClick={onSelect}
			role="option"
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

			{example.category !== "all" && <span className="shrink-0 text-muted-foreground text-s">Filter</span>}
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
