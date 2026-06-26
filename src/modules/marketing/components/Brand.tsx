import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.svg";

export const Brand = () => (
	<Link href="/" className="shrink-0">
		<div className="flex items-center gap-2.5">
			<Image src={logo} alt="CashLift Logo" width={36} height={36} priority className="shrink-0" />

			<span className="font-brand font-bold text-xl leading-none tracking-tight">
				<span className="text-foreground">Kuv</span>

				<span className="text-signal">ro</span>
			</span>
		</div>
	</Link>
);
