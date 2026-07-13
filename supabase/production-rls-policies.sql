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
