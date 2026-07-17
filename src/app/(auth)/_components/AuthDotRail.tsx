import { cn } from "@/ui/utils/cn";

type AuthDotRailProps = {
	side: "left" | "right";
};

const RAIL_PATH = "M0 132 H190 L260 76 H360";
const REVERSED_RAIL_PATH = "M360 76 H260 L190 132 H0";
const DOT_DELAYS = Array.from({ length: 14 }, (_, index) => `${index * 0.016}s`);
const DOT_TONE_CLASSES = [
	"text-[color-mix(in_srgb,var(--violet)_85%,var(--primary))] opacity-[0.96]",
	"text-[color-mix(in_srgb,var(--violet)_65%,var(--primary))] opacity-[0.94]",
	"text-[color-mix(in_srgb,var(--violet)_40%,var(--primary))] opacity-[0.92]",
	"text-primary opacity-90",
	"text-[color-mix(in_srgb,var(--primary)_88%,var(--primary-hover))] opacity-[0.86]",
	"text-primary-hover opacity-[0.82]",
	"text-[color-mix(in_srgb,var(--primary)_82%,var(--primary-strong))] opacity-[0.76]",
	"text-[color-mix(in_srgb,var(--primary)_82%,var(--signal))] opacity-70",
	"text-[color-mix(in_srgb,var(--primary)_68%,var(--signal))] opacity-[0.64]",
	"text-[color-mix(in_srgb,var(--primary)_58%,var(--primary-muted))] opacity-[0.56]",
	"text-[color-mix(in_srgb,var(--primary)_42%,var(--primary-muted))] opacity-[0.48]",
	"text-[color-mix(in_srgb,var(--primary)_28%,var(--primary-muted))] opacity-40",
	"text-[color-mix(in_srgb,var(--primary-muted)_82%,var(--primary-subtle-border))] opacity-[0.32]",
	"text-[color-mix(in_srgb,var(--primary-muted)_88%,var(--primary-subtle))] opacity-[0.24]",
] as const;

export const AuthDotRail = ({ side }: AuthDotRailProps) => {
	const isLeft = side === "left";
	const motionKeyTimes = isLeft ? "0;0.01;0.228;1" : "0;0.49;0.708;1";
	const opacityKeyTimes = isLeft ? "0;0.01;0.2;0.228;1" : "0;0.47;0.49;0.68;0.72;1";
	const radiusKeyTimes = isLeft ? "0;0.01;0.08;0.17;0.228;1" : "0;0.49;0.55;0.65;0.72;1";
	const opacityValues = isLeft ? "0;1;1;0;0" : "0;0;1;1;0;0";

	return (
		<svg
			aria-hidden="true"
			className={cn(
				"block h-[13.75rem] w-full overflow-visible text-primary max-[48rem]:hidden",
				!isLeft && "-scale-x-100",
			)}
			preserveAspectRatio="none"
			viewBox="0 0 360 220"
		>
			<path
				className="fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round] [stroke-opacity:0.24]"
				d={RAIL_PATH}
			/>

			{DOT_DELAYS.map((begin, index) => (
				<circle
					className={cn(
						"fill-current drop-shadow-[0_0_1.5px_color-mix(in_srgb,var(--primary)_22%,transparent)] motion-reduce:hidden",
						DOT_TONE_CLASSES[index],
					)}
					cx="0"
					cy="0"
					key={begin}
					r="2"
				>
					<animate
						attributeName="opacity"
						begin={begin}
						dur="5.3s"
						keyTimes={opacityKeyTimes}
						repeatCount="indefinite"
						values={opacityValues}
					/>

					<animate
						attributeName="r"
						begin={begin}
						dur="5.3s"
						keyTimes={radiusKeyTimes}
						repeatCount="indefinite"
						values="1.65;1.85;2.2;1.95;1.65;1.65"
					/>

					<animateMotion
						begin={begin}
						calcMode="linear"
						dur="5.3s"
						keyPoints="0;0;1;1"
						keyTimes={motionKeyTimes}
						path={isLeft ? RAIL_PATH : REVERSED_RAIL_PATH}
						repeatCount="indefinite"
					/>
				</circle>
			))}
		</svg>
	);
};
