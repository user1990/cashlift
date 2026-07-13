import type { ReactNode } from "react";

type AuthStateProps = {
	description: string;
	title: string;
	children?: ReactNode;
};

export const AuthState = ({ children, description, title }: AuthStateProps) => (
	<div className="w-full max-w-md rounded-lg border border-border bg-panel p-6 text-panel-foreground shadow-panel">
		<p className="text-s+ uppercase tracking-normal text-primary">CashLift</p>

		<h1 className="mt-2 text-4xl+ tracking-normal">{title}</h1>

		<p className="mt-4 text-m leading-6 text-muted-foreground">{description}</p>

		{children}
	</div>
);
