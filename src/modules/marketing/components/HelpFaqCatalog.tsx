"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/ui/utils/cn";
import { filterHelpFaqGroups, type HelpFaqGroupLike, parseHelpFaqQuery } from "../utils";
import { ActionLink } from "./ActionLink";

type HelpFaqCatalogProps = {
	groups: readonly HelpFaqGroupLike[];
	initialQuery?: string;
};

type HelpFaqVariant = "categories" | "highlight" | "mobile" | "contact" | "combined";

const HELP_FAQ_VARIANTS = [
	{
		description: "Jump to a topic, then narrow the same table with a phrase.",
		id: "categories",
		label: "1 · Category navigation",
	},
	{
		description: "Make the words that matched your query easy to scan in both columns.",
		id: "highlight",
		label: "2 · Match highlighting",
	},
	{
		description: "Keep the desktop table intact and switch small screens to readable stacked rows.",
		id: "mobile",
		label: "3 · Mobile rows",
	},
	{
		description: "Add a calm next step after the answers using the existing contact message.",
		id: "contact",
		label: "4 · Contact panel",
	},
	{
		description: "A combined direction: topics, highlights, mobile rows, and the contact next step.",
		id: "combined",
		label: "5 · Combined",
	},
] as const satisfies readonly { description: string; id: HelpFaqVariant; label: string }[];

export const HelpFaqCatalog = ({ groups, initialQuery = "" }: HelpFaqCatalogProps) => {
	const [query, setQuery] = useState(parseHelpFaqQuery(initialQuery));
	const [variant, setVariant] = useState<HelpFaqVariant>("categories");
	const filteredGroups = useMemo(() => filterHelpFaqGroups(groups, query), [groups, query]);
	const resultCount = filteredGroups.reduce((count, group) => count + group.items.length, 0);
	const activeVariant = HELP_FAQ_VARIANTS.find(({ id }) => id === variant) ?? HELP_FAQ_VARIANTS[0];
	const showCategoryLinks = variant === "categories" || variant === "combined";
	const showHighlights = variant === "highlight" || variant === "combined";
	const useStackedMobileRows = variant === "mobile" || variant === "combined";
	const showContactPanel = variant === "contact" || variant === "combined";

	const updateQuery = (nextQuery: string) => {
		const normalizedQuery = parseHelpFaqQuery(nextQuery);
		setQuery(normalizedQuery);

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

	const updateVariant = (nextVariant: HelpFaqVariant) => {
		setVariant(nextVariant);
	};

	return (
		<section aria-labelledby="help-faq-catalog-title" className="mt-12 scroll-mt-24">
			<CatalogHeader activeVariant={activeVariant} resultCount={resultCount} />

			<VariantTabs onChange={updateVariant} value={variant} />

			<div id="help-faq-catalog-panel" role="tabpanel" className="mt-6">
				<div className="rounded-lg border border-shell-border bg-shell-elevated/55 p-4 shadow-shell sm:p-5">
					<SearchField onChange={updateQuery} query={query} />

					<CatalogResults
						groups={groups}
						filteredGroups={filteredGroups}
						onClear={() => updateQuery("")}
						query={showHighlights ? query : ""}
						showCategoryLinks={showCategoryLinks}
						useStackedMobileRows={useStackedMobileRows}
					/>
				</div>
			</div>

			{showContactPanel ? <ContactPanel /> : null}
		</section>
	);
};

function CatalogHeader({
	activeVariant,
	resultCount,
}: {
	activeVariant: (typeof HELP_FAQ_VARIANTS)[number];
	resultCount: number;
}) {
	return (
		<div className="flex flex-col gap-5 border-shell-border border-y py-5 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p className="text-primary text-s+ uppercase tracking-normal">Prototype directions</p>

				<h2 id="help-faq-catalog-title" className="mt-2 text-3xl+ text-shell-foreground tracking-normal">
					Find an answer
				</h2>
			</div>

			<div className="max-w-xl lg:text-right">
				<p className="text-m text-shell-muted leading-6">{activeVariant.description}</p>

				<p aria-live="polite" className="mt-2 font-mono text-primary text-s+">
					{resultCount} {resultCount === 1 ? "match" : "matches"}
				</p>
			</div>
		</div>
	);
}

function VariantTabs({ onChange, value }: { onChange: (variant: HelpFaqVariant) => void; value: HelpFaqVariant }) {
	return (
		<div role="tablist" aria-label="FAQ catalog variants" className="mt-5 overflow-x-auto pb-1">
			<div className="flex min-w-max gap-2">
				{HELP_FAQ_VARIANTS.map(({ id, label }) => (
					<button
						key={id}
						type="button"
						role="tab"
						aria-controls="help-faq-catalog-panel"
						aria-selected={value === id}
						onClick={() => onChange(id)}
						className={cn(
							"min-h-11 rounded-md border px-3 font-medium text-m outline-none transition-[background-color,border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-primary/25",
							value === id
								? "border-primary bg-primary text-primary-foreground"
								: "border-shell-border bg-shell-elevated text-shell-muted hover:border-primary-subtle-border hover:text-shell-foreground",
						)}
					>
						{label}
					</button>
				))}
			</div>
		</div>
	);
}

function SearchField({ onChange, query }: { onChange: (query: string) => void; query: string }) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div className="min-w-0 flex-1">
				<label htmlFor="help-faq-search" className="text-m+ text-shell-foreground">
					Search help
				</label>

				<div className="relative mt-2">
					<Search
						aria-hidden
						className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-shell-muted"
					/>

					<input
						id="help-faq-search"
						value={query}
						onChange={(event) => onChange(event.target.value)}
						placeholder="Search questions, answers, or a topic"
						autoComplete="off"
						spellCheck="false"
						className="h-12 w-full rounded-md border border-shell-border bg-shell px-11 pr-12 text-base text-shell-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-shell-muted focus:border-primary focus:ring-[3px] focus:ring-primary/20"
					/>

					{query ? (
						<button
							type="button"
							aria-label="Clear help search"
							onClick={() => onChange("")}
							className="absolute top-1/2 right-1.5 grid size-11 -translate-y-1/2 place-items-center rounded-md text-shell-muted outline-none transition-colors duration-150 hover:text-shell-foreground focus-visible:ring-[3px] focus-visible:ring-primary/25"
						>
							<X aria-hidden className="size-5" />
						</button>
					) : null}
				</div>
			</div>

			<p className="shrink-0 text-m text-shell-muted sm:pb-3">Search includes topic names</p>
		</div>
	);
}

function CatalogResults({
	filteredGroups,
	groups,
	onClear,
	query,
	showCategoryLinks,
	useStackedMobileRows,
}: {
	filteredGroups: readonly HelpFaqGroupLike[];
	groups: readonly HelpFaqGroupLike[];
	onClear: () => void;
	query: string;
	showCategoryLinks: boolean;
	useStackedMobileRows: boolean;
}) {
	return (
		<>
			{showCategoryLinks ? <CategoryLinks groups={groups} /> : null}

			{filteredGroups.length > 0 ? (
				<>
					<div className={cn("mt-5", useStackedMobileRows && "md:hidden")}>
						{useStackedMobileRows ? <StackedRows groups={filteredGroups} query={query} /> : null}
					</div>

					<div
						className={cn(
							"mt-5 overflow-x-auto rounded-md border border-shell-border",
							useStackedMobileRows && "hidden md:block",
						)}
					>
						<HelpFaqTable groups={filteredGroups} query={query} />
					</div>
				</>
			) : (
				<EmptyState onClear={onClear} query={query} />
			)}
		</>
	);
}

function HelpFaqTable({ groups, query }: { groups: readonly HelpFaqGroupLike[]; query: string }) {
	return (
		<table
			aria-label="Help questions and answers"
			className="w-full min-w-[42rem] border-separate border-spacing-0 text-left"
		>
			<thead>
				<tr>
					<th
						scope="col"
						className="w-[38%] border-shell-border border-b bg-shell px-4 py-3 font-medium text-m text-shell-muted"
					>
						Question
					</th>

					<th
						scope="col"
						className="border-shell-border border-b bg-shell px-4 py-3 font-medium text-m text-shell-muted"
					>
						Answer
					</th>
				</tr>
			</thead>

			<tbody>
				{groups.map((group) => (
					<HelpFaqGroupRows key={group.name} group={group} query={query} />
				))}
			</tbody>
		</table>
	);
}

function CategoryLinks({ groups }: Pick<HelpFaqCatalogProps, "groups">) {
	return (
		<nav aria-label="Help categories" className="mt-5 flex flex-wrap gap-2 border-shell-border border-t pt-4">
			{groups.map(({ name }) => (
				<a
					key={name}
					href={`#help-group-${slugify(name)}`}
					className="inline-flex min-h-11 items-center rounded-md border border-primary-subtle-border/70 bg-primary-subtle/45 px-3 font-medium text-m text-primary outline-none transition-colors duration-150 hover:bg-primary-subtle focus-visible:ring-[3px] focus-visible:ring-primary/25"
				>
					{name}
				</a>
			))}
		</nav>
	);
}

function HelpFaqGroupRows({ group, query }: { group: HelpFaqCatalogProps["groups"][number]; query: string }) {
	return (
		<>
			<tr id={`help-group-${slugify(group.name)}`} className="scroll-mt-24">
				<th
					colSpan={2}
					scope="rowgroup"
					className="border-shell-border border-b bg-primary/5 px-4 py-3 text-left font-semibold text-m text-primary"
				>
					<span>{group.name}</span>

					<span className="ml-2 font-mono font-normal text-s+ text-shell-muted">{group.items.length}</span>
				</th>
			</tr>

			{group.items.map(({ answer, question }) => (
				<tr key={question}>
					<th
						scope="row"
						className="border-shell-border border-b px-4 py-4 align-top font-medium text-l text-shell-foreground leading-7"
					>
						<HighlightText query={query} text={question} />
					</th>

					<td className="border-shell-border border-b px-4 py-4 align-top text-l text-shell-muted leading-7">
						<HighlightText query={query} text={answer} />
					</td>
				</tr>
			))}
		</>
	);
}

function StackedRows({ groups, query }: { groups: HelpFaqCatalogProps["groups"]; query: string }) {
	return (
		<div className="grid gap-3">
			{groups.map((group) => (
				<section
					key={group.name}
					id={`help-group-${slugify(group.name)}`}
					className="scroll-mt-24 rounded-md border border-shell-border bg-shell px-4 py-4"
				>
					<h3 className="font-semibold text-m text-primary">
						{group.name} <span className="font-mono font-normal text-s+ text-shell-muted">{group.items.length}</span>
					</h3>

					<div className="mt-3 divide-y divide-shell-border">
						{group.items.map(({ answer, question }) => (
							<article key={question} className="py-4 first:pt-0 last:pb-0">
								<h4 className="font-medium text-l text-shell-foreground leading-7">
									<HighlightText query={query} text={question} />
								</h4>

								<p className="mt-2 text-l text-shell-muted leading-7">
									<HighlightText query={query} text={answer} />
								</p>
							</article>
						))}
					</div>
				</section>
			))}
		</div>
	);
}

function EmptyState({ onClear, query }: { onClear: () => void; query: string }) {
	return (
		<div className="mt-5 flex min-h-48 flex-col items-center justify-center rounded-md border border-shell-border border-dashed bg-shell px-6 py-10 text-center">
			<p className="font-mono text-primary text-s+">No matches</p>

			<h3 className="mt-2 text-2xl text-shell-foreground">No results for “{query}”</h3>

			<p className="mt-2 max-w-md text-m text-shell-muted leading-6">
				Try a shorter phrase, search a topic name, or clear the query to browse every answer.
			</p>

			<button
				type="button"
				onClick={onClear}
				className="mt-5 inline-flex min-h-11 items-center rounded-md border border-shell-border px-4 font-medium text-m text-shell-foreground outline-none transition-colors duration-150 hover:border-primary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary/25"
			>
				Clear search
			</button>
		</div>
	);
}

function ContactPanel() {
	return (
		<aside className="mt-8 flex flex-col gap-5 rounded-lg border border-primary-subtle-border bg-primary-subtle/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
			<div>
				<p className="text-primary text-s+ uppercase tracking-normal">Still need help?</p>

				<h3 className="mt-2 text-2xl text-shell-foreground">Talk through cash ops for your service team.</h3>

				<p className="mt-2 max-w-2xl text-m text-shell-muted leading-6">
					Use this MVP contact page for sales, support, partnerships, and product feedback. Submissions stay local in
					demo mode.
				</p>
			</div>

			<ActionLink href="/contact" variant="secondary" className="shrink-0">
				Contact us
			</ActionLink>
		</aside>
	);
}

function HighlightText({ query, text }: { query: string; text: string }) {
	const terms = query
		.split(/\s+/)
		.filter(Boolean)
		.map((term) => escapeRegExp(term));

	if (terms.length === 0) {
		return text;
	}

	const parts = text.split(new RegExp(`(${terms.join("|")})`, "gi"));
	const occurrences = new Map<string, number>();

	return parts.map((part) => {
		const occurrence = occurrences.get(part) ?? 0;
		occurrences.set(part, occurrence + 1);

		return terms.some((term) => new RegExp(`^${term}$`, "i").test(part)) ? (
			<mark key={`${part}-${occurrence}`} className="rounded bg-primary/20 px-0.5 text-primary">
				{part}
			</mark>
		) : (
			part
		);
	});
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value: string) {
	return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");
}
