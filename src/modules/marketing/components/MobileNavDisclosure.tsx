"use client";

import { type ReactNode, useEffect, useRef } from "react";

type MobileNavDisclosureProps = {
	children: ReactNode;
};

export const MobileNavDisclosure = ({ children }: MobileNavDisclosureProps) => {
	const disclosureRef = useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		const disclosure = disclosureRef.current;

		if (!disclosure) {
			return;
		}

		const closeAfterNavigation = (event: MouseEvent) => {
			if (event.target instanceof Element && event.target.closest("a")) {
				disclosure.removeAttribute("open");
			}
		};

		disclosure.addEventListener("click", closeAfterNavigation);

		return () => disclosure.removeEventListener("click", closeAfterNavigation);
	}, []);

	return (
		<details className="group/nav lg:hidden" ref={disclosureRef}>
			{children}
		</details>
	);
};
