"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { CLERK_SIGN_IN_URL } from "./config";

export const useClerkAccount = () => {
	const { signOut } = useClerk();
	const { user } = useUser();

	if (!user) {
		return {
			avatar: "AC",
			description: "Workspace user",
			name: "Account",
			signOut: () => signOut({ redirectUrl: CLERK_SIGN_IN_URL }),
		};
	}

	const emailAddress = user.primaryEmailAddress?.emailAddress;
	const name = [user.fullName, emailAddress].find(Boolean) ?? "Account";

	return {
		avatar: getInitials(name),
		description: emailAddress ?? "Workspace user",
		name,
		signOut: () => signOut({ redirectUrl: CLERK_SIGN_IN_URL }),
	};
};

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
