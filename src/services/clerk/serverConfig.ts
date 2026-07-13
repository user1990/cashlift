const getRequiredClerkValue = (name: string, value: string | undefined) => {
	const normalized = value?.trim();

	if (!normalized) {
		throw new Error(`${name} must be configured for Clerk authentication.`);
	}

	return normalized;
};

export const getRequiredClerkSecretKey = (value = process.env.CLERK_SECRET_KEY) =>
	getRequiredClerkValue("CLERK_SECRET_KEY", value);
