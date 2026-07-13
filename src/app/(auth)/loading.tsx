import { AuthState } from "./_components/AuthState";

export default function AuthLoading() {
	return (
		<div aria-live="polite" role="status">
			<AuthState description="Preparing a secure sign-in experience." title="Loading authentication" />
		</div>
	);
}
