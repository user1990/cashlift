import { Logo } from "@/modules/marketing/components/Logo";
import { AuthDotRail } from "./AuthDotRail";
import styles from "./AuthGlassShell.module.css";

type AuthGlassShellProps = {
	children: React.ReactNode;
};

export const AuthGlassShell = ({ children }: AuthGlassShellProps) => (
	<div className={styles.backdrop}>
		<div className={styles.stage}>
			<AuthDotRail side="left" />

			<div className={styles.card}>
				<div className={styles.brand}>
					<Logo />
				</div>

				<div className={styles.content}>{children}</div>
			</div>

			<AuthDotRail side="right" />
		</div>
	</div>
);
