import { differenceInCalendarDays, parseISO } from "date-fns";

export const dueWithinWindow = (dueDate: string, date: Date, days: number) => {
	const daysUntilDue = differenceInCalendarDays(parseISO(dueDate), date);

	return days < 0 ? daysUntilDue < 0 : daysUntilDue >= 0 && daysUntilDue <= days;
};
