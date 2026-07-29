"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DisclosureGroup } from "react-aria-components";
import { MARKETING_NAV_GROUPS } from "../navigation";
import { DesktopNavGroup } from "./DesktopNavGroup";

export const DesktopNav = () => {
	const pathname = usePathname();
	const navRef = useRef<HTMLElement>(null);
	const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const hoveredGroupRef = useRef<string | null>(null);
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

	const close = () => setExpandedKeys(new Set());
	const expand = (label: string) => setExpandedKeys(new Set([label]));
	const expandOnHover = (label: string) => {
		hoveredGroupRef.current = label;
		expand(label);
	};
	const closeOnHoverExit = (label: string) => {
		if (hoveredGroupRef.current === label) {
			hoveredGroupRef.current = null;
			close();
		}
	};

	useEffect(() => {
		const closeOnPointerDownOutside = (event: PointerEvent) => {
			if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
				setExpandedKeys(new Set());
			}
		};

		document.addEventListener("pointerdown", closeOnPointerDownOutside);

		return () => document.removeEventListener("pointerdown", closeOnPointerDownOutside);
	}, []);

	return (
		<nav
			aria-label="Main navigation"
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					close();
				}
			}}
			onKeyDown={(event) => {
				if (event.key !== "Escape" || expandedKeys.size === 0) {
					return;
				}

				event.preventDefault();
				const [expandedLabel] = expandedKeys;
				close();
				if (expandedLabel) {
					triggerRefs.current[expandedLabel]?.focus();
				}
			}}
			ref={navRef}
			className="hidden items-center gap-2 font-medium text-m text-shell-muted lg:flex"
		>
			<DisclosureGroup
				expandedKeys={expandedKeys}
				onExpandedChange={(keys) => {
					if (keys.size === 0 && hoveredGroupRef.current) {
						return;
					}

					setExpandedKeys(new Set([...keys].filter((key): key is string => typeof key === "string")));
				}}
				className="flex items-center gap-2"
			>
				{MARKETING_NAV_GROUPS.map(({ label, items }) => (
					<DesktopNavGroup
						key={label}
						group={{ items, label }}
						onClose={close}
						onHoverEnd={() => closeOnHoverExit(label)}
						onHoverStart={() => expandOnHover(label)}
						onTriggerFocus={(trigger) => {
							triggerRefs.current[label] = trigger;
						}}
						pathname={pathname}
					/>
				))}
			</DisclosureGroup>

			<Link
				href="/customers"
				className="inline-flex h-9 items-center rounded-md px-3 transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20"
			>
				Customers
			</Link>
		</nav>
	);
};
