const buildProductionServer = (port: string) => `pnpm exec next build && pnpm exec next start --port ${port}`;

const startProductionServer = (port: string) => `pnpm exec next start --port ${port}`;

const demoDevServer = (port: string) => `pnpm dev --port ${port}`;

export const resolveDemoWebServerCommand = (port: string) => {
	if (process.env.CI) {
		return demoDevServer(port);
	}

	return buildProductionServer(port);
};

export const resolveProductionWebServerCommand = (port: string) =>
	process.env.CI ? startProductionServer(port) : buildProductionServer(port);
