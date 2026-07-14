"use client";

import { type KeyboardEvent, type MouseEvent, type ReactNode, useRef } from "react";

type MobileNavDisclosureProps = {
	children: ReactNode;
};

export const MobileNavDisclosure = ({ children }: MobileNavDisclosureProps) => {
	const disclosureRef = useRef<HTMLDetailsElement>(null);

	const closeAfterNavigation = (event: MouseEvent<HTMLDetailsElement>) => {
		if (event.target instanceof Element && event.target.closest("a")) {
			disclosureRef.current?.removeAttribute("open");
		}
	};

	const closeAfterKeyboardNavigation = (event: KeyboardEvent<HTMLDetailsElement>) => {
		if (event.key === "Enter" && event.target instanceof Element && event.target.closest("a")) {
			disclosureRef.current?.removeAttribute("open");
		}
	};

	return (
		<details
			className="group/nav lg:hidden"
			onClick={closeAfterNavigation}
			onKeyDown={closeAfterKeyboardNavigation}
			ref={disclosureRef}
		>
			{children}
		</details>
	);
};
