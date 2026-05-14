import type { CompanyRole } from "@/modules/base/finance/types";

export const roleOptions: Array<{
	label: string;
	value: CompanyRole;
}> = [
	{ label: "Finance", value: "owner-finance" },
	{ label: "Manager", value: "manager" },
	{ label: "Employee", value: "employee" },
];
