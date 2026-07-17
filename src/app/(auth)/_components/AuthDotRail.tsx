import { cn } from "@/ui/utils/cn";
import styles from "./AuthGlassShell.module.css";

type AuthDotRailProps = {
	side: "left" | "right";
};

const RAIL_PATH = "M0 132 H190 L260 76 H360";
const REVERSED_RAIL_PATH = "M360 76 H260 L190 132 H0";
const DOT_DELAYS = Array.from({ length: 14 }, (_, index) => `${index * 0.016}s`);

export const AuthDotRail = ({ side }: AuthDotRailProps) => {
	const isLeft = side === "left";
	const motionKeyTimes = isLeft ? "0;0.01;0.228;1" : "0;0.49;0.708;1";
	const opacityKeyTimes = isLeft ? "0;0.01;0.2;0.228;1" : "0;0.47;0.49;0.68;0.72;1";
	const radiusKeyTimes = isLeft ? "0;0.01;0.08;0.17;0.228;1" : "0;0.49;0.55;0.65;0.72;1";
	const opacityValues = isLeft ? "0;1;1;0;0" : "0;0;1;1;0;0";

	return (
		<svg
			aria-hidden="true"
			className={cn(styles.rail, !isLeft && styles.railRight)}
			preserveAspectRatio="none"
			viewBox="0 0 360 220"
		>
			<path className={styles.railPath} d={RAIL_PATH} />

			{DOT_DELAYS.map((begin, index) => (
				<circle
					className={cn(styles.movingDot, styles[`dotTone${String(index + 1).padStart(2, "0")}`])}
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
