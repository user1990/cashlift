create or replace function current_user_company_ids()
returns setof text
language sql
security definer
set search_path = public
as $$
	select company_id
	from company_members
	where clerk_user_id = auth.jwt() ->> 'sub'
$$;

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

drop policy if exists "Members can read own company" on companies;
create policy "Members can read own company"
	on companies
	for select
	to authenticated
	using (id in (select current_user_company_ids()));

drop policy if exists "Members can read company members" on company_members;
create policy "Members can read company members"
	on company_members
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Members can read invoices" on invoices;
create policy "Members can read invoices"
	on invoices
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Members can read vendor bills" on vendor_bills;
create policy "Members can read vendor bills"
	on vendor_bills
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Members can read subscriptions" on subscriptions;
create policy "Members can read subscriptions"
	on subscriptions
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Members can read spend requests" on spend_requests;
create policy "Members can read spend requests"
	on spend_requests
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Approvers can update spend requests" on spend_requests;
create policy "Approvers can update spend requests"
	on spend_requests
	for update
	to authenticated
	using (
		company_id in (
			select company_id
			from company_members
			where clerk_user_id = auth.jwt() ->> 'sub'
				and role in ('owner-finance', 'manager')
		)
	)
	with check (
		company_id in (
			select company_id
			from company_members
			where clerk_user_id = auth.jwt() ->> 'sub'
				and role in ('owner-finance', 'manager')
		)
	);

drop policy if exists "Members can read team budgets" on team_budgets;
create policy "Members can read team budgets"
	on team_budgets
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Members can read cash actions" on cash_actions;
create policy "Members can read cash actions"
	on cash_actions
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));

drop policy if exists "Members can read forecast points" on forecast_points;
create policy "Members can read forecast points"
	on forecast_points
	for select
	to authenticated
	using (company_id in (select current_user_company_ids()));
