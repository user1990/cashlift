"use client";

import { type ReactNode, useState, useSyncExternalStore } from "react";

type ChartFrameProps = {
	children: ReactNode;
};

type ChartFrameStore = {
	frame: HTMLDivElement | null;
	ready: boolean;
	resizeObserver: ResizeObserver | null;
	subscribers: Set<() => void>;
};

export const ChartFrame = ({ children }: ChartFrameProps) => {
	const [store] = useState(createChartFrameStore);
	const ready = useSyncExternalStore(
		(onStoreChange) => subscribeToChartFrame(store, onStoreChange),
		() => getChartFrameSnapshot(store),
		getServerChartFrameSnapshot,
	);

	return (
		<div ref={(frame) => setChartFrameElement(store, frame)} aria-hidden="true" className="h-60 min-w-0">
			{ready ? children : null}
		</div>
	);
};

function createChartFrameStore(): ChartFrameStore {
	return {
		frame: null,
		ready: false,
		resizeObserver: null,
		subscribers: new Set(),
	};
}

function subscribeToChartFrame(store: ChartFrameStore, onStoreChange: () => void) {
	store.subscribers.add(onStoreChange);
	startChartFrameObserver(store);

	return () => {
		store.subscribers.delete(onStoreChange);

		if (!store.subscribers.size) {
			stopChartFrameObserver(store);
		}
	};
}

function setChartFrameElement(store: ChartFrameStore, frame: HTMLDivElement | null) {
	if (store.frame === frame) {
		return;
	}

	store.frame = frame;
	startChartFrameObserver(store);
	updateChartFrameReadyState(store);
}

function startChartFrameObserver(store: ChartFrameStore) {
	if (!store.frame || store.resizeObserver || typeof ResizeObserver === "undefined") {
		return;
	}

	store.resizeObserver = new ResizeObserver(() => updateChartFrameReadyState(store));
	store.resizeObserver.observe(store.frame);
}

function stopChartFrameObserver(store: ChartFrameStore) {
	store.resizeObserver?.disconnect();
	store.resizeObserver = null;
}

function updateChartFrameReadyState(store: ChartFrameStore) {
	const { frame } = store;
	const ready = frame ? isChartFrameReady(frame) : false;

	if (store.ready === ready) {
		return;
	}

	store.ready = ready;

	for (const subscriber of store.subscribers) {
		subscriber();
	}
}

function isChartFrameReady(frame: HTMLDivElement) {
	const { height, width } = frame.getBoundingClientRect();

	return width > 0 && height > 0;
}

function getChartFrameSnapshot(store: ChartFrameStore) {
	return store.ready;
}

function getServerChartFrameSnapshot() {
	return false;
}
