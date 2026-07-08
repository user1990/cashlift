import { getRequiredClerkValueForConfig } from "./config";

export const getRequiredClerkSecretKey = (value = process.env.CLERK_SECRET_KEY) =>
	getRequiredClerkValueForConfig("CLERK_SECRET_KEY", value);
