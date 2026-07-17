import Link from "next/link";
import { Logo } from "@/modules/marketing/components/Logo";
import { cn } from "@/ui/utils/cn";
import { AuthDotRail } from "./AuthDotRail";
import styles from "./AuthGlassShell.module.css";

type AuthGlassShellProps = {
	action: {
		href: string;
		label: string;
		prompt: string;
	};
	children: React.ReactNode;
	size?: "default" | "expanded";
};

export const AuthGlassShell = ({ action, children, size = "default" }: AuthGlassShellProps) => (
	<div className={styles.backdrop}>
		<div className={styles.stage}>
			<AuthDotRail side="left" />

			<div className={cn(styles.card, size === "expanded" && styles.cardExpanded)}>
				<div className={styles.brand}>
					<Logo />
				</div>

				<div className={styles.content}>{children}</div>

				<Link className={styles.authAction} href={action.href} prefetch={false}>
					{action.prompt} <span>{action.label}</span>
				</Link>
			</div>

			<AuthDotRail side="right" />
		</div>
	</div>
);
