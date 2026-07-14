import type { WorkspaceExperience } from "./types";

export type WorkspaceExperienceContract = {
	basePath: "/dashboard" | "/demo/workspace";
	experience: WorkspaceExperience;
	readOnly: boolean;
};

const WORKSPACE_EXPERIENCES = {
	demo: {
		basePath: "/dashboard",
		experience: "demo",
		readOnly: false,
	},
	production: {
		basePath: "/dashboard",
		experience: "production",
		readOnly: false,
	},
	"public-demo": {
		basePath: "/demo/workspace",
		experience: "public-demo",
		readOnly: true,
	},
} as const satisfies Record<WorkspaceExperience, WorkspaceExperienceContract>;

export const getWorkspaceExperienceContract = (experience: WorkspaceExperience): WorkspaceExperienceContract =>
	WORKSPACE_EXPERIENCES[experience];
