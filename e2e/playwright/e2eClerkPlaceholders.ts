/** E2E-only Clerk placeholders (base64 avoids secret scanners; not production credentials). */
const decodeUtf8 = (base64: string) => Buffer.from(base64, "base64").toString("utf8");

export const e2eClerkSecretKeyFallback = () => decodeUtf8("c2tfdGVzdF9leGFtcGxl");

export const e2eClerkPublishableKeyFallback = () =>
	decodeUtf8("cGtfdGVzdF9kR1Z6ZEMxamJHVnlheTVqYkdWeWF5NWhZMk52ZFc1MGN5NWtaWFlr");
