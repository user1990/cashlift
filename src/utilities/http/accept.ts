export type NegotiatedContentType = "text/html" | "text/markdown";

type AcceptEntry = {
	position: number;
	q: number;
	specificity: number;
	type: string;
};

const PRODUCED_CONTENT_TYPES: readonly NegotiatedContentType[] = ["text/html", "text/markdown"];

export const preferredContentType = (header: string | null): NegotiatedContentType | null => {
	if (!header) {
		return "text/html";
	}

	const entries = parseAccept(header);

	if (entries.length === 0) {
		return "text/html";
	}

	let bestContentType: NegotiatedContentType | null = null;
	let bestPosition = Number.POSITIVE_INFINITY;
	let bestQ = -1;

	for (const contentType of PRODUCED_CONTENT_TYPES) {
		const match = getMostSpecificMatch(entries, contentType);

		if (!match || match.q <= 0) {
			continue;
		}

		if (match.q > bestQ || (match.q === bestQ && match.position < bestPosition)) {
			bestContentType = contentType;
			bestPosition = match.position;
			bestQ = match.q;
		}
	}

	return bestContentType;
};

function parseAccept(header: string): AcceptEntry[] {
	return header.split(",").map((raw, position) => {
		const parts = raw
			.trim()
			.split(";")
			.map((part) => part.trim());
		const type = parts[0]?.toLowerCase() ?? "";
		const qParameter = parts.slice(1).find((part) => part.toLowerCase().startsWith("q="));
		const parsedQ = qParameter ? Number(qParameter.slice(2)) : 1;

		return {
			position,
			q: Number.isNaN(parsedQ) ? 1 : Math.max(0, Math.min(1, parsedQ)),
			specificity: getSpecificity(type),
			type,
		};
	});
}

function getMostSpecificMatch(entries: AcceptEntry[], contentType: string) {
	let match: AcceptEntry | undefined;

	for (const entry of entries) {
		if (!matches(entry.type, contentType)) {
			continue;
		}

		if (
			!match ||
			entry.specificity > match.specificity ||
			(entry.specificity === match.specificity && entry.position < match.position)
		) {
			match = entry;
		}
	}

	return match;
}

function matches(acceptedType: string, contentType: string) {
	if (acceptedType === "*/*") {
		return true;
	}

	if (acceptedType.endsWith("/*")) {
		return contentType.startsWith(acceptedType.slice(0, -1));
	}

	return acceptedType === contentType;
}

function getSpecificity(type: string) {
	if (type === "*/*") {
		return 0;
	}

	return type.endsWith("/*") ? 1 : 2;
}
