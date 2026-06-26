import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";

export const Logo = () => (
	<Link href="/" className="shrink-0">
		<Image src={logo} alt="CashLift Logo" width={126} height={36} priority className="h-9 w-auto shrink-0" />
	</Link>
);
