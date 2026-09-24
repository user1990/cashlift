import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { getFindOptionId } from "../findDom";
import { type FindItem, type FindQuery, filterFindItems, hasActiveFindFilters } from "../findModel";
import { useFindQueryState } from "./useFindQueryState";

const MAX_RECENT_SEARCHES = 5;

type FindNavigate = (href: string) => void;

export const useFindSession = (
	items: FindItem[],
	categoryMode: "kind" | "work",
	navigate: FindNavigate = (href) => {
		window.location.assign(href);
	},
) => {
	const { clearAll, query, setQuery } = useFindQueryState();
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [selectedId, setSelectedId] = useState<string>();
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const results = filterFindItems(items, query, categoryMode);
	const selectedIndex = results.findIndex((item) => item.id === selectedId);
	const selectedItem = selectedIndex >= 0 ? results[selectedIndex] : undefined;
	const showResults = Boolean(query.query.trim()) || hasActiveFindFilters(query) || query.category !== "all";

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

	useEffect(() => {
		if (!open || !showResults || !selectedId) {
			return;
		}

		document.getElementById(getFindOptionId(selectedId))?.scrollIntoView({ block: "nearest" });
	}, [open, selectedId, showResults]);

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
		setSelectedId(undefined);
		setQuery(nextQuery);
	};

	const applySearch = (value: string) => {
		rememberQuery(value);
		updateQuery({ query: value });
	};

	const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Escape") {
			event.preventDefault();
			closePalette();
			return;
		}

		if (!showResults) {
			return;
		}

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedId(getMovedFindId(results, selectedIndex, event.key === "ArrowDown" ? 1 : -1));
			return;
		}

		if (event.key === "Enter" && selectedItem) {
			event.preventDefault();
			rememberQuery(query.query);
			navigate(selectedItem.actionHref);
			closePalette();
		}
	};

	return {
		applySearch,
		clearAll,
		closePalette,
		handleSearchKeyDown,
		hasFilters: hasActiveFindFilters(query),
		inputRef,
		open,
		openPalette,
		query,
		recentSearches,
		results,
		selectedId,
		showResults,
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
