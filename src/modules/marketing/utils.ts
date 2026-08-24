import type { HelpFaqIconName } from "./content";

const MAX_HELP_FAQ_QUERY_LENGTH = 120;

export type HelpFaqGroupLike = {
	icon?: HelpFaqIconName;
	items: readonly HelpFaqItemLike[];
	name: string;
};

export type HelpFaqItemLike = {
	answer: string;
	question: string;
	slug: string;
};

export const slugifyHelpFaqValue = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");

export const parseHelpFaqQuery = (value: string | string[] | undefined) => {
	const query = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
	const normalizedQuery = query.trim();

	return normalizedQuery.length <= MAX_HELP_FAQ_QUERY_LENGTH ? normalizedQuery : "";
};

export const getHelpFaqHref = (slug: string, query: string) => {
	const normalizedQuery = parseHelpFaqQuery(query);

	return normalizedQuery ? `/help/${slug}?q=${encodeURIComponent(normalizedQuery)}` : `/help/${slug}`;
};

export const filterHelpFaqGroups = <T extends HelpFaqGroupLike>(groups: readonly T[], query: string) => {
	const searchTerms = parseHelpFaqQuery(query).toLocaleLowerCase().split(/\s+/).filter(Boolean);

	if (searchTerms.length === 0) {
		return groups;
	}

	return groups.reduce<T[]>((filteredGroups, group) => {
		const normalizedGroupName = group.name.toLocaleLowerCase();

		if (searchTerms.every((term) => normalizedGroupName.includes(term))) {
			filteredGroups.push(group);
			return filteredGroups;
		}

		const matchingItems = group.items.filter(({ answer, question }) => {
			const searchableText = `${group.name} ${question} ${answer}`.toLocaleLowerCase();

			return searchTerms.every((term) => searchableText.includes(term));
		});

		if (matchingItems.length > 0) {
			filteredGroups.push({ ...group, items: matchingItems });
		}

		return filteredGroups;
	}, []);
};
