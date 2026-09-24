"use client";

import type { WorkspacePageRendererProps } from "../types";
import { WorkspacePageQueryContent } from "./WorkspacePageQueryContent";

export const AuthenticatedWorkspacePageContent = (props: WorkspacePageRendererProps) => (
	<WorkspacePageQueryContent {...props} />
);
