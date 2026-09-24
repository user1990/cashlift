import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./server";

vi.mock("next/navigation", () => ({
	usePathname: () => "/dashboard",
	useRouter: () => ({
		back: vi.fn(),
		forward: vi.fn(),
		prefetch: vi.fn(),
		push: vi.fn(),
		refresh: vi.fn(),
		replace: vi.fn(),
	}),
	useSearchParams: () => new URLSearchParams(),
}));

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
	vi.unstubAllEnvs();
});

afterAll(() => {
	server.close();
});
