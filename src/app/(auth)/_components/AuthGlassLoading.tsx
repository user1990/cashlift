import styles from "./AuthGlassShell.module.css";

export const AuthGlassLoading = () => (
	<div aria-label="Preparing authentication" className={styles.loading} role="status">
		<div className={styles.skeletonHeading} />

		<div className={styles.skeletonCopy} />

		<div className={styles.skeletonButton} />

		<div className={styles.skeletonDivider} />

		<div className={styles.skeletonLabel} />

		<div className={styles.skeletonInput} />

		<div className={styles.skeletonButton} />
	</div>
);
