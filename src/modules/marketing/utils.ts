const MAX_HELP_FAQ_QUERY_LENGTH = 120;

export type HelpFaqGroupLike = {
	items: readonly HelpFaqItemLike[];
	name: string;
};

export type HelpFaqItemLike = {
	answer: string;
	question: string;
};

export const parseHelpFaqQuery = (value: string | string[] | undefined) => {
	const query = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
	const normalizedQuery = query.trim();

	return normalizedQuery.length <= MAX_HELP_FAQ_QUERY_LENGTH ? normalizedQuery : "";
};

export const filterHelpFaqGroups = <T extends HelpFaqGroupLike>(groups: readonly T[], query: string) => {
	const normalizedQuery = parseHelpFaqQuery(query).toLocaleLowerCase();

	if (!normalizedQuery) {
		return groups;
	}

	return groups.reduce<T[]>((filteredGroups, group) => {
		if (group.name.toLocaleLowerCase().includes(normalizedQuery)) {
			filteredGroups.push(group);
			return filteredGroups;
		}

		const matchingItems = group.items.filter(({ answer, question }) =>
			`${question} ${answer}`.toLocaleLowerCase().includes(normalizedQuery),
		);

		if (matchingItems.length > 0) {
			filteredGroups.push({ ...group, items: matchingItems });
		}

		return filteredGroups;
	}, []);
};
