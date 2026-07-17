"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { CLERK_SIGN_IN_URL } from "./config";

type ClerkAccountUser = {
	fullName: string | null;
	primaryEmailAddress: { emailAddress: string } | null;
};

type GetClerkAccountDetailsOptions = {
	loaded: boolean;
	user: ClerkAccountUser | null | undefined;
};

export const useClerkAccount = () => {
	const { signOut } = useClerk();
	const { isLoaded, user } = useUser();
	const account = getClerkAccountDetails({ loaded: isLoaded, user });

	if (!account) {
		return null;
	}

	return {
		...account,
		signOut: () => signOut({ redirectUrl: CLERK_SIGN_IN_URL }),
	};
};

export const getClerkAccountDetails = ({ loaded, user }: GetClerkAccountDetailsOptions) => {
	if (!loaded || !user) {
		return null;
	}

	const emailAddress = user.primaryEmailAddress?.emailAddress;
	const name = [user.fullName, emailAddress].find(Boolean) ?? "Account";

	return {
		avatar: getInitials(name),
		description: emailAddress ?? "Workspace user",
		name,
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
