import { useSyncExternalStore } from "react";

/**
 * `true` in the browser after the client snapshot applies; `false` during SSR and
 * while React uses the server snapshot for hydration, so the first paint can match
 * server HTML and you avoid hydration mismatches for client-only or non-deterministic UI.
 *
 * Uses `useSyncExternalStore` with a noop subscription: there is no external store; the
 * server snapshot and client snapshot encode “not yet client” vs “client”. Unlike
 * `useEffect` + `setState`, the next client-only render is not delayed until after commit on client navigations.
 *
 * @see https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-use-sync-external-store#usesyncexternalstore
 */
export const useMounted = () =>
	useSyncExternalStore(
		() => () => undefined,
		() => true,
		() => false,
	);
