import type { CompanyRole } from "@/modules/company-roles/types";
import { COMPANY_ROLE_LABELS } from "@/modules/workspace/settingsPresentation";
import { cn } from "@/ui/utils/cn";

type WorkspaceRoleCueProps = {
	className?: string;
	role: CompanyRole;
};

export const WorkspaceRoleCue = ({ className, role }: WorkspaceRoleCueProps) => (
	<span className={cn("inline-flex items-center gap-1.5 text-s", className)}>
		<span
			aria-hidden
			className={cn(
				"size-1.5 rounded-full",
				role === "owner-finance" && "bg-primary",
				role === "manager" && "bg-shell-muted",
				role === "employee" && "bg-border-strong",
			)}
		/>

		<span
			className={cn(
				role === "owner-finance" && "text-primary",
				(role === "manager" || role === "employee") && "text-muted-foreground",
			)}
		>
			{COMPANY_ROLE_LABELS[role]}
		</span>
	</span>
);
