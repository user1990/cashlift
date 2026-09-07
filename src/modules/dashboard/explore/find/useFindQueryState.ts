"use client";

import { parseAsString, useQueryStates } from "nuqs";
import { EMPTY_FIND_QUERY, type FindQuery } from "./findModel";

const FIND_QUERY_PARAMS = {
	category: parseAsString.withDefault(EMPTY_FIND_QUERY.category),
	owner: parseAsString.withDefault(""),
	q: parseAsString.withDefault(""),
	status: parseAsString.withDefault(""),
};

export const useFindQueryState = () => {
	const [params, setParams] = useQueryStates(FIND_QUERY_PARAMS, { history: "replace" });
	const query: FindQuery = {
		category: params.category,
		owner: params.owner,
		query: params.q,
		status: params.status,
	};

	const setQuery = (nextQuery: Partial<FindQuery>) => {
		void setParams({
			category: nextQuery.category ?? query.category,
			owner: nextQuery.owner ?? query.owner,
			q: nextQuery.query ?? query.query,
			status: nextQuery.status ?? query.status,
		});
	};

	const clearAll = () => {
		void setParams({
			category: EMPTY_FIND_QUERY.category,
			owner: "",
			q: "",
			status: "",
		});
	};

	return { clearAll, query, setQuery };
};
