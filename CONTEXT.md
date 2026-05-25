# Kuvro

Kuvro helps service firms make daily cash decisions across approvals, receivables, vendor spend, budgets, and runway.

## Language

**Company Workspace**:
The company-scoped operating space where members review cash actions, spend requests, invoices, vendor bills, subscriptions, budgets, and forecasts.
_Avoid_: account, tenant

**Company Member**:
A person assigned to a company workspace with a Kuvro role.
_Avoid_: user, seat

**Cash Action**:
A prioritized piece of daily finance work tied to a cash impact.
_Avoid_: task, notification

**Spend Request**:
A proposed company expense awaiting approval or rejection.
_Avoid_: purchase, reimbursement

**Vendor Bill**:
A scheduled or reviewable vendor payment owed by the company.
_Avoid_: invoice

**Subscription**:
A recurring vendor cost with renewal timing and usage context.
_Avoid_: vendor bill

**Cash Buffer**:
The company’s target reserve that should remain after expected inflows and outflows.
_Avoid_: savings goal

**13-week Cash Outlook**:
A weekly forecast of opening balance, inflow, outflow, and ending balance.
_Avoid_: chart, projection

**Vendor Leak**:
A subscription or vendor cost likely to be waste because it is unused, duplicated, or low-use trial spend.
_Avoid_: overspend

## Relationships

- A **Company Workspace** has one or more **Company Members**.
- A **Company Workspace** owns many **Cash Actions**, **Spend Requests**, **Vendor Bills**, **Subscriptions**, and forecast points for the **13-week Cash Outlook**.
- A **Cash Action** can point at approval, collection, vendor leak, cash buffer, or forecast work.
- A **Vendor Leak** is detected from a **Subscription**.
- A **Spend Request** affects the **Cash Buffer** by reducing available company cash if approved.

## Example dialogue

> **Dev:** “When a manager approves a **Spend Request**, do we call it a **Cash Action**?”
> **Domain expert:** “No. The **Spend Request** is the expense being decided. The **Cash Action** is the prioritized work item telling finance or a manager to make that decision.”

## Flagged ambiguities

- “Account” is avoided because it can mean auth identity, customer, or tenant. Use **Company Workspace** for Kuvro data scope.
- “User” is avoided in domain language when role and company scope matter. Use **Company Member**.
