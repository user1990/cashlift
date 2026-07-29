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
const COMPARE_PLANS_HEADING_ID = "compare-plans-heading";
const COMPARISON_TABLE_ID = "comparison-table";

export const PricingComparisonSection = () => (
	<section aria-labelledby={COMPARE_PLANS_HEADING_ID} className="min-w-0 scroll-mt-24 pt-4">
		<h2 id={COMPARE_PLANS_HEADING_ID}>
			<a
				href={`#${COMPARISON_TABLE_ID}`}
				className="mx-auto flex w-fit items-center gap-2 font-semibold text-primary text-xl outline-none transition-colors duration-150 hover:text-primary-hover focus-visible:ring-[3px] focus-visible:ring-primary/20"
			>
				Compare plans in full
				<ChevronDown aria-hidden className="size-6" />
			</a>
		</h2>

		<div
			id={COMPARISON_TABLE_ID}
			className="@container mt-10 max-w-full scroll-mt-24 overflow-hidden rounded-lg border border-shell-border"
		>
			<table className="w-full table-fixed border-separate border-spacing-0 text-left @md:text-m @sm:text-s text-2xs leading-tight">
				<thead>
					<tr>
						<th
							className={`${FEATURE_CELL_CLASS} ${HEADER_CELL_CLASS} @md:w-[34%] w-[40%] rounded-tl-lg font-medium text-shell-muted`}
						>
							Feature
						</th>

						{PRICING_PLANS.map(({ name, slug }, index) => (
							<th
								key={slug}
								scope="col"
								title={name}
								className={`${PLAN_CELL_CLASS} ${HEADER_CELL_CLASS} font-semibold @md:text-l @sm:text-s+ text-2xs+ text-shell-foreground leading-tight ${index === PRICING_PLANS.length - 1 ? "rounded-tr-lg" : ""}`}
							>
								<span className="@md:hidden">{PLAN_SHORT_NAMES[slug]}</span>

								<span className="@md:inline hidden">{name}</span>
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{PRICING_COMPARISON_GROUPS.map(({ features, name }) => (
						<ComparisonGroupRows key={name} features={features} name={name} />
					))}
				</tbody>
			</table>
		</div>
	</section>
);

type ComparisonGroupProps = {
	features: (typeof PRICING_COMPARISON_GROUPS)[number]["features"];
	name: (typeof PRICING_COMPARISON_GROUPS)[number]["name"];
};

function ComparisonGroupRows({ features, name }: ComparisonGroupProps) {
	return (
		<>
			<tr>
				<th
					colSpan={4}
					scope="rowgroup"
					className={`${FEATURE_CELL_CLASS} ${ROW_BORDER_CLASS} bg-primary/5 font-semibold @md:text-m+ text-primary text-s+`}
				>
					{name}
				</th>
			</tr>

			{features.map(({ name: featureName, values }) => (
				<tr key={featureName}>
					<th
						scope="row"
						className={`${FEATURE_CELL_CLASS} ${ROW_BORDER_CLASS} wrap-break-word font-medium text-shell-foreground`}
					>
						{featureName}
					</th>

					{values.map((value, index) => (
						<td
							key={PRICING_PLANS[index]?.slug}
							className={`${PLAN_CELL_CLASS} ${ROW_BORDER_CLASS} wrap-break-word text-shell-muted`}
						>
							{value ? (
								<Check aria-label="Included" className="@md:mx-0 mx-auto @md:size-5 size-3.5 text-primary" />
							) : (
								<Minus aria-label="Not included" className="@md:mx-0 mx-auto @md:size-5 size-3.5 text-shell-muted" />
							)}
						</td>
					))}
				</tr>
			))}
		</>
	);
}
