const buildProductionServer = (port: string) => `pnpm exec next build && pnpm exec next start --port ${port}`;

const startProductionServer = (port: string) => `pnpm exec next start --port ${port}`;

export const resolveDemoWebServerCommand = (port: string) =>
	process.env.CI ? startProductionServer(port) : buildProductionServer(port);

export const resolveProductionWebServerCommand = (port: string) =>
	process.env.CI ? startProductionServer(port) : buildProductionServer(port);
