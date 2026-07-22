import Link from "next/link";

export const Logo = () => (
	<Link
		href="/"
		className="shrink-0 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-primary"
	>
		<svg
			aria-labelledby="cashlift-logo-title cashlift-logo-desc"
			className="h-7 w-auto shrink-0"
			fill="none"
			role="img"
			viewBox="0 0 300 58"
			width={166}
			height={32}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title id="cashlift-logo-title">CashLift Logo</title>

			<desc id="cashlift-logo-desc">CashLift wordmark.</desc>

			<text fill="#22c77a" fontFamily="Arial Black, Arial, sans-serif" fontSize="58" fontWeight="900" x="0" y="48">
				Cash
			</text>

			<text fill="#02daeb" fontFamily="Arial Black, Arial, sans-serif" fontSize="58" fontWeight="900" x="149" y="48">
				Lift
			</text>
		</svg>
	</Link>
);
