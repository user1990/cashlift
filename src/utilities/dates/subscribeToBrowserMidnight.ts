export const subscribeToBrowserMidnight = (onStoreChange: () => void) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	function scheduleNextMidnight() {
		const now = new Date();
		const nextMidnight = new Date(now);
		nextMidnight.setHours(24, 0, 0, 0);

		timeoutId = setTimeout(() => {
			onStoreChange();
			scheduleNextMidnight();
		}, nextMidnight.getTime() - now.getTime());
	}

	scheduleNextMidnight();

	return () => clearTimeout(timeoutId);
};
