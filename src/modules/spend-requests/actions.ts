"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { workspaceDemoEnabled } from "@/services/env/app";
import type { SpendRequestDecisionInput } from "./schemas";
import { decideSpendRequest } from "./server";

export const decideSpendRequestAction = async (input: SpendRequestDecisionInput) => {
	let session: Awaited<ReturnType<typeof auth>> | undefined;

	try {
		session = await auth();
	} catch {
		if (!workspaceDemoEnabled()) {
			return {
				code: "service",
				message: "Workspace auth is not configured.",
				status: "error",
			} as const;
		}
	}

	if (!workspaceDemoEnabled() && !session?.userId) {
		return {
			code: "unauthenticated",
			message: "Sign in to update spend requests.",
			status: "error",
		} as const;
	}

	const result = await decideSpendRequest(input, session);

	if (result.status === "success" && result.refresh) {
		revalidatePath("/dashboard");
		revalidatePath("/dashboard/approvals");
	}

	return result;
};
