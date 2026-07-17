const SKELETON_CLASS =
	"animate-auth-skeleton-pulse rounded-md bg-[color-mix(in_srgb,var(--panel-muted)_50%,transparent)] motion-reduce:animate-none";

export const AuthGlassLoading = () => (
	<div aria-label="Preparing authentication" className="grid w-full gap-3.5" role="status">
		<div className={`${SKELETON_CLASS} mx-auto h-6 w-[54%]`} />

		<div className={`${SKELETON_CLASS} mx-auto mt-[-0.375rem] mb-1 w-4/5 h-3`} />

		<div className={`${SKELETON_CLASS} h-[2.625rem]`} />

		<div className={`${SKELETON_CLASS} my-1.5 h-px`} />

		<div className={`${SKELETON_CLASS} h-3 w-[28%]`} />

		<div className={`${SKELETON_CLASS} h-[2.625rem]`} />

		<div className={`${SKELETON_CLASS} h-[2.625rem]`} />
	</div>
);
