import { cn } from "@/ui/utils/cn";

type AuthDotRailProps = {
	side: "left" | "right";
};

const RAIL_PATH = "M0 132 H190 L260 76 H360";
const REVERSED_RAIL_PATH = "M360 76 H260 L190 132 H0";
const DOT_DELAYS = Array.from({ length: 9 }, (_, index) => `${index * 0.18}s`);
const DOT_TONE_CLASSES = [
	"text-[color-mix(in_srgb,var(--violet)_72%,var(--primary))] opacity-80",
	"text-[color-mix(in_srgb,var(--violet)_48%,var(--primary))] opacity-[0.76]",
	"text-primary opacity-[0.72]",
	"text-primary opacity-[0.68]",
	"text-primary-hover opacity-[0.62]",
	"text-[color-mix(in_srgb,var(--primary)_82%,var(--signal))] opacity-[0.56]",
	"text-[color-mix(in_srgb,var(--primary)_68%,var(--signal))] opacity-50",
	"text-primary-muted opacity-40",
	"text-primary-muted opacity-30",
] as const;

export const AuthDotRail = ({ side }: AuthDotRailProps) => {
	const isLeft = side === "left";
	const motionKeyTimes = isLeft ? "0;0.01;0.228;1" : "0;0.49;0.708;1";
	const opacityKeyTimes = isLeft ? "0;0.01;0.2;0.228;1" : "0;0.47;0.49;0.68;0.72;1";
	const opacityValues = isLeft ? "0;1;1;0;0" : "0;0;1;1;0;0";

	return (
		<svg
			aria-hidden="true"
			className={cn(
				"block h-[13.75rem] w-full overflow-visible text-primary opacity-75 motion-reduce:hidden max-[48rem]:hidden",
				!isLeft && "-scale-x-100",
			)}
			preserveAspectRatio="none"
			viewBox="0 0 360 220"
		>
			<path
				className="fill-none stroke-[1.25] stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-opacity:0.18]"
				d={RAIL_PATH}
			/>

			{DOT_DELAYS.map((begin, index) => (
				<circle
					className={cn(
						"fill-current drop-shadow-[0_0_1.5px_color-mix(in_srgb,var(--primary)_18%,transparent)]",
						DOT_TONE_CLASSES[index],
					)}
					cx="0"
					cy="0"
					key={begin}
					r="1.8"
				>
					<animate
						attributeName="opacity"
						begin={begin}
						dur="6.4s"
						keyTimes={opacityKeyTimes}
						repeatCount="indefinite"
						values={opacityValues}
					/>

					<animateMotion
						begin={begin}
						calcMode="linear"
						dur="6.4s"
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
