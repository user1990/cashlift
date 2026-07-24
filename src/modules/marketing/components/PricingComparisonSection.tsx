import { Check, ChevronDown, Minus } from "lucide-react";
import { PRICING_COMPARISON_GROUPS, PRICING_PLANS } from "../content";

const PLAN_SHORT_NAMES = {
	starter: "Starter",
	professional: "Pro",
	enterprise: "Ent",
} as const satisfies Record<(typeof PRICING_PLANS)[number]["slug"], string>;

const FEATURE_CELL_CLASS = "px-1.5 py-2 @sm:px-3 @sm:py-2.5 @md:px-5 @md:py-3.5";
const PLAN_CELL_CLASS = "px-1 py-2 text-center @sm:px-2 @sm:py-2.5 @md:px-5 @md:py-3.5 @md:text-left";
const HEADER_CELL_CLASS = "border-b border-shell-border bg-shell-elevated";
const ROW_BORDER_CLASS = "border-t border-shell-border";

export const PricingComparisonSection = () => (
	<section className="min-w-0 scroll-mt-24 pt-4" aria-labelledby="compare-plans-heading">
		<h2 id="compare-plans-heading">
			<a
				className="mx-auto flex w-fit items-center gap-2 text-xl font-semibold text-primary outline-none transition-colors duration-150 hover:text-primary-hover focus-visible:ring-[3px] focus-visible:ring-primary/20"
				href="#comparison-table"
			>
				Compare plans in full
				<ChevronDown aria-hidden className="size-6" />
			</a>
		</h2>

		<div
			id="comparison-table"
			className="@container mt-10 max-w-full scroll-mt-24 overflow-hidden rounded-lg border border-shell-border"
		>
			<table className="w-full table-fixed border-separate border-spacing-0 text-left text-2xs leading-tight @sm:text-s @md:text-m">
				<thead>
					<tr>
						<th
							className={`${FEATURE_CELL_CLASS} ${HEADER_CELL_CLASS} w-[40%] rounded-tl-lg font-medium text-shell-muted @md:w-[34%]`}
						>
							Feature
						</th>

						{PRICING_PLANS.map(({ name, slug }, index) => (
							<th
								className={`${PLAN_CELL_CLASS} ${HEADER_CELL_CLASS} text-2xs+ font-semibold leading-tight text-shell-foreground @sm:text-s+ @md:text-l ${index === PRICING_PLANS.length - 1 ? "rounded-tr-lg" : ""}`}
								key={slug}
								scope="col"
								title={name}
							>
								<span className="@md:hidden">{PLAN_SHORT_NAMES[slug]}</span>

								<span className="hidden @md:inline">{name}</span>
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{PRICING_COMPARISON_GROUPS.map((group) => (
						<ComparisonGroup group={group} key={group.name} />
					))}
				</tbody>
			</table>
		</div>
	</section>
);

type ComparisonGroupProps = {
	group: (typeof PRICING_COMPARISON_GROUPS)[number];
};

const ComparisonGroup = ({ group }: ComparisonGroupProps) => (
	<>
		<tr>
			<th
				className={`${FEATURE_CELL_CLASS} ${ROW_BORDER_CLASS} bg-primary/5 text-s+ font-semibold text-primary @md:text-m+`}
				colSpan={4}
				scope="rowgroup"
			>
				{group.name}
			</th>
		</tr>

		{group.features.map((feature) => (
			<tr key={feature.name}>
				<th
					scope="row"
					className={`${FEATURE_CELL_CLASS} ${ROW_BORDER_CLASS} wrap-break-word font-medium text-shell-foreground`}
				>
					{feature.name}
				</th>

				{feature.values.map((value, index) => (
					<td
						key={PRICING_PLANS[index]?.slug}
						className={`${PLAN_CELL_CLASS} ${ROW_BORDER_CLASS} wrap-break-word text-shell-muted`}
					>
						{value ? (
							<Check aria-label="Included" className="mx-auto size-3.5 text-primary @md:mx-0 @md:size-5" />
						) : (
							<Minus aria-label="Not included" className="mx-auto size-3.5 text-shell-muted @md:mx-0 @md:size-5" />
						)}
					</td>
				))}
			</tr>
		))}
	</>
);
