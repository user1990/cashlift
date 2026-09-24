export const getFindOptionId = (itemId: string) => `find-option-${itemId}`;

export const isRelativeAppHref = (href: string) => href.startsWith("/") && !href.startsWith("//");
