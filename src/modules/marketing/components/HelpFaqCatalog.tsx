"use client";

import {
	BanknoteArrowUp,
	ChartSpline,
	ChevronRight,
	CornerDownLeft,
	CreditCard,
	FileQuestion,
	LifeBuoy,
	Search,
	SearchX,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/ui/utils/cn";
import type { HelpFaqIconName } from "../content";
import { filterHelpFaqGroups, type HelpFaqGroupLike, type HelpFaqItemLike, parseHelpFaqQuery } from "../utils";
import { HelpContactPanel } from "./HelpContactPanel";

const HELP_FAQ_SEARCH_ID = "help-faq-search";
const HELP_FAQ_DIALOG_ID = "help-faq-dialog";
const HELP_FAQ_DIALOG_TITLE_ID = "help-faq-dialog-title";
const HELP_FAQ_RESULTS_ID = "help-faq-results";

type HelpFaqCatalogProps = {
	groups: readonly HelpFaqGroupLike[];
	initialQuery?: string;
};

type HelpFaqResult = HelpFaqItemLike & {
	groupName: string;
	icon?: HelpFaqGroupLike["icon"];
	id: string;
};

export const HelpFaqCatalog = ({ groups, initialQuery = "" }: HelpFaqCatalogProps) => {
	const [query, setQuery] = useState(() => parseHelpFaqQuery(initialQuery));
	const [isPaletteOpen, setIsPaletteOpen] = useState(() => Boolean(parseHelpFaqQuery(initialQuery)));
	const [activeResultIndex, setActiveResultIndex] = useState(0);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const wasPaletteOpenRef = useRef(false);
	const filteredGroups = filterHelpFaqGroups(groups, query);
	const results = flattenHelpFaqGroups(filteredGroups);
	const visibleActiveResultIndex = Math.min(activeResultIndex, Math.max(results.length - 1, 0));
	const activeResult = results[visibleActiveResultIndex];
	const activeResultId = activeResult?.id;

	useEffect(() => {
		if (!isPaletteOpen || !activeResultId) {
			return;
		}

		const activeResultElement = resultRefs.current[visibleActiveResultIndex];

		if (typeof activeResultElement?.scrollIntoView === "function") {
			activeResultElement.scrollIntoView({ block: "nearest" });
		}
	}, [activeResultId, isPaletteOpen, visibleActiveResultIndex]);

	useEffect(() => {
		if (!isPaletteOpen) {
			if (wasPaletteOpenRef.current) {
				window.requestAnimationFrame(() => triggerRef.current?.focus());
			}

			wasPaletteOpenRef.current = false;
			return;
		}

		wasPaletteOpenRef.current = true;
		searchRef.current?.focus();
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isPaletteOpen]);

	const updateQuery = (nextQuery: string) => {
		const normalizedQuery = parseHelpFaqQuery(nextQuery);
		setQuery(normalizedQuery);
		setActiveResultIndex(0);

		if (typeof window === "undefined") {
			return;
		}

		const nextUrl = new URL(window.location.href);

		if (normalizedQuery) {
			nextUrl.searchParams.set("q", normalizedQuery);
		} else {
			nextUrl.searchParams.delete("q");
		}

		window.history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
	};

	const openPalette = () => setIsPaletteOpen(true);
	const closePalette = () => setIsPaletteOpen(false);
	const activateResult = (resultIndex: number) => resultRefs.current[resultIndex]?.click();

	useEffect(() => {
		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setIsPaletteOpen((isOpen) => !isOpen);
			}
		};

		window.addEventListener("keydown", handleGlobalKeyDown);

		return () => window.removeEventListener("keydown", handleGlobalKeyDown);
	}, []);

	return (
		<section aria-labelledby="help-faq-catalog-title" className="mt-10 scroll-mt-24">
			<h2 id="help-faq-catalog-title" className="sr-only">
				Help FAQ search
			</h2>

			<SearchTrigger onClick={openPalette} query={query} triggerRef={triggerRef} />

			<HelpContactPanel />

			{isPaletteOpen && (
				<HelpFaqPalette
					activeResult={activeResult}
					activeResultIndex={visibleActiveResultIndex}
					closePalette={closePalette}
					dialogRef={dialogRef}
					filteredGroups={filteredGroups}
					onResultFocus={(resultIndex) => setActiveResultIndex(resultIndex)}
					setResultRef={(resultIndex, element) => {
						resultRefs.current[resultIndex] = element;
					}}
					onKeyDown={(event) => {
						if (event.key === "ArrowDown") {
							event.preventDefault();

							if (results.length > 0) {
								setActiveResultIndex((currentIndex) => (currentIndex + 1) % results.length);
							}
						}

						if (event.key === "ArrowUp") {
							event.preventDefault();

							if (results.length > 0) {
								setActiveResultIndex((currentIndex) => (currentIndex - 1 + results.length) % results.length);
							}
						}

						if (event.key === "Enter") {
							event.preventDefault();
							if (activeResult) {
								activateResult(visibleActiveResultIndex);
							}
						}
					}}
					query={query}
					results={results}
					searchRef={searchRef}
					updateQuery={updateQuery}
				/>
			)}
		</section>
	);
};

function SearchTrigger({
	onClick,
	query,
	triggerRef,
}: {
	onClick: () => void;
	query: string;
	triggerRef: RefObject<HTMLButtonElement | null>;
}) {
	return (
		<button
			ref={triggerRef}
			type="button"
			aria-controls={HELP_FAQ_DIALOG_ID}
			aria-haspopup="dialog"
			aria-label={query ? `Open Help search for ${query}` : "Open Help search"}
			onClick={onClick}
			className="group relative isolate flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-xl border border-primary-subtle-border/70 bg-shell-elevated/45 px-4 text-left shadow-[inset_0_1px_0_rgb(255_255_255_/_0.07),0_18px_42px_rgb(0_0_0_/_0.24)] outline-none backdrop-blur-md transition-[border-color,box-shadow] duration-150 before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-r before:from-primary/10 before:via-transparent before:to-warning/10 before:content-[''] hover:border-primary focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25 motion-reduce:transition-none"
		>
			<span className="relative z-1 flex min-w-0 items-center gap-3 text-m text-shell-muted sm:text-l">
				<Search
					aria-hidden
					className="size-5 shrink-0 text-shell-muted transition-colors duration-150 group-hover:text-primary group-focus-visible:text-primary motion-reduce:transition-none"
				/>

				<span className="truncate">{query || "Search help"}</span>
			</span>

			<span className="relative z-1 flex shrink-0 items-center gap-2 text-primary">
				<span className="hidden items-center gap-1 font-mono text-s text-shell-muted md:inline-flex">
					<kbd className="rounded border border-shell-border px-1.5 py-0.5">⌘</kbd>

					<kbd className="rounded border border-shell-border px-1.5 py-0.5">K</kbd>
				</span>

				<span
					aria-hidden
					className="text-xl leading-none transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
				>
					→
				</span>
			</span>
		</button>
	);
}

function HelpFaqPalette({
	activeResult,
	activeResultIndex,
	closePalette,
	dialogRef,
	filteredGroups,
	onResultFocus,
	onKeyDown,
	query,
	results,
	searchRef,
	setResultRef,
	updateQuery,
}: {
	activeResult: HelpFaqResult | undefined;
	activeResultIndex: number;
	closePalette: () => void;
	dialogRef: RefObject<HTMLDialogElement | null>;
	filteredGroups: readonly HelpFaqGroupLike[];
	onResultFocus: (resultIndex: number) => void;
	onKeyDown: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
	query: string;
	results: readonly HelpFaqResult[];
	searchRef: RefObject<HTMLInputElement | null>;
	setResultRef: (resultIndex: number, element: HTMLAnchorElement | null) => void;
	updateQuery: (query: string) => void;
}) {
	const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
		if (event.key === "Escape") {
			event.preventDefault();
			closePalette();
			return;
		}

		if (event.key !== "Tab") {
			return;
		}

		const focusableElements = Array.from(
			dialogRef.current?.querySelectorAll<HTMLElement>(
				"input:not([disabled]), button:not([disabled]):not([tabindex='-1']), a[href]:not([tabindex='-1'])",
			) ?? [],
		);
		const firstFocusableElement = focusableElements[0];
		const lastFocusableElement = focusableElements.at(-1);

		if (!firstFocusableElement || !lastFocusableElement) {
			return;
		}

		if (event.shiftKey && document.activeElement === firstFocusableElement) {
			event.preventDefault();
			lastFocusableElement.focus();
			return;
		}

		if (!event.shiftKey && document.activeElement === lastFocusableElement) {
			event.preventDefault();
			firstFocusableElement.focus();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			id={HELP_FAQ_DIALOG_ID}
			open
			aria-modal="true"
			aria-labelledby={HELP_FAQ_DIALOG_TITLE_ID}
			onKeyDown={handleDialogKeyDown}
			className="fixed inset-0 z-50 m-0 flex h-dvh w-dvw max-w-none items-center justify-center border-0 bg-shell/75 p-4 backdrop-blur-md motion-reduce:backdrop-blur-none max-md:items-stretch max-md:p-0"
		>
			<button
				type="button"
				tabIndex={-1}
				aria-label="Dismiss Help search backdrop"
				onClick={closePalette}
				className="absolute inset-0 cursor-default"
			/>

			<div className="relative isolate flex h-[min(760px,calc(100dvh-2rem))] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-primary-subtle-border/70 bg-shell-elevated/90 text-shell-foreground shadow-[inset_0_1px_0_rgb(255_255_255_/_0.1),0_30px_90px_rgb(0_0_0_/_0.55)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-br before:from-primary/8 before:via-transparent before:to-warning/8 before:content-[''] max-md:h-full max-md:max-w-none max-md:rounded-none max-md:border-x-0 max-md:border-b-0">
				<div className="relative z-1 flex min-h-16 items-center gap-3 border-shell-border border-b bg-shell/45 px-5 max-md:px-4">
					<Search aria-hidden className="size-5 shrink-0 text-primary" />

					<h2 id={HELP_FAQ_DIALOG_TITLE_ID} className="sr-only">
						Search Help FAQs
					</h2>

					<input
						ref={searchRef}
						id={HELP_FAQ_SEARCH_ID}
						type="text"
						role="combobox"
						value={query}
						onChange={(event) => updateQuery(event.target.value)}
						onKeyDown={onKeyDown}
						placeholder="Search help…"
						autoComplete="off"
						aria-label="Search Help FAQs"
						aria-controls={HELP_FAQ_RESULTS_ID}
						aria-expanded="true"
						aria-autocomplete="list"
						aria-activedescendant={activeResult ? resultDomId(activeResult.id) : undefined}
						className="min-w-0 flex-1 border-0 bg-transparent text-base text-shell-foreground outline-none placeholder:text-shell-muted focus:ring-0 sm:text-l"
					/>

					<button
						type="button"
						aria-label="Close Help search"
						title="Close Help search"
						onClick={closePalette}
						className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-shell-muted outline-none transition-[background-color,color] duration-150 hover:bg-primary/10 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/25 motion-reduce:transition-none"
					>
						<X aria-hidden className="size-5" />
					</button>
				</div>

				<div
					id={HELP_FAQ_RESULTS_ID}
					role="listbox"
					aria-label="Help FAQ results"
					className="relative z-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5"
				>
					{filteredGroups.length > 0 ? (
						filteredGroups.map((group) => (
							<div key={group.name} className="not-first:mt-5">
								<p className="px-3 pb-2 font-mono font-semibold text-primary text-s+ uppercase tracking-[0.16em]">
									{group.name}
								</p>

								{group.items.map((item) => {
									const result = findResult(results, group.name, item.question);
									const resultIndex = results.findIndex(({ id }) => id === result.id);
									const active = resultIndex === activeResultIndex;

									return (
										<Link
											key={result.id}
											href={helpFaqHref(result.slug, query)}
											ref={(element) => setResultRef(resultIndex, element)}
											tabIndex={0}
											role="option"
											id={resultDomId(result.id)}
											aria-selected={active}
											onFocus={() => onResultFocus(resultIndex)}
											className={cn(
												"group flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 focus-visible:border-warning/80 focus-visible:bg-warning/10 focus-visible:ring-[3px] focus-visible:ring-warning/25 motion-reduce:transition-none",
												active
													? "border-warning/80 bg-warning/10 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.07),0_0_28px_rgb(210_157_24_/_0.12)]"
													: "border-transparent hover:border-shell-border hover:bg-shell/35",
											)}
										>
											<span
												className={cn(
													"grid size-8 shrink-0 place-items-center rounded-md text-shell-muted transition-colors duration-150 motion-reduce:transition-none",
													active && "text-warning",
												)}
											>
												<HelpFaqIcon iconName={result.icon} />
											</span>

											<span className="min-w-0 flex-1">
												<span className="block truncate font-medium text-m text-shell-foreground">
													<HighlightText query={query} text={result.question} />
												</span>

												<span className="mt-1 line-clamp-2 block text-s text-shell-muted leading-5">
													<HighlightText query={query} text={result.answer} />
												</span>
											</span>

											<span
												className={cn(
													"grid size-9 shrink-0 place-items-center rounded-md text-shell-muted transition-[background-color,color] duration-150 motion-reduce:transition-none",
													active && "bg-warning text-shell",
												)}
											>
												{active ? (
													<CornerDownLeft aria-hidden className="size-4" />
												) : (
													<ChevronRight aria-hidden className="size-4" />
												)}
											</span>
										</Link>
									);
								})}
							</div>
						))
					) : (
						<EmptyState onClear={() => updateQuery("")} query={query} />
					)}
				</div>

				<div className="relative z-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-shell-border border-t bg-shell/45 px-5 py-3 text-s text-shell-muted max-md:px-4">
					<p aria-atomic="true" aria-live="polite" role="status" className="font-mono">
						{results.length} {results.length === 1 ? "answer" : "answers"}
					</p>

					<div className="flex flex-wrap items-center gap-3">
						{results.length > 0 && (
							<>
								<span className="hidden items-center gap-1 md:inline-flex">
									<kbd className="rounded border border-shell-border px-1.5 py-0.5">↑ ↓</kbd> Navigate
								</span>

								<span className="hidden items-center gap-1 md:inline-flex">
									<kbd className="rounded border border-shell-border px-1.5 py-0.5">↵</kbd> Open answer
								</span>
							</>
						)}

						<span className="inline-flex items-center gap-1">
							<kbd className="rounded border border-shell-border px-1.5 py-0.5">Esc</kbd> Close
						</span>
					</div>
				</div>
			</div>
		</dialog>
	);
}

function EmptyState({ onClear, query }: { onClear: () => void; query: string }) {
	return (
		<div className="flex h-full min-h-0 flex-col items-center justify-center rounded-xl border border-shell-border border-dashed bg-shell/25 px-6 py-10 text-center">
			<SearchX aria-hidden className="size-5 text-shell-muted" />

			<h3 className="mt-3 text-shell-foreground text-xl">No results for “{query}”</h3>

			<p className="mt-2 max-w-md text-m text-shell-muted leading-6">
				Try a shorter phrase or browse the Help answers without a search.
			</p>

			<button
				type="button"
				onClick={onClear}
				className="mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-md border border-shell-border px-4 font-medium text-m text-shell-foreground outline-none transition-[border-color,color] duration-150 hover:border-primary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/25 motion-reduce:transition-none"
			>
				Clear search
			</button>
		</div>
	);
}

function HighlightText({ query, text }: { query: string; text: string }) {
	const terms = query.split(/\s+/).filter(Boolean);
	const escapedTerms = terms.map((term) => escapeRegExp(term));

	if (terms.length === 0) {
		return text;
	}

	const parts = text.split(new RegExp(`(${escapedTerms.join("|")})`, "gi"));
	const occurrences = new Map<string, number>();

	return parts.map((part) => {
		const occurrence = occurrences.get(part) ?? 0;
		occurrences.set(part, occurrence + 1);

		return terms.some((term) => term.toLocaleLowerCase() === part.toLocaleLowerCase()) ? (
			<mark key={`${part}-${occurrence}`} className="rounded bg-primary/20 px-0.5 text-primary">
				{part}
			</mark>
		) : (
			part
		);
	});
}

function flattenHelpFaqGroups(groups: readonly HelpFaqGroupLike[]): HelpFaqResult[] {
	return groups.flatMap((group) =>
		group.items.map((item) => ({
			...item,
			groupName: group.name,
			icon: group.icon,
			id: `${slugify(group.name)}-${slugify(item.question)}`,
		})),
	);
}

function findResult(results: readonly HelpFaqResult[], groupName: string, question: string): HelpFaqResult {
	const result = results.find((item) => item.groupName === groupName && item.question === question);

	if (!result) {
		throw new Error(`Missing Help FAQ result for ${groupName}: ${question}`);
	}

	return result;
}

function resultDomId(id: string) {
	return `help-faq-result-${id}`;
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function helpFaqHref(slug: string, query: string) {
	const normalizedQuery = parseHelpFaqQuery(query);

	return normalizedQuery ? `/help/${slug}?q=${encodeURIComponent(normalizedQuery)}` : `/help/${slug}`;
}

function HelpFaqIcon({ iconName }: { iconName: HelpFaqIconName | undefined }) {
	switch (iconName) {
		case "banknote-arrow-up":
			return <BanknoteArrowUp aria-hidden className="size-4" />;
		case "chart-spline":
			return <ChartSpline aria-hidden className="size-4" />;
		case "credit-card":
			return <CreditCard aria-hidden className="size-4" />;
		case "life-buoy":
			return <LifeBuoy aria-hidden className="size-4" />;
		case "users":
			return <Users aria-hidden className="size-4" />;
		default:
			return <FileQuestion aria-hidden className="size-4" />;
	}
}

function slugify(value: string) {
	return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");
}
