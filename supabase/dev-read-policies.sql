drop policy if exists "Allow demo company reads" on companies;
create policy "Allow demo company reads"
	on companies
	for select
	to anon
	using (id = 'studio-nova');

drop policy if exists "Allow demo company member reads" on company_members;
create policy "Allow demo company member reads"
	on company_members
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo invoice reads" on invoices;
create policy "Allow demo invoice reads"
	on invoices
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo vendor bill reads" on vendor_bills;
create policy "Allow demo vendor bill reads"
	on vendor_bills
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo subscription reads" on subscriptions;
create policy "Allow demo subscription reads"
	on subscriptions
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo spend request reads" on spend_requests;
create policy "Allow demo spend request reads"
	on spend_requests
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo team budget reads" on team_budgets;
create policy "Allow demo team budget reads"
	on team_budgets
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo cash action reads" on cash_actions;
create policy "Allow demo cash action reads"
	on cash_actions
	for select
	to anon
	using (company_id = 'studio-nova');

drop policy if exists "Allow demo forecast point reads" on forecast_points;
create policy "Allow demo forecast point reads"
	on forecast_points
	for select
	to anon
	using (company_id = 'studio-nova');
