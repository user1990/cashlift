import { getRequiredClerkValue } from "./requiredValue";

export const getRequiredClerkSecretKey = (value = process.env.CLERK_SECRET_KEY) =>
	getRequiredClerkValue("CLERK_SECRET_KEY", value);
