import type { HelpFaqGroup } from "./content";
import { HELP_FAQ_QUERY_SCHEMA } from "./schemas";

export const parseHelpFaqQuery = (value: string | string[] | undefined) => {
	const raw = Array.isArray(value) ? value[0] : value;

	if (typeof raw !== "string") {
		return "";
	}

	const trimmed = raw.trim();

	return HELP_FAQ_QUERY_SCHEMA.safeParse(trimmed).success ? trimmed : "";
};

export const filterHelpFaqGroups = (groups: readonly HelpFaqGroup[], query: string) => {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) {
		return [...groups];
	}

	return groups.flatMap((group) => {
		if (group.name.toLowerCase().includes(normalizedQuery)) {
			return [group];
		}

		const items = group.items.filter(
			({ answer, question }) =>
				answer.toLowerCase().includes(normalizedQuery) || question.toLowerCase().includes(normalizedQuery),
		);

		return items.length > 0 ? [{ items, name: group.name }] : [];
	});
};
