import Link from "next/link";
import { Logo } from "@/modules/marketing/components/Logo";
import { AuthDotRail } from "./AuthDotRail";
import styles from "./AuthGlassShell.module.css";

type AuthGlassShellProps = {
	children: React.ReactNode;
	signUpHref?: string;
};

export const AuthGlassShell = ({ children, signUpHref }: AuthGlassShellProps) => (
	<div className={styles.backdrop}>
		<div className={styles.stage}>
			<AuthDotRail side="left" />

			<div className={styles.card}>
				<div className={styles.brand}>
					<Logo />
				</div>

				<div className={styles.content}>{children}</div>

				{signUpHref ? (
					<Link className={styles.signUpAction} href={signUpHref}>
						New to CashLift? <span>Create account</span>
					</Link>
				) : null}
			</div>

			<AuthDotRail side="right" />
		</div>
	</div>
);
