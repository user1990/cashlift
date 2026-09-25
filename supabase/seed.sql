-- Studio Nova demo dataset. Apply after schema.sql (local dev / preview only).
insert into companies (
	id,
	name,
	industry,
	cash_balance_cents,
	cash_buffer_target_cents,
	monthly_payroll_cents,
	default_role
) values (
	'studio-nova',
	'Studio Nova',
	'agency',
	41200000,
	25000000,
	17800000,
	'owner-finance'
) on conflict (id) do update set
	name = excluded.name,
	industry = excluded.industry,
	cash_balance_cents = excluded.cash_balance_cents,
	cash_buffer_target_cents = excluded.cash_buffer_target_cents,
	monthly_payroll_cents = excluded.monthly_payroll_cents,
	default_role = excluded.default_role,
	updated_at = now();

insert into company_members (id, company_id, clerk_user_id, name, role, team) values
	('member-maya', 'studio-nova', 'replace_with_clerk_user_id', 'Maya', 'owner-finance', 'Finance'),
	('member-leo', 'studio-nova', 'replace_with_clerk_user_id_leo', 'Leo', 'manager', 'Creative'),
	('member-nora', 'studio-nova', 'replace_with_clerk_user_id_nora', 'Nora', 'employee', 'Client Strategy')
on conflict (id) do update set
	company_id = excluded.company_id,
	clerk_user_id = excluded.clerk_user_id,
	name = excluded.name,
	role = excluded.role,
	team = excluded.team,
	updated_at = now();

insert into invoices (id, company_id, client, amount_cents, due_date, status, owner, collection_probability) values
	('invoice-northstar', 'studio-nova', 'Northstar Labs', 1840000, '2026-04-30', 'overdue', 'Iris', 62),
	('invoice-brightline', 'studio-nova', 'Brightline Health', 2750000, '2026-05-14', 'sent', 'Maya', 88),
	('invoice-harbor', 'studio-nova', 'Harbor Retail', 960000, '2026-05-17', 'promised', 'Leo', 75),
	('invoice-summit', 'studio-nova', 'Summit Analytics', 420000, '2026-05-03', 'paid', 'Iris', 100)
on conflict (id) do update set
	company_id = excluded.company_id,
	client = excluded.client,
	amount_cents = excluded.amount_cents,
	due_date = excluded.due_date,
	status = excluded.status,
	owner = excluded.owner,
	collection_probability = excluded.collection_probability,
	updated_at = now();

insert into vendor_bills (id, company_id, vendor, amount_cents, due_date, status, category, essential) values
	('bill-contractors', 'studio-nova', 'Freelance bench', 780000, '2026-05-10', 'approved', 'contractor', true),
	('bill-payroll', 'studio-nova', 'Payroll run', 1240000, '2026-05-15', 'scheduled', 'payroll', true),
	('bill-office', 'studio-nova', 'Studio lease extras', 320000, '2026-05-13', 'needs-review', 'operations', false)
on conflict (id) do update set
	company_id = excluded.company_id,
	vendor = excluded.vendor,
	amount_cents = excluded.amount_cents,
	due_date = excluded.due_date,
	status = excluded.status,
	category = excluded.category,
	essential = excluded.essential,
	updated_at = now();

insert into subscriptions (id, company_id, vendor, amount_cents, renewal_date, status, usage_percent, owner) values
	('subscription-notion', 'studio-nova', 'Notion', 126000, '2026-05-12', 'unused', 31, 'Leo'),
	('subscription-brandforge', 'studio-nova', 'BrandForge', 680000, '2026-05-09', 'active', 94, 'Maya'),
	('subscription-survey', 'studio-nova', 'SurveyStack', 45000, '2026-05-18', 'duplicate', 12, 'Iris'),
	('subscription-ai-notes', 'studio-nova', 'MeetingAI', 90000, '2026-05-28', 'trial', 18, 'Nora')
on conflict (id) do update set
	company_id = excluded.company_id,
	vendor = excluded.vendor,
	amount_cents = excluded.amount_cents,
	renewal_date = excluded.renewal_date,
	status = excluded.status,
	usage_percent = excluded.usage_percent,
	owner = excluded.owner,
	updated_at = now();

insert into spend_requests (
	id,
	company_id,
	requester,
	team,
	vendor,
	amount_cents,
	category,
	reason,
	status,
	requested_date,
	needed_by_date
) values
	('request-brandforge', 'studio-nova', 'Leo', 'Creative', 'BrandForge', 680000, 'software', 'Annual creative suite for retained client work', 'pending', '2026-05-07', '2026-05-09'),
	('request-client-onsite', 'studio-nova', 'Nora', 'Client Strategy', 'Delta', 240000, 'travel', 'Client workshop for Q3 strategy retainer', 'pending', '2026-05-06', '2026-05-15'),
	('request-webcam', 'studio-nova', 'Nora', 'Client Strategy', 'Logitech', 38000, 'hardware', 'Replacement webcam for client calls', 'approved', '2026-05-05', '2026-05-09')
on conflict (id) do update set
	company_id = excluded.company_id,
	requester = excluded.requester,
	team = excluded.team,
	vendor = excluded.vendor,
	amount_cents = excluded.amount_cents,
	category = excluded.category,
	reason = excluded.reason,
	status = excluded.status,
	requested_date = excluded.requested_date,
	needed_by_date = excluded.needed_by_date,
	updated_at = now();

insert into team_budgets (id, company_id, team, monthly_budget_cents, committed_cents, approved_cents) values
	('budget-creative', 'studio-nova', 'Creative', 2400000, 1460000, 940000),
	('budget-strategy', 'studio-nova', 'Client Strategy', 1600000, 810000, 38000),
	('budget-ops', 'studio-nova', 'Operations', 950000, 520000, 0)
on conflict (id) do update set
	company_id = excluded.company_id,
	team = excluded.team,
	monthly_budget_cents = excluded.monthly_budget_cents,
	committed_cents = excluded.committed_cents,
	approved_cents = excluded.approved_cents,
	updated_at = now();

insert into cash_actions (
	id,
	company_id,
	type,
	title,
	description,
	impact_cents,
	due_date,
	priority,
	owner,
	status,
	visible_to
) values
	('action-approval-design-suite', 'studio-nova', 'approval', 'Decide on BrandForge annual renewal', 'Approve only if the client deposit lands before Friday. Otherwise defer by 7 days to keep the cash buffer intact.', 680000, '2026-05-09', 'critical', 'Maya', 'open', array['owner-finance', 'manager']),
	('action-collect-northstar', 'studio-nova', 'collection', 'Chase Northstar Labs invoice', 'Northstar milestone invoice is 9 days overdue. A paid date this week prevents the runway dip after payroll.', 1840000, '2026-05-10', 'critical', 'Iris', 'open', array['owner-finance', 'manager']),
	('action-cut-seat-waste', 'studio-nova', 'vendor-leak', 'Cut unused Notion seats', 'Seven seats have not logged in for 45 days. Downgrade before renewal to remove dead spend from June.', 126000, '2026-05-12', 'high', 'Leo', 'open', array['owner-finance', 'manager']),
	('action-protect-buffer', 'studio-nova', 'cash-buffer', 'Protect the $250k cash buffer', 'Payroll and contractor bills land before the largest client payment. Keep non-essential purchases pending until May 15.', 940000, '2026-05-13', 'high', 'CashLift', 'open', array['owner-finance']),
	('action-upload-receipt', 'studio-nova', 'approval', 'Upload hardware receipt', 'Submit receipt and business reason so finance can attach it to the approved project budget.', 38000, '2026-05-09', 'medium', 'Nora', 'open', array['employee', 'manager', 'owner-finance'])
on conflict (id) do update set
	company_id = excluded.company_id,
	type = excluded.type,
	title = excluded.title,
	description = excluded.description,
	impact_cents = excluded.impact_cents,
	due_date = excluded.due_date,
	priority = excluded.priority,
	owner = excluded.owner,
	status = excluded.status,
	visible_to = excluded.visible_to,
	updated_at = now();

insert into forecast_points (id, company_id, date, opening_balance_cents, inflow_cents, outflow_cents, scenario) values
	('forecast-1', 'studio-nova', '2026-05-06', 41200000, 420000, 310000, 'base'),
	('forecast-2', 'studio-nova', '2026-05-13', 41310000, 2600000, 1880000, 'base'),
	('forecast-3', 'studio-nova', '2026-05-20', 42030000, 4100000, 2960000, 'base'),
	('forecast-4', 'studio-nova', '2026-05-27', 43170000, 1900000, 3420000, 'base'),
	('forecast-5', 'studio-nova', '2026-06-03', 41650000, 5300000, 2510000, 'base'),
	('forecast-6', 'studio-nova', '2026-06-10', 44440000, 2800000, 1840000, 'base'),
	('forecast-7', 'studio-nova', '2026-06-17', 45400000, 3600000, 2320000, 'base')
on conflict (id) do update set
	company_id = excluded.company_id,
	date = excluded.date,
	opening_balance_cents = excluded.opening_balance_cents,
	inflow_cents = excluded.inflow_cents,
	outflow_cents = excluded.outflow_cents,
	scenario = excluded.scenario,
	updated_at = now();
