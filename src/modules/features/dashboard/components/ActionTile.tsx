type ActionTileProps = {
	icon: React.ReactNode;
	label: string;
	meta: string;
	value: string;
};

export const ActionTile = ({ icon, label, meta, value }: ActionTileProps) => (
	<div className="rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3">
		<div className="mb-3 flex items-center justify-between gap-3">
			<span className="rounded-md bg-white p-2 text-primary">{icon}</span>

			<span className="font-mono text-sm font-semibold text-[#0A0A0A]">
				{value}
			</span>
		</div>

		<p className="text-sm font-semibold text-[#0A0A0A]">{label}</p>

		<p className="mt-1 text-xs leading-5 text-[#6B6B6B]">{meta}</p>
	</div>
);
