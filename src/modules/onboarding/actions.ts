"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { captureAppException, captureAppMessage } from "@/services/platform/integrations/sentry";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { workspaceSetupSchema } from "./schemas";

export type WorkspaceSetupFormState = {
	fieldErrors?: Partial<Record<"industry" | "name", string[]>>;
	message?: string;
};

export const INITIAL_WORKSPACE_SETUP_FORM_STATE: WorkspaceSetupFormState = {};

export const provisionWorkspace = async (
	_previousState: WorkspaceSetupFormState,
	formData: FormData,
): Promise<WorkspaceSetupFormState> => {
	const values = workspaceSetupSchema.safeParse({
		industry: formData.get("industry"),
		name: formData.get("name"),
	});

	if (!values.success) {
		return { fieldErrors: values.error.flatten().fieldErrors };
	}

	try {
		const session = await auth();

		if (!session.userId) {
			captureAppMessage({
				fingerprint: ["workspace-provisioning", "unauthenticated"],
				message: "Workspace provisioning was requested without an authenticated session.",
				tags: { feature: "workspace-provisioning", failureKind: "unauthenticated" },
			});

			return { message: "Sign in again before creating your company workspace." };
		}

		const accessToken = await session.getToken({ template: "supabase" });

		if (!accessToken) {
			captureAppMessage({
				fingerprint: ["workspace-provisioning", "missing-data-token"],
				message: "Workspace provisioning could not retrieve a data token.",
				tags: { feature: "workspace-provisioning", failureKind: "missing-data-token" },
			});

			return { message: "Workspace setup is temporarily unavailable. Try again shortly." };
		}

		const client = createServerSupabaseClient({ accessToken });
		const { error } = await client.rpc("provision_company_workspace", {
			company_id: `company-${crypto.randomUUID()}`,
			company_industry: values.data.industry,
			company_name: values.data.name,
			member_id: `member-${crypto.randomUUID()}`,
		});

		if (error) {
			throw new Error(error.message);
		}
	} catch (error) {
		captureAppException({
			error,
			fingerprint: ["workspace-provisioning", "failed"],
			tags: { feature: "workspace-provisioning", failureKind: "failed" },
		});

		return { message: "We could not finish workspace setup. Try again or contact support." };
	}

	redirect("/dashboard");
};
