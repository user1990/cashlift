const SKELETON_CLASS =
	"animate-auth-skeleton-pulse rounded-md bg-[color-mix(in_srgb,var(--panel-muted)_50%,transparent)] motion-reduce:animate-none";
const FIELD_SKELETONS = ["first", "second"] as const;

type AuthGlassLoadingProps = {
	fieldCount: 1 | 2;
};

export const AuthGlassLoading = ({ fieldCount }: AuthGlassLoadingProps) => (
	<div aria-label="Preparing authentication" className="grid w-full gap-3.5" role="status">
		<div aria-hidden="true" className={`${SKELETON_CLASS} mx-auto h-7 w-[58%]`} />

		<div aria-hidden="true" className={`${SKELETON_CLASS} mx-auto mt-[-0.375rem] mb-1 h-3 w-4/5`} />

		<div aria-hidden="true" className={`${SKELETON_CLASS} h-[2.125rem] max-[48rem]:h-11`} />

		<div aria-hidden="true" className="my-1.5 flex items-center gap-4">
			<div className={`${SKELETON_CLASS} h-px flex-1`} />

			<div className={`${SKELETON_CLASS} size-3`} />

			<div className={`${SKELETON_CLASS} h-px flex-1`} />
		</div>

		{FIELD_SKELETONS.slice(0, fieldCount).map((field) => (
			<div aria-hidden="true" className="grid gap-2" key={field}>
				<div className={`${SKELETON_CLASS} h-3 w-[28%]`} />

				<div className={`${SKELETON_CLASS} h-[2.125rem] max-[48rem]:h-11`} />
			</div>
		))}

		<div aria-hidden="true" className={`${SKELETON_CLASS} h-8 rounded-full max-[48rem]:h-11`} />

		<div aria-hidden="true" className={`${SKELETON_CLASS} absolute bottom-7 left-1/2 h-4 w-[58%] -translate-x-1/2`} />
	</div>
);
