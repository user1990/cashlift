import type { AuthenticatedUser } from "./types";

export async function getCurrentUser(): Promise<AuthenticatedUser> {
	// Clerk will replace this demo identity behind the same boundary.
	return {
		id: "demo-user",
		name: "Avery",
	};
}
