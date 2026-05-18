export const sumAmounts = <Item>(items: Item[], getAmountCents: (item: Item) => number) =>
	items.reduce((total, item) => total + getAmountCents(item), 0);
