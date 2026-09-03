import { GlassCard } from "@/modules/dashboard/explore/GlassCard";

export const WorkspaceSettingsLoading = () => (
	<div aria-busy="true" aria-live="polite" className="space-y-4 xl:space-y-5">
		<p className="sr-only">Loading workspace settings…</p>

		<GlassCard atmosphere="status">
			<div className="h-3 w-48 rounded bg-white/10" />

			<div className="mt-4 h-8 max-w-xl rounded bg-white/10" />

			<div className="mt-6 grid gap-5 sm:grid-cols-3">
				<div className="h-12 rounded bg-white/10" />

				<div className="h-12 rounded bg-white/10" />

				<div className="h-12 rounded bg-white/10" />
			</div>
		</GlassCard>

		<div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:gap-5">
			<GlassCard atmosphere="priority" intensity="active">
				<div className="h-3 w-24 rounded bg-white/10" />

				<div className="mt-4 h-7 max-w-sm rounded bg-white/10" />

				<div className="mt-5 h-4 w-2/3 rounded bg-white/10" />
			</GlassCard>

			<div className="grid gap-4 xl:gap-5">
				<GlassCard atmosphere="queue">
					<div className="h-3 w-28 rounded bg-white/10" />

					<div className="mt-3 h-5 w-48 rounded bg-white/10" />

					<div className="mt-4 h-14 rounded bg-white/10" />

					<div className="mt-3 h-14 rounded bg-white/10" />
				</GlassCard>

				<GlassCard atmosphere="outlook">
					<div className="h-3 w-20 rounded bg-white/10" />

					<div className="mt-3 h-5 w-40 rounded bg-white/10" />

					<div className="mt-4 h-14 rounded bg-white/10" />
				</GlassCard>
			</div>
		</div>
	</div>
);
