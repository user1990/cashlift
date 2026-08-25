"use client";

import { io } from "next/cache";
import { use } from "react";

export const FooterCopyright = () => {
	use(io());

	return <span>© {new Date().getFullYear()} CashLift. All rights reserved.</span>;
};
