import Link from "next/link";

export const Logo = () => (
	<Link aria-label="CashLift home" href="/" className="shrink-0">
		<svg
			aria-hidden
			className="h-7 w-auto shrink-0"
			fill="none"
			viewBox="0 0 300 58"
			width={166}
			height={32}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>CashLift wordmark</title>

			<text fill="#22c77a" fontFamily="Arial Black, Arial, sans-serif" fontSize="58" fontWeight="900" x="0" y="48">
				Cash
			</text>

			<text fill="#02daeb" fontFamily="Arial Black, Arial, sans-serif" fontSize="58" fontWeight="900" x="149" y="48">
				Lift
			</text>
		</svg>
	</Link>
);
