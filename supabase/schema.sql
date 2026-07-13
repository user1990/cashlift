create table if not exists companies (
	id text primary key,
	name text not null,
	industry text not null check (industry in ('agency', 'consulting', 'software-services')),
	cash_balance_cents integer not null check (cash_balance_cents >= 0),
	cash_buffer_target_cents integer not null check (cash_buffer_target_cents >= 0),
	monthly_payroll_cents integer not null check (monthly_payroll_cents >= 0),
	default_role text not null check (default_role in ('owner-finance', 'manager', 'employee')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists company_members (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	clerk_user_id text not null unique,
	name text not null,
	role text not null check (role in ('owner-finance', 'manager', 'employee')),
	team text not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists invoices (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	client text not null,
	amount_cents integer not null check (amount_cents >= 0),
	due_date date not null,
	status text not null check (status in ('sent', 'overdue', 'promised', 'paid')),
	owner text not null,
	collection_probability integer not null check (collection_probability between 0 and 100),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists vendor_bills (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	vendor text not null,
	amount_cents integer not null check (amount_cents >= 0),
	due_date date not null,
	status text not null check (status in ('scheduled', 'needs-review', 'approved')),
	category text not null check (category in ('software', 'contractor', 'operations', 'tax', 'payroll')),
	essential boolean not null default false,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	vendor text not null,
	amount_cents integer not null check (amount_cents >= 0),
	renewal_date date not null,
	status text not null check (status in ('active', 'unused', 'duplicate', 'trial')),
	usage_percent integer not null check (usage_percent between 0 and 100),
	owner text not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists spend_requests (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	requester text not null,
	team text not null,
	vendor text not null,
	amount_cents integer not null check (amount_cents >= 0),
	category text not null check (category in ('software', 'travel', 'contractor', 'marketing', 'hardware')),
	reason text not null,
	status text not null check (status in ('pending', 'approved', 'rejected')),
	requested_date date not null,
	needed_by_date date not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists team_budgets (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	team text not null,
	monthly_budget_cents integer not null check (monthly_budget_cents >= 0),
	committed_cents integer not null check (committed_cents >= 0),
	approved_cents integer not null check (approved_cents >= 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists cash_actions (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	type text not null check (type in ('approval', 'collection', 'vendor-leak', 'cash-buffer', 'forecast')),
	title text not null,
	description text not null,
	impact_cents integer not null check (impact_cents >= 0),
	due_date date not null,
	priority text not null check (priority in ('critical', 'high', 'medium', 'low')),
	owner text not null,
	status text not null check (status in ('open', 'done')),
	visible_to text[] not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists forecast_points (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	date date not null,
	opening_balance_cents integer not null check (opening_balance_cents >= 0),
	inflow_cents integer not null check (inflow_cents >= 0),
	outflow_cents integer not null check (outflow_cents >= 0),
	scenario text not null check (scenario in ('base', 'delayed-client', 'approved-spend')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table companies enable row level security;
alter table company_members enable row level security;
alter table invoices enable row level security;
alter table vendor_bills enable row level security;
alter table subscriptions enable row level security;
alter table spend_requests enable row level security;
alter table team_budgets enable row level security;
alter table cash_actions enable row level security;
alter table forecast_points enable row level security;

create index if not exists company_members_clerk_user_id_idx on company_members(clerk_user_id);
create index if not exists invoices_company_due_date_idx on invoices(company_id, due_date);
create index if not exists vendor_bills_company_due_date_idx on vendor_bills(company_id, due_date);
create index if not exists subscriptions_company_renewal_date_idx on subscriptions(company_id, renewal_date);
create index if not exists spend_requests_company_needed_by_date_idx on spend_requests(company_id, needed_by_date);
create index if not exists team_budgets_company_team_idx on team_budgets(company_id, team);
create index if not exists cash_actions_company_due_date_idx on cash_actions(company_id, due_date);
create index if not exists forecast_points_company_date_idx on forecast_points(company_id, date);

create or replace function provision_company_workspace(
	company_id text,
	company_industry text,
	company_name text,
	member_id text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
	current_clerk_user_id text := auth.jwt() ->> 'sub';
	existing_company_id text;
begin
	if current_clerk_user_id is null then
		raise exception 'An authenticated identity is required to provision a company workspace.';
	end if;

	if length(trim(company_name)) < 2 or length(company_name) > 120 then
		raise exception 'Company workspace name must contain between 2 and 120 characters.';
	end if;

	select company_members.company_id into existing_company_id
	from company_members
	where clerk_user_id = current_clerk_user_id;

	if existing_company_id is not null then
		return existing_company_id;
	end if;

	insert into companies (
		id,
		name,
		industry,
		cash_balance_cents,
		cash_buffer_target_cents,
		monthly_payroll_cents,
		default_role
	) values (
		company_id,
		trim(company_name),
		company_industry,
		0,
		0,
		0,
		'owner-finance'
	);

	insert into company_members (id, company_id, clerk_user_id, name, role, team)
	values (member_id, company_id, current_clerk_user_id, 'Workspace owner', 'owner-finance', 'Finance');

	return company_id;
end;
$$;

revoke all on function provision_company_workspace(text, text, text, text) from public;
grant execute on function provision_company_workspace(text, text, text, text) to authenticated;

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
