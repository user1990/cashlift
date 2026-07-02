"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type ChartFrameProps = {
	children: ReactNode;
};

export const ChartFrame = ({ children }: ChartFrameProps) => {
	const frameRef = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const frame = frameRef.current;

		if (!frame) {
			return;
		}

		const updateReadyState = () => {
			const { height, width } = frame.getBoundingClientRect();

			setReady(width > 0 && height > 0);
		};
		const resizeObserver = new ResizeObserver(updateReadyState);

		updateReadyState();
		resizeObserver.observe(frame);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div ref={frameRef} aria-hidden="true" className="h-60 min-w-0">
			{ready ? children : null}
		</div>
	);
};
