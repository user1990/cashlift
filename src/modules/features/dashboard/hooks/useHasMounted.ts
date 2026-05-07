import { useSyncExternalStore } from "react";

export const useHasMounted = () => {
	return useSyncExternalStore(
		() => () => undefined,
		() => true,
		() => false,
	);
};
