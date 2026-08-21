"use client";

import { Search as SearchIcon } from "lucide-react";
import { useId, useState } from "react";
import type { HelpFaqGroup } from "../content";
import { filterHelpFaqGroups } from "../utils";

const HELP_FAQ_RESULTS_ID = "help-faq-results";
const FEATURE_CELL_CLASS = "px-4 py-3 @md:px-5 @md:py-3.5";

type HelpFaqCatalogProps = {
	groups: readonly HelpFaqGroup[];
	query: string;
};

export const HelpFaqCatalog = ({ groups, query: initialQuery }: HelpFaqCatalogProps) => {
	const fieldId = useId();
	const [query, setQuery] = useState(initialQuery);
	const filteredGroups = filterHelpFaqGroups(groups, query);
	const matchCount = getHelpFaqMatchCount(filteredGroups);

	const updateQuery = (nextQuery: string) => {
		setQuery(nextQuery);
		replaceHelpFaqQuery(nextQuery);
	};

	return (
		<div className="@container mt-10">
			<search className="overflow-hidden rounded-lg border border-shell-border">
				<form action="/help" method="get" onSubmit={(event) => event.preventDefault()}>
					<div className="flex @md:flex-row flex-col @md:items-end @md:justify-between gap-3 border-shell-border border-b bg-shell-elevated px-4 py-4">
						<div className="min-w-0 flex-1 space-y-1.5">
							<label htmlFor={fieldId} className="font-medium text-s text-shell-foreground">
								Filter questions
							</label>

							<div className="relative">
								<SearchIcon
									aria-hidden
									className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-shell-muted"
								/>

								<input
									aria-controls={HELP_FAQ_RESULTS_ID}
									autoComplete="off"
									id={fieldId}
									name="q"
									placeholder="Search questions…"
									type="search"
									value={query}
									onChange={(event) => updateQuery(event.target.value)}
									className="h-11 w-full rounded-md border border-shell-border bg-shell/40 py-2 pr-3 pl-10 @md:text-m text-base text-shell-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-shell-muted focus:border-primary focus:ring-[3px] focus:ring-primary/20"
								/>
							</div>
						</div>

						<div className="flex items-center @md:justify-end justify-between gap-3">
							<p aria-live="polite" className="text-s text-shell-muted">
								{matchCount === 1 ? "1 question" : `${matchCount} questions`}
							</p>

							{query.trim() && (
								<button
									type="button"
									onClick={() => updateQuery("")}
									className="inline-flex min-h-11 cursor-pointer items-center rounded-md px-3 text-m text-shell-foreground outline-none transition-colors duration-150 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
								>
									Clear
								</button>
							)}
						</div>
					</div>
				</form>

				<div id={HELP_FAQ_RESULTS_ID} className="overflow-x-auto">
					{filteredGroups.length > 0 ? (
						<table className="w-full min-w-160 table-fixed border-separate border-spacing-0 text-left">
							<caption className="sr-only">Help questions grouped by topic</caption>

							<thead>
								<tr>
									<th
										scope="col"
										className={`${FEATURE_CELL_CLASS} w-[38%] border-shell-border border-b bg-shell-elevated font-medium text-s text-shell-muted`}
									>
										Question
									</th>

									<th
										scope="col"
										className={`${FEATURE_CELL_CLASS} border-shell-border border-b bg-shell-elevated font-medium text-s text-shell-muted`}
									>
										Answer
									</th>
								</tr>
							</thead>

							{filteredGroups.map(({ items, name }) => (
								<HelpFaqGroupRows key={name} items={items} name={name} />
							))}
						</table>
					) : (
						<p className="px-4 py-8 text-m text-shell-muted">No questions match this filter.</p>
					)}
				</div>
			</search>
		</div>
	);
};

type HelpFaqGroupRowsProps = {
	items: HelpFaqGroup["items"];
	name: string;
};

function HelpFaqGroupRows({ items, name }: HelpFaqGroupRowsProps) {
	return (
		<tbody>
			<tr>
				<th
					colSpan={2}
					scope="rowgroup"
					className={`${FEATURE_CELL_CLASS} border-shell-border border-t bg-primary/5 font-semibold text-primary text-s+`}
				>
					{name}
				</th>
			</tr>

			{items.map(({ answer, question }) => (
				<tr key={question}>
					<th scope="row" className={`${FEATURE_CELL_CLASS} wrap-break-word font-medium text-m text-shell-foreground`}>
						{question}
					</th>

					<td className={`${FEATURE_CELL_CLASS} wrap-break-word text-m text-shell-muted leading-6`}>{answer}</td>
				</tr>
			))}
		</tbody>
	);
}

function getHelpFaqMatchCount(groups: readonly HelpFaqGroup[]) {
	return groups.reduce((total, group) => total + group.items.length, 0);
}

function replaceHelpFaqQuery(query: string) {
	const url = new URL(window.location.href);
	const trimmed = query.trim();

	if (trimmed) {
		url.searchParams.set("q", trimmed);
	} else {
		url.searchParams.delete("q");
	}

	window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}
