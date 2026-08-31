import { type KeyboardEvent, useDeferredValue, useEffect, useRef, useState } from "react";
import { getFindOptionId } from "./findDom";
import {
	type FindItem,
	type FindQuery,
	filterFindItems,
	getFindFacetValues,
	getFindSuggestions,
	hasActiveFindFilters,
} from "./findModel";
import { useFindQueryState } from "./useFindQueryState";

const MAX_RECENT_SEARCHES = 5;

export const useFindSession = (items: FindItem[], categoryMode: "kind" | "work") => {
	const { clearAll, clearFilters, query, setQuery } = useFindQueryState();
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [selectedId, setSelectedId] = useState<string>();
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const queryKey = [query.category, query.owner, query.query, query.status].join("\0");
	const deferredQueryKey = useDeferredValue(queryKey);
	const pending = deferredQueryKey !== queryKey;
	const results = filterFindItems(items, query, categoryMode);
	const categoryItems = filterFindItems(
		items,
		{ category: query.category, owner: "", query: "", status: "" },
		categoryMode,
	);
	const suggestions = getFindSuggestions(categoryItems, query.query);
	const owners = getFindFacetValues(categoryItems, "owner");
	const statuses = getFindFacetValues(categoryItems, "status");
	const selectedIndex = results.findIndex((item) => item.id === selectedId);
	const selectedItem = selectedIndex >= 0 ? results[selectedIndex] : undefined;

	const openPalette = () => setOpen(true);
	const closePalette = () => setOpen(false);

	useEffect(() => {
		const onWindowKeyDown = (event: globalThis.KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen(true);
			}
		};

		window.addEventListener("keydown", onWindowKeyDown);

		return () => window.removeEventListener("keydown", onWindowKeyDown);
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		const frame = requestAnimationFrame(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		});

		return () => cancelAnimationFrame(frame);
	}, [open]);

	const rememberQuery = (value: string) => {
		const nextQuery = value.trim();

		if (!nextQuery) {
			return;
		}

		setRecentSearches((current) =>
			[nextQuery, ...current.filter((entry) => entry !== nextQuery)].slice(0, MAX_RECENT_SEARCHES),
		);
	};

	const updateQuery = (nextQuery: Partial<FindQuery>) => {
		setQuery(nextQuery);
	};

	const applySearch = (value: string) => {
		rememberQuery(value);
		updateQuery({ query: value });
	};

	const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedId(getMovedFindId(results, selectedIndex, event.key === "ArrowDown" ? 1 : -1));
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();
			rememberQuery(query.query);
			activateFindItem(selectedItem);
			closePalette();
			return;
		}

		if (event.key === "Escape") {
			event.preventDefault();
			closePalette();
		}
	};

	return {
		applySearch,
		clearAll,
		clearFilters,
		closePalette,
		filtersOpen,
		handleSearchKeyDown,
		hasFilters: hasActiveFindFilters(query),
		inputRef,
		open,
		openPalette,
		owners,
		pending,
		query,
		recentSearches,
		results,
		selectedId,
		setFiltersOpen,
		setOpen,
		setSelectedId,
		statuses,
		suggestions,
		updateQuery,
	};
};

function getMovedFindId(results: FindItem[], selectedIndex: number, delta: number) {
	if (!results.length) {
		return;
	}

	if (selectedIndex < 0) {
		return results[0]?.id;
	}

	const nextIndex = Math.min(Math.max(selectedIndex + delta, 0), results.length - 1);

	return results[nextIndex]?.id;
}

function activateFindItem(item: FindItem | undefined) {
	if (!item) {
		return;
	}

	document.getElementById(getFindOptionId(item.id))?.click();
}
