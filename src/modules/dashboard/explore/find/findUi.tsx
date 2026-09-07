import { Search } from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent, ReactNode, RefObject } from "react";
import { cn } from "@/ui/utils/cn";
import { type FindItem, formatFindAmount, formatFindDueDate } from "./findModel";

type FindSearchFieldProps = {
	id: string;
	inputRef: RefObject<HTMLInputElement | null>;
	onChange: (value: string) => void;
	onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	value: string;
	activeOptionId?: string;
	glass?: boolean;
	hideShortcut?: boolean;
	placeholder?: string;
};

export const FindSearchField = ({
	id,
	inputRef,
	onChange,
	onKeyDown,
	value,
	activeOptionId,
	glass = false,
	hideShortcut = false,
	placeholder = "Search invoices, vendors, spend requests…",
}: FindSearchFieldProps) => (
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
			aria-activedescendant={activeOptionId}
			aria-controls="find-results"
			aria-expanded="true"
			autoComplete="off"
			className={cn(
				"h-12 w-full rounded-lg border py-3 text-l text-panel-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20",
				hideShortcut ? "pr-4 pl-10" : "pr-20 pl-10",
				glass ? "border-white/30 bg-panel/35 backdrop-blur-xl" : "border-shell-border bg-shell-elevated",
			)}
			id={id}
			onChange={(event) => onChange(event.currentTarget.value)}
			onKeyDown={onKeyDown}
			placeholder={placeholder}
			role="combobox"
			spellCheck={false}
			type="search"
			value={value}
		/>

		{!hideShortcut && (
			<kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-shell-border px-1.5 font-mono text-muted-foreground text-s sm:inline">
				⌘K
			</kbd>
		)}
	</div>
);

type FindCategoryChipProps = {
	children: ReactNode;
	onClick: () => void;
	selected?: boolean;
};

export const FindCategoryChip = ({ children, onClick, selected = false }: FindCategoryChipProps) => (
	<button
		aria-pressed={selected}
		className={cn(
			"inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-full border px-3 text-m outline-none transition-[background-color,border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20 motion-reduce:transition-none",
			selected
				? "border-primary/40 bg-primary/15 font-semibold text-panel-foreground"
				: "border-transparent text-shell-muted hover:bg-white/5 hover:text-panel-foreground",
		)}
		onClick={onClick}
		type="button"
	>
		{children}
	</button>
);

type FindShortcutFooterProps = {
	className?: string;
};

export const FindShortcutFooter = ({ className }: FindShortcutFooterProps) => (
	<div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 border-white/10 border-t px-4 py-3", className)}>
		<FindShortcutHint keys={["↑", "↓"]} label="Navigate" />

		<FindShortcutHint keys={["↵"]} label="Open page" />

		<FindShortcutHint keys={["esc"]} label="Close" />
	</div>
);

type FindShortcutHintProps = {
	keys: string[];
	label: string;
};

const FindShortcutHint = ({ keys, label }: FindShortcutHintProps) => (
	<div className="inline-flex items-center gap-2 text-muted-foreground text-s">
		<span className="inline-flex items-center gap-1">
			{keys.map((key) => (
				<kbd
					className="inline-flex min-w-5 items-center justify-center rounded border border-shell-border px-1 font-mono text-[0.6875rem] leading-none"
					key={key}
				>
					{key}
				</kbd>
			))}
		</span>

		<span>{label}</span>
	</div>
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
	glass?: boolean;
	highlightQuery?: string;
	selected?: boolean;
	showColumns?: boolean;
	showKind?: boolean;
};

export const FindResultRow = ({
	item,
	glass = false,
	highlightQuery = "",
	selected = false,
	showColumns = false,
	showKind = true,
}: FindResultRowProps) => {
	const dueLabel = formatFindDueDate(item.dueDate);

	return (
		<Link
			aria-current={selected ? "true" : undefined}
			href={item.actionHref}
			className={cn(
				"grid min-h-11 items-center gap-x-4 gap-y-1 border-transparent border-l-2 px-3 py-3 outline-none transition-[background-color,border-color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/20",
				showColumns
					? "@xl:grid-cols-[minmax(0,1.5fr)_7.5rem_6.5rem_6rem_auto] grid-cols-[minmax(0,1fr)_auto]"
					: "grid-cols-[minmax(0,1fr)_auto]",
				selected
					? "border-primary bg-primary-subtle"
					: glass
						? "hover:border-primary/40 hover:bg-white/5"
						: "hover:border-primary/40 hover:bg-shell-elevated",
				selected && glass && "bg-white/10",
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

export const FindResultHeader = ({ glass = false }: { glass?: boolean }) => (
	<div
		className={cn(
			"@xl:grid hidden grid-cols-[minmax(0,1.5fr)_7.5rem_6.5rem_6rem_auto] gap-4 border-b px-3 py-2 text-muted-foreground text-s",
			glass ? "border-white/10" : "border-border",
		)}
	>
		<span>Item</span>

		<span>Owner</span>

		<span>Status</span>

		<span>Due</span>

		<span className="text-right">Amount</span>
	</div>
);

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
