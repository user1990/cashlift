"use client";

import { useEffect } from "react";

const CLERK_PASSWORD_FIELD_SELECTOR = 'input#password-field[name="password"]';

export const ClerkSignInPasswordAutocomplete = () => {
	useEffect(() => {
		const applyAutocomplete = () => {
			const passwordField = document.querySelector<HTMLInputElement>(CLERK_PASSWORD_FIELD_SELECTOR);

			if (!passwordField) {
				return false;
			}

			passwordField.autocomplete = "current-password";

			return true;
		};

		if (applyAutocomplete()) {
			return;
		}

		const observer = new MutationObserver(() => {
			if (applyAutocomplete()) {
				observer.disconnect();
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, []);

	return null;
};
