"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

export const usePathKeyedDrawer = (desktopMediaQuery: string) => {
	const drawerId = useId();
	const pathname = usePathname() ?? "";
	const [openPath, setOpenPath] = useState<string | null>(null);
	const open = openPath === pathname;

	useEffect(() => {
		if (!open || typeof window.matchMedia !== "function") {
			return;
		}

		const mediaQuery = window.matchMedia(desktopMediaQuery);
		const closeOnDesktop = () => {
			if (mediaQuery.matches) {
				setOpenPath(null);
			}
		};

		closeOnDesktop();
		mediaQuery.addEventListener("change", closeOnDesktop);

		return () => mediaQuery.removeEventListener("change", closeOnDesktop);
	}, [desktopMediaQuery, open]);

	const closeDrawer = () => {
		setOpenPath(null);
	};

	const toggleDrawer = () => {
		setOpenPath((currentPath) => (currentPath === pathname ? null : pathname));
	};

	return { closeDrawer, drawerId, open, toggleDrawer };
};
