import { cn } from "@/lib/utils";

type PanelProps = {
	children: React.ReactNode;
	className?: string;
};

export function Panel({ children, className }: PanelProps) {
	return (
		<section
			className={cn(
				"rounded-xl border border-[#E8E8EC] bg-white p-4 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
				className,
			)}
		>
			{children}
		</section>
	);
}

export function PanelHeader({
	action,
	eyebrow,
	title,
}: {
	action?: React.ReactNode;
	eyebrow?: string;
	title: string;
}) {
	return (
		<div className="mb-4 flex items-start justify-between gap-4">
			<div>
				{eyebrow ? (
					<p className="mb-1 text-[11px] font-semibold uppercase tracking-normal text-[#6B6B6B]">
						{eyebrow}
					</p>
				) : null}
				<h2 className="text-base font-semibold text-[#0A0A0A]">{title}</h2>
			</div>
			{action}
		</div>
	);
}
