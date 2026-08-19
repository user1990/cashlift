import { Search } from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
import { cn } from "@/ui/utils/cn";
import { type FindItem, formatFindAmount, formatFindDueDate } from "./findModel";

const FIND_SKELETON_ROW_IDS = ["alpha", "bravo", "charlie", "delta", "echo"] as const;

type FindSearchFieldProps = {
	id: string;
	inputRef: RefObject<HTMLInputElement | null>;
	onChange: (value: string) => void;
	onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	value: string;
	onSelectSuggestion?: (suggestion: string) => void;
	placeholder?: string;
	suggestions?: string[];
};

export const FindSearchField = ({
	id,
	inputRef,
	onChange,
	onKeyDown,
	value,
	onSelectSuggestion,
	placeholder = "Search invoices, vendors, spend requests…",
	suggestions = [],
}: FindSearchFieldProps) => {
	const suggestionsOpen = suggestions.length > 0 && value.trim().length > 0;
	const listboxId = `${id}-suggestions`;

	return (
		<div className="relative">
			<label className="sr-only" htmlFor={id}>
				Search Company Workspace
			</label>

			<Search
				aria-hidden
				className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>

			<input
				ref={inputRef}
				aria-autocomplete="list"
				aria-controls={suggestionsOpen ? listboxId : "find-results"}
				aria-expanded={suggestionsOpen}
				autoComplete="off"
				className="h-12 w-full rounded-lg border border-shell-border bg-shell-elevated py-3 pr-20 pl-10 text-l text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20"
				id={id}
				onChange={(event) => onChange(event.currentTarget.value)}
				onKeyDown={(event) => {
					if (event.key === "Tab" && !event.shiftKey && suggestions[0] && onSelectSuggestion) {
						event.preventDefault();
						onSelectSuggestion(suggestions[0]);
						return;
					}

					onKeyDown(event);
				}}
				placeholder={placeholder}
				role="combobox"
				spellCheck={false}
				type="search"
				value={value}
			/>

			<kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-shell-border px-1.5 font-mono text-muted-foreground text-s sm:inline">
				⌘K
			</kbd>

			{suggestionsOpen && onSelectSuggestion && (
				<div
					className="absolute z-20 mt-1 w-full rounded-lg border border-shell-border bg-shell-elevated p-1 shadow-panel"
					id={listboxId}
					role="listbox"
				>
					{suggestions.map((suggestion) => (
						<button
							key={suggestion}
							aria-selected="false"
							className="block min-h-11 w-full rounded-md px-3 text-left text-m text-panel-foreground outline-none hover:bg-primary-subtle focus-visible:ring-[3px] focus-visible:ring-primary/20"
							onClick={() => onSelectSuggestion(suggestion)}
							onMouseDown={(event) => event.preventDefault()}
							role="option"
							type="button"
						>
							{suggestion}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

type FindSuggestionListProps = {
	onSelect: (suggestion: string) => void;
	suggestions: string[];
};

export const FindSuggestionList = ({ onSelect, suggestions }: FindSuggestionListProps) => {
	if (!suggestions.length) {
		return;
	}

	return (
		<ul className="mt-2 flex flex-wrap gap-2">
			{suggestions.map((suggestion) => (
				<li key={suggestion}>
					<button
						className="inline-flex min-h-11 items-center rounded-md border border-shell-border px-3 text-m text-shell-muted outline-none hover:border-primary-subtle-border hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
						onClick={() => onSelect(suggestion)}
						type="button"
					>
						{suggestion}
					</button>
				</li>
			))}
		</ul>
	);
};

type FindRecentListProps = {
	onSelect: (query: string) => void;
	recentSearches: string[];
};

export const FindRecentList = ({ onSelect, recentSearches }: FindRecentListProps) => {
	if (!recentSearches.length) {
		return;
	}

	return (
		<div className="mt-3">
			<p className="text-muted-foreground text-s">Recent</p>

			<ul className="mt-1 flex flex-wrap gap-x-4">
				{recentSearches.map((recentSearch) => (
					<li key={recentSearch}>
						<button
							className="inline-flex min-h-11 items-center text-m text-panel-foreground outline-none hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
							onClick={() => onSelect(recentSearch)}
							type="button"
						>
							{recentSearch}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

type FindFilterButtonProps = {
	children: ReactNode;
	onClick: () => void;
	selected?: boolean;
};

export const FindFilterButton = ({ children, onClick, selected = false }: FindFilterButtonProps) => (
	<button
		aria-pressed={selected}
		className={
			selected
				? "inline-flex min-h-11 items-center border-primary border-b-2 px-1 font-semibold text-m text-panel-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
				: "inline-flex min-h-11 items-center border-transparent border-b-2 px-1 text-m text-shell-muted outline-none hover:text-panel-foreground focus-visible:ring-[3px] focus-visible:ring-primary/20"
		}
		onClick={onClick}
		type="button"
	>
		{children}
	</button>
);

type FindEmptyStateProps = {
	title: string;
	actionLabel?: string;
	detail?: string;
	onClear?: () => void;
};

export const FindEmptyState = ({ title, actionLabel = "Clear all", detail, onClear }: FindEmptyStateProps) => (
	<div className="px-1 py-10">
		<p className="font-semibold text-m+ text-panel-foreground">{title}</p>

		{detail && <p className="mt-2 max-w-lg text-m text-muted-foreground leading-6">{detail}</p>}

		{onClear && (
			<button
				className="mt-4 inline-flex min-h-11 items-center font-semibold text-m text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-primary/20"
				onClick={onClear}
				type="button"
			>
				{actionLabel}
			</button>
		)}
	</div>
);

type FindResultRowProps = {
	item: FindItem;
	highlightQuery?: string;
	selected?: boolean;
	showColumns?: boolean;
	showKind?: boolean;
};

export const FindResultRow = ({
	item,
	highlightQuery = "",
	selected = false,
	showColumns = false,
	showKind = true,
}: FindResultRowProps) => {
	const dueLabel = formatFindDueDate(item.dueDate);
	const optionId = getFindOptionId(item.id);

	return (
		<Link
			aria-current={selected ? "true" : undefined}
			href={item.actionHref}
			id={optionId}
			className={cn(
				"grid min-h-11 items-center gap-x-4 gap-y-1 border-transparent border-l-2 px-3 py-3 outline-none transition-[background-color,border-color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20",
				showColumns
					? "@xl:grid-cols-[minmax(0,1.5fr)_7.5rem_6.5rem_6rem_auto] grid-cols-[minmax(0,1fr)_auto]"
					: "grid-cols-[minmax(0,1fr)_auto]",
				selected ? "border-primary bg-primary-subtle" : "hover:border-primary/40 hover:bg-shell-elevated",
			)}
		>
			<span className="min-w-0">
				<span className="block truncate font-semibold text-m+ text-panel-foreground">
					{highlightFindText(item.title, highlightQuery)}
				</span>

				<span className="mt-1 block truncate text-muted-foreground text-s">
					{showKind ? `${item.kindLabel} · ` : ""}
					{highlightFindText(item.subtitle, highlightQuery)}
					{showColumns ? "" : dueLabel ? ` · ${dueLabel}` : ""}
				</span>
			</span>

			{showColumns && (
				<>
					<span className="@xl:block hidden truncate text-muted-foreground text-s">{item.owner}</span>

					<span className="@xl:block hidden truncate text-muted-foreground text-s">{item.status}</span>

					<span className="@xl:block hidden truncate text-muted-foreground text-s">{dueLabel ?? "—"}</span>
				</>
			)}

			<span className="flex shrink-0 flex-col items-end gap-1">
				<span className="font-mono font-semibold text-m text-panel-foreground tabular-nums">
					{formatFindAmount(item.amountCents)}
				</span>

				<span className="text-primary text-s">{item.actionLabel}</span>
			</span>
		</Link>
	);
};

export const FindResultHeader = () => (
	<div className="@xl:grid hidden grid-cols-[minmax(0,1.5fr)_7.5rem_6.5rem_6rem_auto] gap-4 border-border border-b px-3 py-2 text-muted-foreground text-s">
		<span>Item</span>

		<span>Owner</span>

		<span>Status</span>

		<span>Due</span>

		<span className="text-right">Amount</span>
	</div>
);

type FindLoadingStateProps = {
	columns?: boolean;
	visible?: boolean;
};

export const FindLoadingState = ({ columns = false, visible = false }: FindLoadingStateProps) => {
	if (!visible) {
		return;
	}

	return (
		<ul
			aria-busy="true"
			aria-label="Loading results"
			className="divide-y divide-border overflow-hidden rounded-lg border border-shell-border"
			role="status"
		>
			{FIND_SKELETON_ROW_IDS.map((rowId) => (
				<li className="px-3 py-3" key={rowId}>
					<div
						className={
							columns
								? "grid @xl:grid-cols-[minmax(0,1.5fr)_7.5rem_6.5rem_6rem_auto] grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
								: "flex items-center justify-between gap-4"
						}
					>
						<span aria-hidden className="min-w-0 flex-1 animate-pulse space-y-2 motion-reduce:animate-none">
							<span className="block h-3 w-44 rounded bg-panel-muted" />

							<span className="block h-2.5 w-28 rounded bg-panel-muted" />
						</span>

						{columns && (
							<>
								<span
									aria-hidden
									className="@xl:block hidden h-2.5 w-16 animate-pulse rounded bg-panel-muted motion-reduce:animate-none"
								/>

								<span
									aria-hidden
									className="@xl:block hidden h-2.5 w-14 animate-pulse rounded bg-panel-muted motion-reduce:animate-none"
								/>

								<span
									aria-hidden
									className="@xl:block hidden h-2.5 w-12 animate-pulse rounded bg-panel-muted motion-reduce:animate-none"
								/>
							</>
						)}

						<span aria-hidden className="h-3 w-16 animate-pulse rounded bg-panel-muted motion-reduce:animate-none" />
					</div>
				</li>
			))}
		</ul>
	);
};

export const getFindOptionId = (itemId: string) => `find-option-${itemId}`;

function highlightFindText(text: string, query: string) {
	const needle = query.trim();

	if (!needle) {
		return text;
	}

	const start = text.toLowerCase().indexOf(needle.toLowerCase());

	if (start < 0) {
		return text;
	}

	const end = start + needle.length;

	return (
		<>
			{text.slice(0, start)}
			<mark className="rounded-sm bg-primary-subtle text-primary">{text.slice(start, end)}</mark>
			{text.slice(end)}
		</>
	);
}
