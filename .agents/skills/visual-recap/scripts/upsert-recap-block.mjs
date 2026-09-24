#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const START_MARKER = "<!-- system-recap:start -->";
export const END_MARKER = "<!-- system-recap:end -->";

const countOccurrences = (value, marker) => value.split(marker).length - 1;

export const validateRecapBlock = (value) => {
	const block = value.trim();
	const startCount = countOccurrences(block, START_MARKER);
	const endCount = countOccurrences(block, END_MARKER);

	if (
		startCount !== 1 ||
		endCount !== 1 ||
		!block.startsWith(START_MARKER) ||
		!block.endsWith(END_MARKER) ||
		block.indexOf(END_MARKER) <= block.indexOf(START_MARKER)
	) {
		throw new Error("recap block must contain one ordered marker pair and no text outside it");
	}

	return block;
};

export const upsertRecapBlock = (body, recapBlock) => {
	const block = validateRecapBlock(recapBlock);
	const startCount = countOccurrences(body, START_MARKER);
	const endCount = countOccurrences(body, END_MARKER);

	if (startCount === 0 && endCount === 0) {
		return body.trimEnd() ? `${body.trimEnd()}\n\n${block}\n` : `${block}\n`;
	}

	if (startCount !== 1 || endCount !== 1) {
		throw new Error("PR body contains incomplete or duplicate system recap markers");
	}

	const startIndex = body.indexOf(START_MARKER);
	const endIndex = body.indexOf(END_MARKER);

	if (endIndex <= startIndex) {
		throw new Error("PR body contains out-of-order system recap markers");
	}

	return body.slice(0, startIndex) + block + body.slice(endIndex + END_MARKER.length);
};

export const resolvePrRef = (prNumber) => {
	if (process.env.PR_COCKPIT_REF) {
		const ref = process.env.PR_COCKPIT_REF;
		return ref.includes("#") ? ref : `${ref}#${prNumber}`;
	}

	const remote = execFileSync("git", ["remote", "get-url", "origin"], { encoding: "utf8" }).trim();
	const match = remote.match(/[:/]([^/]+\/[^/.]+?)(?:\.git)?$/);

	if (!match) {
		throw new Error("cannot resolve owner/repo from git remote origin; set PR_COCKPIT_REF");
	}

	return `${match[1]}#${prNumber}`;
};

const readPrBody = (ref) => {
	const raw = execFileSync("pr-cockpit", [ref, "--json"], { encoding: "utf8" });
	const data = JSON.parse(raw);

	if (typeof data.body === "string") {
		return data.body;
	}

	if (data.pullRequest && typeof data.pullRequest.body === "string") {
		return data.pullRequest.body;
	}

	throw new Error("pr-cockpit JSON did not include a PR body");
};

const writePrBody = (ref, body) => {
	const directory = mkdtempSync(join(tmpdir(), "cashlift-recap-"));
	const bodyFile = join(directory, "body.md");

	writeFileSync(bodyFile, body);
	execFileSync("pr-cockpit", ["edit-body", ref, "--body-file", bodyFile]);
};

const main = () => {
	const [prNumber, blockFile] = process.argv.slice(2);

	if (!prNumber || !blockFile || !/^\d+$/.test(prNumber)) {
		throw new Error("usage: upsert-recap-block.mjs <pr-number> <block-file>");
	}

	const ref = resolvePrRef(prNumber);
	const block = readFileSync(blockFile, "utf8");
	const body = readPrBody(ref);
	const nextBody = upsertRecapBlock(body, block);

	writePrBody(ref, nextBody);

	console.log(
		startCountFor(body) ? `updated system recap on PR #${prNumber}` : `added system recap to PR #${prNumber}`,
	);
};

const startCountFor = (body) => countOccurrences(body, START_MARKER);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		main();
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
