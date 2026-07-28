"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/components/Button";

type CheckoutActionButtonProps = {
	planName: string;
};

export const CheckoutActionButton = ({ planName }: CheckoutActionButtonProps) => {
	const [message, setMessage] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const startCheckout = () => {
		setMessage(null);
		setSubmitting(true);

		window.setTimeout(() => {
			setSubmitting(false);
			setMessage(`Checkout is ready for ${planName}. Stripe wiring comes next.`);
		}, 500);
	};

	return (
		<div className="mt-8">
			<Button
				aria-describedby={message ? "checkout-action-message" : undefined}
				disabled={submitting}
				onPress={startCheckout}
				variant="primary"
				className="h-14 w-full text-m+"
			>
				{submitting ? "Opening secure checkout..." : "Continue to secure checkout"}
				<ArrowRight aria-hidden className="size-5" />
			</Button>

			{message && (
				<p
					aria-live="polite"
					id="checkout-action-message"
					className="mt-3 rounded-md border border-primary-subtle-border bg-primary-subtle px-3 py-2 text-s leading-5 text-primary"
				>
					{message}
				</p>
			)}
		</div>
	);
};
