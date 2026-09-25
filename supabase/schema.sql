create table if not exists companies (
	id text primary key,
	name text not null,
	industry text not null check (industry in ('agency', 'consulting', 'software-services')),
	cash_balance_cents bigint not null check (cash_balance_cents >= 0),
	cash_buffer_target_cents bigint not null check (cash_buffer_target_cents >= 0),
	monthly_payroll_cents bigint not null check (monthly_payroll_cents >= 0),
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
	amount_cents bigint not null check (amount_cents >= 0),
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
	amount_cents bigint not null check (amount_cents >= 0),
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
	amount_cents bigint not null check (amount_cents >= 0),
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
	amount_cents bigint not null check (amount_cents >= 0),
	category text not null check (category in ('software', 'travel', 'contractor', 'marketing', 'hardware')),
	reason text not null,
	status text not null check (status in ('pending', 'approved', 'rejected')),
	decided_by text,
	decided_at timestamptz,
	requested_date date not null,
	needed_by_date date not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists team_budgets (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	team text not null,
	monthly_budget_cents bigint not null check (monthly_budget_cents >= 0),
	committed_cents bigint not null check (committed_cents >= 0),
	approved_cents bigint not null check (approved_cents >= 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists cash_actions (
	id text primary key,
	company_id text not null references companies(id) on delete cascade,
	type text not null check (type in ('approval', 'collection', 'vendor-leak', 'cash-buffer', 'forecast')),
	title text not null,
	description text not null,
	impact_cents bigint not null check (impact_cents >= 0),
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
	opening_balance_cents bigint not null check (opening_balance_cents >= 0),
	inflow_cents bigint not null check (inflow_cents >= 0),
	outflow_cents bigint not null check (outflow_cents >= 0),
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


-- Demo seed data lives in supabase/seed.sql
