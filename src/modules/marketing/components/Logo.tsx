import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";

export const Logo = () => (
	<Link href="/" className="shrink-0">
		<Image src={logo} alt="CashLift Logo" width={166} height={32} priority className="h-8 w-auto shrink-0" />
	</Link>
);
