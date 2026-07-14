export const getRequiredClerkValue = (name: string, value: string | undefined) => {
	const normalized = value?.trim();

	if (!normalized) {
		throw new Error(`${name} must be configured for Clerk authentication.`);
	}

	return normalized;
};
