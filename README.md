# Student Expense Tracking System

## Project Overview
The Student Expense Tracking System is a web-based academic project designed to help students record, organize, and monitor daily spending. The main goal is to improve financial awareness and budgeting habits through a simple, user-friendly platform.

## How the System Works

### User Journey
1. The user lands on the welcome screen.
2. The user creates an account or logs in.
3. After authentication, the user is redirected to the dashboard.
4. The user adds wallet/accounts (for example: bank, mobile money, cash).
5. The user records transactions as income or expense, selecting amount, category, and source wallet.
6. The system updates wallet balances automatically after each transaction.
7. The user can transfer funds between wallets.
8. The user can set category budgets and monitor spending progress.
9. The dashboard and analytics pages show summaries, trends, and spending breakdowns.

### Application Flow
- Routing:
	- Public routes: welcome, login, signup.
	- Protected routes: dashboard, wallets, budget, analytics.
	- Unauthenticated users are redirected to login for protected pages.
- Authentication:
	- Firebase Authentication handles signup, login, logout, and auth session state.
- State management:
	- React Context + reducer pattern manage wallets, transactions, budgets, and transfers.
	- UI updates are immediate when actions are dispatched.

### Data Storage Behavior (Current Build)
- User authentication data: managed by Firebase Auth.
- Expense-tracking data (wallets, transactions, budgets): stored in browser localStorage under a user-specific key.
- Result:
	- Data persists for the same user in the same browser.
	- Data does not automatically sync across different devices/browsers in this version.

### Key Features in Operation
- Add wallet/account with opening balance.
- Add income/expense transaction and auto-adjust wallet balance.
- Transfer funds between wallets with validation checks.
- Set and update budget limits per category.
- View recent activity, totals, budget usage, and analytics trends.

### Typical Usage Scenario
1. A student signs up and creates two wallets (for example: mobile money and cash).
2. The student logs daily expenses (food, transport, books, utilities).
3. The student sets monthly category budgets.
4. During the month, the student monitors warnings and analytics to reduce overspending.

## Lessons Learned
- Clear scope boundaries are essential to avoid feature creep.
- Early stakeholder alignment reduces rework later in development.
- Milestone-based delivery improves focus and accountability.
- Simple, reliable core features are more valuable than unfinished advanced features in semester projects.
