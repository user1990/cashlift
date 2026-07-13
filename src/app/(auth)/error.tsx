"use client";

import { Button } from "@/ui/components/Button";
import { AuthState } from "./_components/AuthState";

type AuthErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function AuthError({ error: _error, reset }: AuthErrorProps) {
	return (
		<div role="alert">
			<AuthState
				description="We could not prepare authentication. Please try again."
				title="Authentication unavailable"
			>
				<Button className="mt-6" onPress={reset} variant="secondary">
					Try again
				</Button>
			</AuthState>
		</div>
	);
}
